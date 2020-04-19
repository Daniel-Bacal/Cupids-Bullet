import Phaser, {} from "phaser"
import AbstractTab from "./AbstractTab"

export default class Jokes extends AbstractTab{
    constructor(){
        super("Jokes");
    }

    preload(){
        console.log("Jokes");
    }

    create(){
        let home = this.add.image(0, 0, "jokes");
        home.setOrigin(0, 0);
    }
}