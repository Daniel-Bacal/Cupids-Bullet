import Phaser, {} from "phaser"
import AbstractTab from "./AbstractTab"
import Button from "../ui_elements/Button"

export default class Home extends AbstractTab{
    constructor(){
        super("Home");
    }

    preload(){
        console.log("Home");
    }

    create(){
        let home = this.add.image(0, 0, "home");
        home.setOrigin(0, 0);

        // Populate this based on the player data
    }
}