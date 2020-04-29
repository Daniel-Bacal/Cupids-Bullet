import Phaser, {} from "phaser";
import Button from "./ui_elements/Button"

export default class Help extends Phaser.Scene{
    constructor(){
        super({key:  "Help"});
    }

    preload(){
        console.log("Help");
    }

    init(data){
        this.returnCallback = data.returnCallback;
    }

    create(){
        let background = this.add.image(0, 0, "background");
        background.setOrigin(0, 0);

        let controlsButtons = [
            Button(this, 240, 240, "Okay, thanks", "16px", "btn-background", 150, 30)
          ];
          controlsButtons[0].setButtonOnClick(() => {
            this.returnCallback();
          });
          controlsButtons[0].setButtonColor("#431c5c");
          controlsButtons[0].setButtonHoverColor("#431c5c");

          let title = "Help";
          let helpTitle = this.add.text(240, 30, title, {fill: "#ffffff", fontFamily: "NoPixel", fontSize: "48px"});
          helpTitle.setOrigin(0.5, 0.5);

          let text = "First of all, try to impress your matches. You won't get a date if no one likes you. So message them, do things they like, you get the idea.\n\nDoing activities will boost your stats. You'll need these to survive against the other suitors in the fight.\nHumor increases your speed.\nIntelligence increases your fire rate.\nSincerity increases your health.\nJock increases your damage.\nFlirt makes your enemies weak.";
          let helpText = this.add.text(240, 135, text, {fill: "#ffffff", fontFamily: "NoPixel", fontSize: "16px", align: "center", wordWrap: { width: 450, useAdvancedWrap: true }});
          helpText.setOrigin(0.5, 0.5);
    }
}