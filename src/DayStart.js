import Phaser, {} from "phaser"
import Button from "./ui_elements/Button"

export default class DayStart extends Phaser.Scene{
    constructor(){
        super({
            key: "DayStart"
        });
    }

    preload(){
        console.log("DayStart");
    }

    create(){
        let button = Button(this, 240, 135, "Go To Dating Sim", "16px");

        button.setButtonOnClick(() => {
            this.scene.start("DatingSim");
        })
    }

    update(){

    }
}