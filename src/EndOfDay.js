import Phaser from "phaser"
import Button from "./ui_elements/Button"

export default class EndOfDay extends Phaser.Scene{
    constructor(){
        super({
            key: "EndOfDay"
        });
    }

    preload(){
        console.log("End of Day");

        // Save player
        this.game.player.day++;
        if(this.game.player.day > 3){
            this.game.player.day = 3;
        }
        this.game.player.skillPoints++;
        this.game.player.saveToLocalStorage();
    }

    create(){
        let background = this.add.graphics();
        background.fillStyle(0x000000);
        background.fillRect(0, 0, 480, 270);
        this.add.text(240, 50, "Day " + (this.game.player.day) + " Complete", {fontFamily: "NoPixel", fontSize: "48px", color: "white"}).setOrigin(0.5, 0.5);
        this.add.text(240, 125, "You landed a date", {fontFamily: "NoPixel", fontSize: "16px", color: "white"}).setOrigin(0.5, 0.5);
        let btn = Button(this, 240, 200, "Continue");
        btn.setButtonColor("white");
        btn.setButtonHoverColor("#DDDDDD");
        btn.setButtonOnClick(() => {
            this.scene.start("LevelSelect");
        })
    }


}