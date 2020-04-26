import Phaser, {} from "phaser"
import AbstractTab from "./AbstractTab"

var currentRepFrame;
var maxRepFrames = 40;
var space;

export default class Gym extends AbstractTab{
    constructor(){
        super("Gym");
    }

    preload(){
        console.log("Gym");
    }

    create(){
        let home = this.add.image(0, 0, "gym");
        home.setOrigin(0, 0);

        this.feedbackText = this.add.text(180, 150, "",  {fontFamily: "NoPixel", fontSize: "72px", color: "white"})
        this.feedbackTextFade = this.tweens.add({
            targets: this.feedbackText,
            alpha: 0,
            duration: 1000,
            ease: 'Power2'
        }, this);

        currentRepFrame = 0;

        space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update(){

        if(Phaser.Input.Keyboard.JustDown(space)){
            currentRepFrame++;
            console.log(currentRepFrame);
        }

        if (currentRepFrame >= maxRepFrames){
            currentRepFrame = 0;
            this.completedGains();
            this.feedbackTextFade.restart();
        }

    }


    completedGains(){
        this.feedbackText.text = "Nice!";
        this.feedbackText.setOrigin(0.5, 0.5);
        this.feedbackText.setStyle({color: "green"});
        this.feedbackText.alpha = 1;
        this.sound.play("CorrectSFX");
        
        this.parent.player.incrementStat("jock", 2);
    }

}