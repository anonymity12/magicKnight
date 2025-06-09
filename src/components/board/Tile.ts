import 'phaser';
import { ElementType } from '../../models/ElementType';

export class Tile extends Phaser.GameObjects.Container {
    private element: ElementType;
    private sprite: Phaser.GameObjects.Image;
    private selectionRect: Phaser.GameObjects.Rectangle;
    private coordsText: Phaser.GameObjects.Text;
    private isSelected: boolean = false;

    constructor(scene: Phaser.Scene, x: number, y: number, element: ElementType) {
        super(scene, x, y);
        this.element = element;
        
        // Create sprite from loaded image
        this.sprite = scene.add.image(0, 0, this.getImageKeyForElement());
        this.sprite.setDisplaySize(55, 55);
        
        // Create selection rectangle (invisible by default)
        this.selectionRect = scene.add.rectangle(0, 0, 58, 58, 0xff0000, 0);
        this.selectionRect.setStrokeStyle(1, 0x00ffff);
        
        // Create coordinates text (invisible by default)
        this.coordsText = scene.add.text(0, -30, '', {
            fontSize: '16px',
            color: '#ffffff',
            backgroundColor: '#000000'
        }).setOrigin(0.5, 1);
        this.coordsText.setAlpha(0);
        
        // Add all to container
        this.add([this.selectionRect, this.sprite, this.coordsText]);
        
        // Make interactive
        this.setSize(55, 55);
        this.setInteractive();
        
        // Add to scene
        scene.add.existing(this);
        
        // Add input handlers
        this.on('pointerdown', this.onPointerDown, this);
    }

    private onPointerDown(): void {
        if (this.isSelected) {
            this.clearSelect();
        } else {
            this.setSelect();
        }
    }

    public setSelect(): void {
        this.isSelected = true;
        this.selectionRect.setAlpha(1);
        this.coordsText.setText(`x:${Math.round(this.x)}\ny:${Math.round(this.y)}`);
        this.coordsText.setAlpha(1);
    }

    public clearSelect(): void {
        this.isSelected = false;
        this.selectionRect.setAlpha(0.5);
        this.coordsText.setAlpha(0.5);
    }

    private getImageKeyForElement(): string {
        switch (this.element) {
            case ElementType.WATER:
                return 'tile-blue';
            case ElementType.WOOD:
                return 'tile-green';
            case ElementType.DARK:
                return 'tile-purple';
            case ElementType.FIRE:
                return 'tile-red';
            case ElementType.LIGHT:
                return 'tile-yellow';
            default:
                return 'tile-blue'; // 默认使用蓝色
        }
    }

    public getElement(): ElementType {
        return this.element;
    }
}
