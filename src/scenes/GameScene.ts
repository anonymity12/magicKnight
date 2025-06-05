import 'phaser';
import { ElementType } from '../models/ElementType';
import { Tile } from '../components/board/Tile';

export class GameScene extends Phaser.Scene {
    private board: Tile[][] = [];
    private readonly BOARD_COLS = 5;
    private readonly BOARD_ROWS = 7;
    private readonly TILE_SIZE = 60;
    private selectedTile: Tile | null = null;

    constructor() {
        super({ key: 'GameScene' });
    }

    create(): void {
        this.createBoard();
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
                this.board[row][col] = tile;
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
