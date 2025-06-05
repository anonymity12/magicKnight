import './style.css';
import 'phaser';
import { GameConfig } from './config/game';
import { BootScene } from './scenes/BootScene';
import { GameScene } from './scenes/GameScene';
import { MenuScene } from './scenes/MenuScene';

// Create game container
const gameContainer = document.createElement('div');
gameContainer.id = 'game';
document.body.appendChild(gameContainer);

// Initialize the game
window.addEventListener('load', () => {
    const game = new Phaser.Game({
        ...GameConfig,
        scene: [BootScene, MenuScene, GameScene]
    });
});
