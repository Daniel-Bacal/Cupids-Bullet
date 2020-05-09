import Phaser, {Scene} from "phaser"
import Button from "./Button"

export default class ConfirmModal extends Scene{
    constructor(){
        super({
            key: "ConfirmModal"
        });
    }

    preload(){
        console.log("Confirm Modal");
    }

    init(data){
        this.titleText = data.titleText;
        this.text = data.text;
        this.confirmCallback = data.confirmCallback;

        if(this.title){
            this.title.text = this.titleText;
            this.mainText.text = this.text;
            this.mainText.setOrigin(0.5, 0);
        }
    }

    create(){
        this.background = this.add.image(0, 0, "confirm-modal");
        this.background.setOrigin(0, 0);
        this.title = this.add.text(240, 75, this.titleText, {fontFamily: "NoPixel", fontSize: "16px", color:"#431c5c"});
        this.title.setOrigin(0.5, 0.5);
        this.mainText = this.add.text(240, 85, this.text, {fontFamily: "NoPixel", fontSize: "8px", color:"#431c5c", align: "center", wordWrap: { width: 180, useAdvancedWrap: true }});
        this.mainText.setOrigin(0.5, 0);
        this.confirmButton = Button(this, 240, 165, "Okay", "16px");
        this.confirmButton.setButtonColor("#431c5c");
        this.confirmButton.setButtonHoverColor("#431c5c");
        this.confirmButton.setButtonOnClick(() => this.confirmCallback());
    }

    update(){
    }


}