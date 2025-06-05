import 'phaser';

export class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    create(): void {
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;

        // Add title
        this.add.text(centerX, centerY - 100, 'Magic Knight', {
            fontSize: '48px',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Add start button
        const startButton = this.add.text(centerX, centerY, 'Start Game', {
            fontSize: '32px',
            color: '#ffffff'
        })
        .setOrigin(0.5)
        .setInteractive();

        startButton.on('pointerdown', () => {
            this.scene.start('GameScene');
        });
    }
}
