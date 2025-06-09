import 'phaser';
import { ElementType } from '../models/ElementType';
import { Tile } from '../components/board/Tile';

export class GameScene extends Phaser.Scene {
    private board: (Tile | null)[][] = [];
    private readonly BOARD_COLS = 5;
    private readonly BOARD_ROWS = 7;
    private readonly TILE_SIZE = 60;
    private selectedTile: Tile | null = null;
    private score: number = 0;
    private scoreText: Phaser.GameObjects.Text | null = null;
    private isProcessing: boolean = false;

    constructor() {
        super({ key: 'GameScene' });
    }

    create(): void {
        this.createBoard();
        this.createUI();
    }

    private createUI(): void {
        this.scoreText = this.add.text(16, 16, `Score: ${this.score}`, {
            fontSize: '32px',
            color: '#ffffff'
        });
    }

    private createBoard(): void {
        const offsetX = (this.cameras.main.width - (this.BOARD_COLS * this.TILE_SIZE)) / 2;
        const offsetY = (this.cameras.main.height - (this.BOARD_ROWS * this.TILE_SIZE)) / 2;

        for (let row = 0; row < this.BOARD_ROWS; row++) {
            this.board[row] = [];
            for (let col = 0; col < this.BOARD_COLS; col++) {
                const x = offsetX + col * this.TILE_SIZE + this.TILE_SIZE / 2;
                const y = offsetY + row * this.TILE_SIZE + this.TILE_SIZE / 2;
                
                const tile = new Tile(this, x, y, this.getRandomElement());
                tile.on('pointerdown', () => this.onTileClick(row, col));
                this.board[row][col] = tile;
            }
        }
    }

    private onTileClick(row: number, col: number): void {
        if (this.isProcessing) return;

        const clickedTile = this.board[row][col];
        if (!clickedTile) return;

        if (this.selectedTile === null) {
            this.selectedTile = clickedTile;
            clickedTile.toggleSelected();
        } else {
            if (this.selectedTile === clickedTile) {
                clickedTile.toggleSelected();
                this.selectedTile = null;
            } else if (this.areAdjacent(this.getTilePosition(this.selectedTile), { row, col })) {
                this.swapTiles(this.getTilePosition(this.selectedTile), { row, col });
            } else {
                this.selectedTile.toggleSelected();
                this.selectedTile = clickedTile;
                clickedTile.toggleSelected();
            }
        }
    }

    private async swapTiles(pos1: { row: number; col: number }, pos2: { row: number; col: number }): Promise<void> {
        this.isProcessing = true;
        const tile1 = this.board[pos1.row][pos1.col];
        const tile2 = this.board[pos2.row][pos2.col];

        if (tile1 && tile2) {
            tile1.toggleSelected();
            const tile1Pos = { x: tile1.x, y: tile1.y };
            const tile2Pos = { x: tile2.x, y: tile2.y };

            // Animate the swap
            await Promise.all([
                this.animateTile(tile1, tile2Pos),
                this.animateTile(tile2, tile1Pos)
            ]);

            // Update board array
            this.board[pos1.row][pos1.col] = tile2;
            this.board[pos2.row][pos2.col] = tile1;

            // Check for matches
            const matches = this.findMatches();
            if (matches.length > 0) {
                await this.handleMatches(matches);
            } else {
                // If no matches, swap back
                await Promise.all([
                    this.animateTile(tile1, tile1Pos),
                    this.animateTile(tile2, tile2Pos)
                ]);
                this.board[pos1.row][pos1.col] = tile1;
                this.board[pos2.row][pos2.col] = tile2;
            }
        }

        this.selectedTile = null;
        this.isProcessing = false;
    }

    private async animateTile(tile: Tile, position: { x: number; y: number }): Promise<void> {
        return new Promise((resolve) => {
            this.tweens.add({
                targets: tile,
                x: position.x,
                y: position.y,
                duration: 200,
                onComplete: () => resolve()
            });
        });
    }

    private getTilePosition(tile: Tile): { row: number; col: number } {
        for (let row = 0; row < this.BOARD_ROWS; row++) {
            for (let col = 0; col < this.BOARD_COLS; col++) {
                if (this.board[row][col] === tile) {
                    return { row, col };
                }
            }
        }
        return { row: -1, col: -1 };
    }

    private areAdjacent(pos1: { row: number; col: number }, pos2: { row: number; col: number }): boolean {
        const rowDiff = Math.abs(pos1.row - pos2.row);
        const colDiff = Math.abs(pos1.col - pos2.col);
        return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
    }

    private findMatches(): { row: number; col: number }[][] {
        const matches: { row: number; col: number }[][] = [];
        
        // Check horizontal matches
        for (let row = 0; row < this.BOARD_ROWS; row++) {
            let currentMatch = [{ row, col: 0 }];
            for (let col = 1; col < this.BOARD_COLS; col++) {
                if (this.board[row][col]?.getElement() === this.board[row][col - 1]?.getElement()) {
                    currentMatch.push({ row, col });
                } else {
                    if (currentMatch.length >= 3) {
                        matches.push([...currentMatch]);
                    }
                    currentMatch = [{ row, col }];
                }
            }
            if (currentMatch.length >= 3) {
                matches.push(currentMatch);
            }
        }

        // Check vertical matches
        for (let col = 0; col < this.BOARD_COLS; col++) {
            let currentMatch = [{ row: 0, col }];
            for (let row = 1; row < this.BOARD_ROWS; row++) {
                if (this.board[row][col]?.getElement() === this.board[row - 1][col]?.getElement()) {
                    currentMatch.push({ row, col });
                } else {
                    if (currentMatch.length >= 3) {
                        matches.push([...currentMatch]);
                    }
                    currentMatch = [{ row, col }];
                }
            }
            if (currentMatch.length >= 3) {
                matches.push(currentMatch);
            }
        }

        return matches;
    }

    private async handleMatches(matches: { row: number; col: number }[][]): Promise<void> {
        // Calculate score
        const totalMatches = matches.reduce((sum, match) => sum + match.length, 0);
        this.score += totalMatches * 10;
        if (this.scoreText) {
            this.scoreText.setText(`Score: ${this.score}`);
        }

        // Remove matched tiles with animation
        const removedTiles = new Set<Tile>();
        matches.forEach(match => {
            match.forEach(pos => {
                const tile = this.board[pos.row][pos.col];
                if (tile && !removedTiles.has(tile)) {
                    removedTiles.add(tile);
                    this.tweens.add({
                        targets: tile,
                        alpha: 0,
                        scale: 0.5,
                        duration: 200,
                        onComplete: () => tile.destroy()
                    });
                    this.board[pos.row][pos.col] = null;
                }
            });
        });

        // Wait for animations to complete
        await new Promise(resolve => setTimeout(resolve, 250));

        // Move tiles down
        await this.moveDownTiles();

        // Fill empty spaces
        this.fillEmptySpaces();

        // Check for new matches
        const newMatches = this.findMatches();
        if (newMatches.length > 0) {
            await this.handleMatches(newMatches);
        }
    }

    private async moveDownTiles(): Promise<void> {
        const moves: Promise<void>[] = [];

        for (let col = 0; col < this.BOARD_COLS; col++) {
            let emptySpaces = 0;
            for (let row = this.BOARD_ROWS - 1; row >= 0; row--) {
                const tile = this.board[row][col];
                if (!tile) {
                    emptySpaces++;
                } else if (emptySpaces > 0) {
                    const newRow = row + emptySpaces;
                    const newY = tile.y + (emptySpaces * this.TILE_SIZE);
                    
                    this.board[newRow][col] = tile;
                    this.board[row][col] = null;
                    
                    // 创建完成动画后的回调，以更新方块的实际坐标
                    const animationPromise = new Promise<void>((resolve) => {
                        this.tweens.add({
                            targets: tile,
                            x: tile.x, // x保持不变
                            y: newY,
                            duration: 200,
                            onComplete: () => {
                                tile.y = newY; // 更新方块的实际Y坐标
                                resolve();
                            }
                        });
                    });
                    
                    moves.push(animationPromise);
                }
            }
        }

        await Promise.all(moves);
    }

    private fillEmptySpaces(): void {
        const offsetX = (this.cameras.main.width - (this.BOARD_COLS * this.TILE_SIZE)) / 2;
        const offsetY = (this.cameras.main.height - (this.BOARD_ROWS * this.TILE_SIZE)) / 2;

        for (let col = 0; col < this.BOARD_COLS; col++) {
            for (let row = 0; row < this.BOARD_ROWS; row++) {
                if (!this.board[row][col]) {
                    const x = offsetX + col * this.TILE_SIZE + this.TILE_SIZE / 2;
                    const y = offsetY + row * this.TILE_SIZE + this.TILE_SIZE / 2;
                    
                    const newTile = new Tile(this, x, y, this.getRandomElement());
                    newTile.on('pointerdown', () => this.onTileClick(row, col));
                    newTile.setAlpha(0);
                    
                    this.tweens.add({
                        targets: newTile,
                        alpha: 1,
                        duration: 200
                    });
                    
                    this.board[row][col] = newTile;
                }
            }
        }
    }

    private getRandomElement(): ElementType {
        const elements = [
            ElementType.FIRE,
            ElementType.WATER,
            ElementType.WOOD,
            ElementType.LIGHT,
            ElementType.DARK
        ];
        return elements[Math.floor(Math.random() * elements.length)];
    }
}
