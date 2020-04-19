import Phaser, {} from "phaser"
import AbstractTab from "./AbstractTab"

export default class Gym extends AbstractTab{
    constructor(){
        super("Gym");
    }

    preload(){
        console.log("Gym");
    }

    create(){
        let home = this.add.image(0, 0, "gym");
        home.setOrigin(0, 0);
    }
}