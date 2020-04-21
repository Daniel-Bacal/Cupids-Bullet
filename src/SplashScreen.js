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

        this.add.image(61, 88, "background" + Phaser.Math.Between(1, 3));
        this.add.image(61, 88, "fBody" + Phaser.Math.Between(1, 5));
        this.add.image(61, 88, "fFeature" + Phaser.Math.Between(1, 5));
        this.add.image(61, 88, "fClothes" + Phaser.Math.Between(1, 3) + Phaser.Math.Between(1, 3));
        this.add.image(61, 88, "fEyes" + Phaser.Math.Between(1, 3) + Phaser.Math.Between(1, 3));
        this.add.image(61, 88, "fHair" + Phaser.Math.Between(1, 3) + Phaser.Math.Between(1, 3));

        this.add.image(61, 160, "background" + Phaser.Math.Between(1, 3));
        this.add.image(61, 160, "mBody" + Phaser.Math.Between(1, 5));
        this.add.image(61, 160, "mFeature" + Phaser.Math.Between(1, 5));
        this.add.image(61, 160, "mClothes" + Phaser.Math.Between(1, 3) + Phaser.Math.Between(1, 3));
        this.add.image(61, 160, "mEyes" + Phaser.Math.Between(1, 3) + Phaser.Math.Between(1, 3));
        this.add.image(61, 160, "mHair" + Phaser.Math.Between(1, 3) + Phaser.Math.Between(1, 3));

        splash.setOrigin(0, 0);
        splash.setInteractive();
        splash.on('pointerdown', () => {
            this.scene.start("MainMenu");
        }, this);
    }
}