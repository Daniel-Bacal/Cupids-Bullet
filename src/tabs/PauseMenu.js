import Phaser, {} from "phaser"
import AbstractTab from "./AbstractTab"
import Button from "../ui_elements/Button"

export default class PauseMenu extends AbstractTab{
    constructor(){
        super("PauseMenu");
    }

    preload(){
        console.log("Pause");
    }

    create(){
        this.backgroundImage = this.add.image(0, 0, "pause-menu");
        this.backgroundImage.setOrigin(0, 0);
        this.headerText = this.add.text(240, 60, "I think we need a break...\nGAME PAUSED", {align: "center", color: "#431c5c", fontSize: "16px", fontFamily: "NoPixel"});
        this.headerText.setOrigin(0.5, 0.5);
        this.initButtons();
    }

    initButtons(){
        this.resumeButton = Button(this, 240, 120, "Resume", "16px", "btn-background", 120, 30);
        this.resumeButton.setButtonColor("#431c5c");
        this.resumeButton.setButtonOnClick(() => this.parent.pauseGame(false));

        this.resumeButton = Button(this, 240, 170, "Main Menu", "16px", "btn-background", 120, 30);
        this.resumeButton.setButtonColor("#431c5c");
        this.resumeButton.setButtonOnClick(() => this.parent.goToMainMenu());
    }
}