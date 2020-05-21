import Phaser, {} from "phaser"
import AbstractTab from "./AbstractTab"
import HaikuGenerator from "../utils/HaikuGenerator"
import Button from "../ui_elements/Button"

export default class Haikus extends AbstractTab{
    constructor(){
        super("Haikus")
    }

    preload(){
        console.log("Haikus");
    }

    create(){
        this.background = this.add.image(0, 0, "haikus");
        this.background.setOrigin(0, 0);

        this.haikuBackground = this.add.image(38, 0, "haiku-background").setOrigin(0, 0);
        this.haikuBackground.setScale(2.3, 2.3);
        this.haikuBackground.setCrop(0, 63/2.3, 285/2.3, 171/2.3);

        this.haikuGenerator = new HaikuGenerator();
        this.currentHaiku = null;

        this.initHaikuText();

        this.initHaikuButtons();
    }

    update(){
        if(this.currentHaiku === null){
            this.createNewHaiku();
            
        }

    }

    initHaikuText(){
        this.haikuText = this.add.text(180, 120, "", {fontFamily: "NoPixel", fontSize: "16px", color: "#431c5c", align: "center"});
    
        this.feedbackText = this.add.text(180, 150, "",  {fontFamily: "NoPixel", fontSize: "72px", color: "white"})
        this.feedbackTextFade = this.tweens.add({
            targets: this.feedbackText,
            alpha: 0,
            duration: 1000,
            ease: 'Power2'
        }, this);
    }

    initHaikuButtons(){
        this.isHaikuButton = Button(this, 120, 220, "It's a haiku", "8px", "accept-btn", 49, 15);
        this.isHaikuButton.setButtonColor("white");
        this.isHaikuButton.setButtonHoverColor("#DDDDDD");
        this.isHaikuButton.setButtonOnClick(() => this.evaluateResponse(true));
        this.isNotHaikuButton = Button(this, 240, 220, "It's not", "8px", "reject-btn", 49, 15);
        this.isNotHaikuButton.setButtonColor("white");
        this.isNotHaikuButton.setButtonHoverColor("#DDDDDD");
        this.isNotHaikuButton.setButtonOnClick(() => this.evaluateResponse(false));
    }

    createNewHaiku(){
        this.currentHaiku = this.haikuGenerator.generateHaikuTest();
        this.haikuText.text = this.currentHaiku.haiku;
        this.haikuText.setOrigin(0.5, 0.5);
    }

    evaluateResponse(response){
        if(response === this.currentHaiku.isHaiku){
            // Increase player sincerity
            let incAmount;
            if (this.parent.player.getDay()===0){
                incAmount = 2;
            }
            else if (this.parent.player.getDay()===1){
                incAmount = 3;
            }
            else {
                incAmount = 4;
            }
            this.parent.player.incrementStat("sinc", incAmount);
            this.parent.displayProgress("sincerity", incAmount);

            for(let i = 0; i < this.parent.personArray.length; i++){
                if(this.parent.personArray[i].likesMessage("sinc")){
                    this.parent.personArray[i].incrementRelationshipMeter(1);
                }
            }

            this.feedbackText.text = "Correct!";
            this.feedbackText.setOrigin(0.5, 0.5);
            this.feedbackText.setStyle({color: "green"});
            this.feedbackText.alpha = 1;
            this.sound.play("CorrectSFX");
        } else {
            // Decrease player sincerity
            let incAmount;
            if (this.parent.player.getDay()===0){
                incAmount = 2;
            }
            else if (this.parent.player.getDay()===1){
                incAmount = 3;
            }
            else {
                incAmount = 4;
            }
            this.parent.player.incrementStat("sinc", -incAmount);
            this.parent.displayProgress("sincerity", -incAmount);

            this.feedbackText.text = "Incorrect";
            this.feedbackText.setOrigin(0.5, 0.5);
            this.feedbackText.setStyle({color: "red"});
            this.feedbackText.alpha = 1;
            this.sound.play("IncorrectSFX");
        }

        this.feedbackTextFade.restart();

        this.currentHaiku = null;
    }
}