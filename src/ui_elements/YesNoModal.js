import Phaser from "phaser"
import Button from "../ui_elements/Button"

export default class YesNoModal extends Phaser.Scene{
    constructor(){
        super({
            key: "YesNoModal"
        });
    }

    preload(){
        console.log("Modal");
    }

    init(data){
        this.yesCallback = data.yesCallback;
        this.noCallback = data.noCallback;
    }

    create(){
        this.background = this.add.image(0, 0, "modal");
        this.background.setOrigin(0, 0);

        this.title = this.add.text(240, 90, "Are you sure?", {fontFamily: "NoPixel", fontSize: "16px", color:"#431c5c"});
        this.title.setOrigin(0.5, 0.5);
        this.warning = this.add.text(240, 120, "You will lose your progress for the day.", {fontFamily: "NoPixel", fontSize: "8px", color: "#431c5c", align: "center", wordWrap: { width: 120, useAdvancedWrap: true }});
        this.warning.setOrigin(0.5, 0.5);
        this.yesButton = Button(this, 200, 150, "Yes", "16px");
        this.yesButton.setButtonColor("#431c5c");
        this.yesButton.setButtonHoverColor("#431c5c");
        this.yesButton.setButtonOnClick(() => this.yesCallback());
        this.noButton = Button(this, 280, 150, "No", "16px");
        this.noButton.setButtonColor("#431c5c");
        this.noButton.setButtonHoverColor("#431c5c");
        this.noButton.setButtonOnClick(() => this.noCallback());
    }


}