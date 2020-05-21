import Phaser, {} from "phaser"
import AbstractTab from "./AbstractTab"
import MathGenerator from "../utils/MathGenerator"
import TextField from "../ui_elements/TextField"
import Button from "../ui_elements/Button"

var enter;

export default class MathTab extends AbstractTab{
    constructor(){
        super("Math");
    }

    preload(){
        console.log("Math");
    }

    create(){
        this.background = this.add.image(0, 0, "math");
        this.background.setOrigin(0, 0);

        this.mathGenerator = new MathGenerator();
        this.currentProblem = null;

        this.initMathText();
        this.initSubmitButton();
        this.initTextField();
    }

    update(){
        if(this.currentProblem === null){
            this.createMathTest();
        } else {
            if(Phaser.Input.Keyboard.JustDown(enter)){
                this.submitAnswer();
            }
        }
    }

    initMathText(){
        this.mathText = this.add.text(180, 120, "", {fontFamily: "NoChalk", fontSize: "24px", color: "white"});

        this.feedbackText = this.add.text(180, 150, "",  {fontFamily: "NoPixel", fontSize: "72px", color: "white"})
        this.feedbackTextFade = this.tweens.add({
            targets: this.feedbackText,
            alpha: 0,
            duration: 1000,
            ease: 'Power2'
          }, this);
    }

    initTextField(){
        this.textField = TextField(this, 180, 180, 100, 50, 20, {fontFamily: "NoChalk", fontSize: "48px", color: "white", backgroundColor: "rgba(255, 255, 255, 0.1)"});
        this.textFields.push(this.textField);

        this.textField.oninput = () => {
            // Prevent invalid inputs
            let str = this.textField.value;
            if(!"0123456789-".includes(str.charAt(str.length-1))){
                this.textField.value = str.substring(0, str.length-1);
            }
        }
    }

    initSubmitButton(){
        this.submitButton = Button(this, 180, 222, "Submit", "16px");
        this.submitButton.setButtonColor("white");
        this.submitButton.setButtonOnClick(() => this.submitAnswer());

        enter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    }

    createMathTest(){
        this.currentProblem = this.mathGenerator.generateMathTest();
        this.mathText.text = this.currentProblem.expression + "=?";
        this.mathText.setOrigin(0.5, 0.5);
    }

    submitAnswer(){
        if(this.textField.value === ""){
            return;
        }

        let value = parseInt(this.textField.value);

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
        if(value === this.currentProblem.value){
            // Increment intelligence
            this.parent.player.incrementStat("int", incAmount);
            this.parent.displayProgress("intelligence", incAmount);

            for(let i = 0; i < this.parent.personArray.length; i++){
                if(this.parent.personArray[i].likesMessage("int")){
                    this.parent.personArray[i].incrementRelationshipMeter(1);
                }
            }

            this.feedbackText.text = "Correct!";
            this.feedbackText.setOrigin(0.5, 0.5);
            this.feedbackText.setStyle({color: "green"});
            this.feedbackText.alpha = 1;
            this.sound.play("CorrectSFX");
        } else {
            // Decrement intelligence

            this.parent.player.incrementStat("int", -incAmount);
            this.parent.displayProgress("intelligence", -incAmount);

            this.feedbackText.text = "Incorrect";
            this.feedbackText.setOrigin(0.5, 0.5);
            this.feedbackText.setStyle({color: "red"});
            this.feedbackText.alpha = 1;
            this.sound.play("IncorrectSFX");
        }

        this.feedbackTextFade.restart();

        this.textField.value = "";

        // Reset current problem
        this.currentProblem = null;
    }
}