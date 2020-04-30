import Phaser, {} from "phaser";

export default class Ads extends Phaser.Scene{
    constructor(){
        super({
            key: "Ads"
        });
    }

    preload(){
        console.log("Ads");
    }

    create(){
        let background = this.add.image(0, 0, "purple-background");
        background.setOrigin(0, 0);

        this.add.image(360, 18, "da-1").setOrigin(0, 0);
        this.add.image(360, 18 + 126, "da-2").setOrigin(0, 0);
    }
}