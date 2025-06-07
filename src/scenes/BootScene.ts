import 'phaser';

export class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload(): void {
        // Load tile images
        this.load.image('tile-blue', 'src/pictures/T_Block_Blue_AB_64.png');
        this.load.image('tile-green', 'src/pictures/T_Block_Green_AB_64.png');
        this.load.image('tile-purple', 'src/pictures/T_Block_Purple_AB_64.png');
        this.load.image('tile-red', 'src/pictures/T_Block_Red_AB_128.png');
        this.load.image('tile-yellow', 'src/pictures/T_Block_Yellow_AB_64.png');
    }

    create(): void {
        // Add any initialization logic here
        this.scene.start('MenuScene');
    }
}
