import Phaser, {} from "phaser"
import AbstractTab from "./AbstractTab"

export default class Math extends AbstractTab{
    constructor(){
        super("Math");
    }

    preload(){
        console.log("Math");
    }

    create(){
        let home = this.add.image(0, 0, "math");
        home.setOrigin(0, 0);
    }
}