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
        this.image = data.image
        this.confirmCallback = data.confirmCallback;

        this.sprite = this.add.sprite({
            x: 180,
            y: 135,
            key: this.image});
        this.lastKey = this.image + "_play";
        this.anims.create({
            key: this.image + "_play",
            frames: this.anims.generateFrameNumbers(this.image, {
                start: 0,
                end: 15
            }),
            frameRate: 10,
            repeat: -1
        });

        // TODO - animations double up on restart through main menu.
        this.sprite.anims.play(this.image + "_play", true);
        this.sprite.setPosition(180, 135);
    }

    create(){
        this.background = this.add.image(0, 0, "confirm-modal");
        this.background.setOrigin(0, 0);
        this.sprite.depth = 100;
        this.confirmButton = Button(this, 276, 73, "", "16px", "close-icon", 16, 16);
        this.confirmButton.setButtonColor("#431c5c");
        this.confirmButton.setButtonHoverColor("#431c5c");
        this.confirmButton.setButtonOnClick(() => this.confirmCallback());
        this.confirmButton.buttonBackgroundImage.depth = 101;
    }

    update(){
    }


}