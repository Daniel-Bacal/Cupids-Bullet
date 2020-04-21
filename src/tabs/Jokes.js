import Phaser, {} from "phaser"
import AbstractTab from "./AbstractTab"
import JokeGenerator from "../utils/JokeGenerator";
import Button from "../ui_elements/Button"
import TextField from "../ui_elements/TextField"

var enter;

export default class Jokes extends AbstractTab{
    constructor(){
        super("Jokes");
    }

    preload(){
        console.log("Jokes");
    }

    create(){
        this.background = this.add.image(0, 0, "jokes");
        this.background.setOrigin(0, 0);

        this.jokeGenerator = new JokeGenerator();
        this.currentJoke = null;
        this.jokePhase = null;

        this.initSubmitButton();
        this.initJokeText();
        this.initTextField();
    }

    update(){
        if(this.currentJoke === null){
            this.createJokeTest();
        } else {
            this.updateJokeText();
        }

        if(Phaser.Input.Keyboard.JustDown(enter)){
            this.submitAnswer();
        }
    }

    initTextField(){
        this.textField = TextField(this, 180, 180, 200, 20, 20, {fontFamily: "NoPixel", fontSize: "32px", color: "white", backgroundColor: "rgba(255, 255, 255, 0.1)"});
        this.textFields.push(this.textField);
    }

    initSubmitButton(){
        this.submitButton = Button(this, 180, 222, "Submit", "16px");
        this.submitButton.setButtonColor("white");
        this.submitButton.setButtonOnClick(() => this.submitAnswer());

        enter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    }
    
    submitAnswer(){
        let text = this.textField.value.toLowerCase();
        let correct = false;
        if(this.jokePhase === 0){
            // Who's there
            if("whos there" === text || "who's there" === text || "whos there?" === text || "who's there?" === text){
                correct = true;
            }
        } else if(this.jokePhase === 1){
            if((this.currentJoke.word.toLowerCase() + " who") === text || (this.currentJoke.word.toLowerCase() + " who?") === text){
                correct = true;
            }
        } else {
            // Not sure how to do this one, but oh well
            if("haha lol lmao lmfao rofl".includes(this.textField.value.toLowerCase())){
                correct = true;
            }
        }

        this.jokePhase++;
        this.textField.value = "";

        if(this.jokePhase >= 3){
            this.currentJoke = null;
        }

        if(correct){
            // Increment humor

            this.feedbackText.text = "Correct!";
            this.feedbackText.setOrigin(0.5, 0.5);
            this.feedbackText.setStyle({color: "green"});
            this.feedbackText.alpha = 1;
        } else {
            // Decrement humor

            this.feedbackText.text = "Incorrect";
            this.feedbackText.setOrigin(0.5, 0.5);
            this.feedbackText.setStyle({color: "red"});
            this.feedbackText.alpha = 1;
        }

        this.feedbackTextFade.restart();

    }

    initJokeText(){
        this.jokeText = this.add.text(180, 120, "", {fontFamily: "NoPixel", fontSize: "24px", color: "white", align: "center", wordWrap: { width: 300, useAdvancedWrap: true }});
        
        this.feedbackText = this.add.text(180, 150, "",  {fontFamily: "NoPixel", fontSize: "72px", color: "white"})
        this.feedbackTextFade = this.tweens.add({
            targets: this.feedbackText,
            alpha: 0,
            duration: 1000,
            ease: 'Power2'
        }, this);
    }

    updateJokeText(){
        if(this.jokePhase === 0){
            // Knock Knock
            this.jokeText.text = "Knock Knock";
            this.jokeText.setOrigin(0.5, 0.5);
        } else if(this.jokePhase === 1){
            // word
            this.jokeText.text = this.currentJoke.word;
            this.jokeText.setOrigin(0.5, 0.5);
        } else {
            // punchline
            this.jokeText.text = this.currentJoke.punchline;
            this.jokeText.setOrigin(0.5, 0.5);
        }
    }

    createJokeTest(){
        this.currentJoke = this.jokeGenerator.generateJokeTest();
        this.jokePhase = 0;

        this.updateJokeText();
    }
}