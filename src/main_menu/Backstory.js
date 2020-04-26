import Phaser, {} from "phaser";
import Button from "../ui_elements/Button"

export default class Backstory extends Phaser.Scene{
    constructor(){
        super({key:  "Backstory"});
    }

    preload(){
        console.log("Backstory");
    }

    create(){
        let background = this.add.image(0, 0, "background");
        background.setOrigin(0, 0);

        let backstoryButtons = [
            Button(this, 240, 240, "Return", "16px", "btn-background", 150, 30)
        ];
        backstoryButtons[0].setButtonOnClick(() => {
            athis.scene.start("MainMenu");
        });
        backstoryButtons[0].setButtonColor("#431c5c");
        backstoryButtons[0].setButtonHoverColor("#431c5c");

        let title = "Backstory";
        let backstoryTitle = this.add.text(240, 30, title, {fill: "#ffffff", fontFamily: "NoPixel", fontSize: "48px"});
        backstoryTitle.setOrigin(0.5, 0.5);

        let text = "You've been struggling to find romance. It's only 3 days until Valentine's Day and you're trying to find a date for the big day. You've been hearing about this new dating app called Grynder and decide to give it a go. However, what you don't realize, is that this dating app has special features. You don't just land a date, you have to fight for it.";
        let backstoryText = this.add.text(240, 135, text, {fill: "#ffffff", fontFamily: "NoPixel", bafontSize: "16px", align: "center", wordWrap: { width: 400, useAdvancedWrap: true }});
        backstoryText.setOrigin(0.5, 0.5);
    }
}