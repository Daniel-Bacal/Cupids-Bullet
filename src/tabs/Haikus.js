import Phaser, {} from "phaser"
import AbstractTab from "./AbstractTab"

export default class Haikus extends AbstractTab{
    constructor(){
        super("Haikus")
    }

    preload(){
        console.log("Haikus");
    }

    create(){
        let home = this.add.image(0, 0, "haikus");
        home.setOrigin(0, 0);
    }
}