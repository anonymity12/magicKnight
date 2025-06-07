import 'phaser';
import { ElementType } from '../../models/ElementType';

export class Tile extends Phaser.GameObjects.Container {
    private element: ElementType;
    private sprite: Phaser.GameObjects.Image;
    private selectionRect: Phaser.GameObjects.Rectangle;
    private isSelected: boolean = false;

    constructor(scene: Phaser.Scene, x: number, y: number, element: ElementType) {
        super(scene, x, y);
        this.element = element;
        
        // Create sprite from loaded image
        this.sprite = scene.add.image(0, 0, this.getImageKeyForElement());
        this.sprite.setDisplaySize(55, 55);
        
        // Create selection rectangle (invisible by default)
        this.selectionRect = scene.add.rectangle(0, 0, 58, 58, 0xffffff, 0);
        this.selectionRect.setStrokeStyle(3, 0xffffff);
        
        // Add both to container
        this.add([this.selectionRect, this.sprite]);
        
        // Make interactive
        this.setSize(55, 55);
        this.setInteractive();
        
        // Add to scene
        scene.add.existing(this);
        
        // Add input handlers
        this.on('pointerdown', this.onPointerDown, this);
    }

    private onPointerDown(): void {
        this.toggleSelected();
    }

    public toggleSelected(): void {
        this.isSelected = !this.isSelected;
        this.selectionRect.setAlpha(this.isSelected ? 1 : 0);
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
