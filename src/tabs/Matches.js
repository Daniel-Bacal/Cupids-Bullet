import Phaser, {} from "phaser"
import AbstractTab from "./AbstractTab"

export default class Matches extends AbstractTab{
    constructor(){
        super("Matches");
    }

    preload(){
        console.log("Matches");
    }

    create(){
        let home = this.add.image(0, 0, "matches");
        home.setOrigin(0, 0);
    }
}