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

        let first = Math.floor(Math.random()*4 + 1);
        let second = Math.floor(Math.random()*4 + 1);
        while(second === first){
            second = Math.floor(Math.random()*4 + 1);
        }
        this.add.image(360, 18, "da-" + first).setOrigin(0, 0);
        this.add.image(360, 18 + 126, "da-" + second).setOrigin(0, 0);
    }
}