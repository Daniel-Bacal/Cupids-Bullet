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

        let bgRandom = this.add.image(61, 88, "background" + Phaser.Math.Between(1, 3));
        let bodyRandom = this.add.image(61, 88, "body" + Phaser.Math.Between(1, 5));
        let featureRandom = this.add.image(61, 88, "feature" + Phaser.Math.Between(1, 5));
        let clothesRandom = this.add.image(61, 88, "clothes" + Phaser.Math.Between(1, 3) + Phaser.Math.Between(1, 3));
        let eyesRandom = this.add.image(61, 88, "eyes" + Phaser.Math.Between(1, 3) + Phaser.Math.Between(1, 3));
        let hairRandom = this.add.image(61, 88, "hair" + Phaser.Math.Between(1, 3) + Phaser.Math.Between(1, 3));

        splash.setOrigin(0, 0);
        splash.setInteractive();
        splash.on('pointerdown', () => {
            this.scene.start("MainMenu");
        }, this);
    }
}