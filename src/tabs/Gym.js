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

        this.arm = this.add.sprite(190, 140, "arm");
        this.gainsText = this.add.text(190, 225, "Mash Space for Gains", {fontFamily: "NoPixel", color: "#431c5c", fontSize: "16px"}).setOrigin(0.5, 0.5);

        this.feedbackText = this.add.text(180, 150, "",  {fontFamily: "NoPixel", fontSize: "72px", color: "white"})
        this.feedbackTextFade = this.tweens.add({
            targets: this.feedbackText,
            alpha: 0,
            duration: 1000,
            ease: 'Power2'
        }, this);

        currentRepFrame = 0;

        space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.createArmAnimations();
    }

    update(){

        if(Phaser.Input.Keyboard.JustDown(space)){
            currentRepFrame++;
            console.log(currentRepFrame);
        }

        if (currentRepFrame >= maxRepFrames){
            currentRepFrame = 0;
            maxRepFrames = 30 + Math.round(this.parent.player.stats.jock/2);
            this.completedGains();
            this.feedbackTextFade.restart();
        }

        let progress = currentRepFrame/maxRepFrames;

        if(progress < 0.1 || progress > 0.9){
            this.arm.anims.play("arm_1");
        } else if(progress < 0.2 || progress > 0.8){
            this.arm.anims.play("arm_2");
        } else if(progress < 0.3 || progress > 0.7){
            this.arm.anims.play("arm_3");
        } else if(progress < 0.4 || progress > 0.6){
            this.arm.anims.play("arm_4");
        } else {
            this.arm.anims.play("arm_5");
        }

    }


    completedGains(){
        this.feedbackText.text = "Nice!";
        this.feedbackText.setOrigin(0.5, 0.5);
        this.feedbackText.setStyle({color: "green"});
        this.feedbackText.alpha = 1;
        this.sound.play("CorrectSFX");
        
        this.parent.player.incrementStat("jock", 2);
        this.parent.displayProgress("jock", 2);

        for(let i = 0; i < this.parent.personArray.length; i++){
            if(this.parent.personArray[i].likesMessage("jock")){
                this.parent.personArray[i].incrementRelationshipMeter(1);
            }
        }
    }

    createArmAnimations(){
        this.anims.create({
            key: "arm_1",
            frames: this.anims.generateFrameNumbers("arm", {
                start: 0,
                end: 0
            }),
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: "arm_2",
            frames: this.anims.generateFrameNumbers("arm", {
                start: 1,
                end: 1
            }),
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: "arm_3",
            frames: this.anims.generateFrameNumbers("arm", {
                start: 2,
                end: 2
            }),
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: "arm_4",
            frames: this.anims.generateFrameNumbers("arm", {
                start: 3,
                end: 3
            }),
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: "arm_5",
            frames: this.anims.generateFrameNumbers("arm", {
                start: 4,
                end: 4
            }),
            frameRate: 8,
            repeat: -1
        });
    }

}