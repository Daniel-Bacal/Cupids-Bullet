import Phaser, {} from "phaser";
import Button from "./ui_elements/Button"

export default class About extends Phaser.Scene {
    constructor(){
        super({
            key: "About"
        });
    }

    preload(){
        console.log("About");
    }

    create(){
        let background = this.add.image(0, 0, "background");
        background.setOrigin(0, 0);

        let aboutButtons = [
            Button(this, 240, 240, "Return", "16px", "btn-background", 150, 30)
        ];
        aboutButtons[0].setButtonOnClick(() => {
        this.scene.start("MainMenu");
        });
        aboutButtons[0].setButtonColor("#431c5c");
        aboutButtons[0].setButtonHoverColor("#431c5c");

        let title = "About";
        let aboutTitle = this.add.text(240, 30, title, {fill: "#ffffff", fontFamily: "NoPixel", fontSize: "48px"});
        aboutTitle.setOrigin(0.5, 0.5);

        let text = "This game was created by NO Games.\nJoe Weaver\nDaniel Bacal\nLacey Stein"
        let aboutText = this.add.text(240, 135, text, {fill: "#ffffff", fontFamily: "NoPixel", bafontSize: "16px", align: "center", wordWrap: { width: 400, useAdvancedWrap: true }});
        aboutText.setOrigin(0.5, 0.5);
    }
}