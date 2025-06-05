import 'phaser';
import { ElementType } from '../../models/ElementType';

export class Tile extends Phaser.GameObjects.Container {
    private element: ElementType;
    private sprite: Phaser.GameObjects.Rectangle;
    private isSelected: boolean = false;

    constructor(scene: Phaser.Scene, x: number, y: number, element: ElementType) {
        super(scene, x, y);
        this.element = element;
        
        // Create a temporary rectangle as placeholder
        // Later we'll replace this with proper sprites
        this.sprite = scene.add.rectangle(0, 0, 55, 55, this.getColorForElement());
        this.add(this.sprite);
        
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
        if (this.isSelected) {
            this.sprite.setStrokeStyle(3, 0xffffff);
        } else {
            this.sprite.setStrokeStyle(0);
        }
    }

    private getColorForElement(): number {
        switch (this.element) {
            case ElementType.FIRE:
                return 0xff0000;
            case ElementType.WATER:
                return 0x0000ff;
            case ElementType.WOOD:
                return 0x00ff00;
            case ElementType.LIGHT:
                return 0xffff00;
            case ElementType.DARK:
                return 0x800080;
            default:
                return 0xcccccc;
        }
    }

    public getElement(): ElementType {
        return this.element;
    }
}
