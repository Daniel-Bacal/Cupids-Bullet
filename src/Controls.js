import Phaser, {} from "phaser"
import Button from "./ui_elements/Button"

export default class Controls extends Phaser.Scene {
    constructor(){
        super({
            key: "Controls"
        })
    }

    preload(){
        console.log("Controls");
    }

    create(){
        let background = this.add.image(0, 0, "background");
        background.setOrigin(0, 0);

        let controlsButtons = [
            Button(this, 240, 240, "Return", "16px", "btn-background", 150, 30)
          ];
          controlsButtons[0].setButtonOnClick(() => {
            this.scene.start("MainMenu");
          });
          controlsButtons[0].setButtonColor("#431c5c");
          controlsButtons[0].setButtonHoverColor("#431c5c");

          let title = "Controls";
          let controlsTitle = this.add.text(240, 30, title, {fill: "#ffffff", fontFamily: "NoPixel", fontSize: "48px"});
          controlsTitle.setOrigin(0.5, 0.5);
          
          let controlsLineBreak = this.add.rectangle(140, 126, 200, 4, 0xffffff);
          controlsLineBreak.setOrigin(0, 0);

          let text = "Click - to interact with app\nKeyboard - to play minigames\n\n\nClick - to shoot bullets in battles\nWASD - to move around in battles\nSpace - to use special ability";
          let controlsText = this.add.text(240, 135, text, {fill: "#ffffff", fontFamily: "NoPixel", bafontSize: "16px", align: "center", wordWrap: { width: 400, useAdvancedWrap: true }});
          controlsText.setOrigin(0.5, 0.5);
    }
}