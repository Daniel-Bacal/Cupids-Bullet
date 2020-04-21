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
        this.haikuText = this.add.text(180, 120, "", {fontFamily: "NoPixel", fontSize: "16px", color: "white", align: "center"});
    
        this.feedbackText = this.add.text(180, 150, "",  {fontFamily: "NoPixel", fontSize: "72px", color: "white"})
        this.feedbackTextFade = this.tweens.add({
            targets: this.feedbackText,
            alpha: 0,
            duration: 1000,
            ease: 'Power2'
        }, this);
    }

    initHaikuButtons(){
        this.isHaikuButton = Button(this, 120, 220, "It's a haiku.", "8px");
        this.isHaikuButton.setButtonColor("white");
        this.isHaikuButton.setButtonHoverColor("#DDDDDD");
        this.isHaikuButton.setButtonOnClick(() => this.evaluateResponse(true));
        this.isNotHaikuButton = Button(this, 240, 220, "It's not.", "8px");
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

            this.feedbackText.text = "Correct!";
            this.feedbackText.setOrigin(0.5, 0.5);
            this.feedbackText.setStyle({color: "green"});
            this.feedbackText.alpha = 1;
        } else {
            // Decrease player sincerity

            this.feedbackText.text = "Incorrect";
            this.feedbackText.setOrigin(0.5, 0.5);
            this.feedbackText.setStyle({color: "red"});
            this.feedbackText.alpha = 1;
        }

        this.feedbackTextFade.restart();

        this.currentHaiku = null;
    }
}