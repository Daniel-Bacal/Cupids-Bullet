import Phaser, {} from "phaser";

export default class SpashScreen extends Phaser.Scene{
    constructor(){
        super({
            key: "SplashScreen"
        });
    }

    preload(){
        console.log("splash");
    }

    create(){
        let splash = this.add.image(0, 0, "splash-screen");

        splash.setOrigin(0, 0);
        splash.setInteractive();
        splash.on('pointerdown', () => {
            this.scene.start("MainMenu");
        }, this);
    }
}