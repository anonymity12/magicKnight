import 'phaser';

export class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload(): void {
        // Here we'll load assets later
        // this.load.image('logo', 'assets/logo.png');
    }

    create(): void {
        // Add any initialization logic here
        this.scene.start('MenuScene');
    }
}
