import Phaser, {} from "phaser";
import TextField from "../ui_elements/TextField.js";
import Button from "../ui_elements/Button";
import Player from "../objects/Player";
import MathGenerator from "../utils/MathGenerator";

let mathExp;
let mathGen;
let currentProblem;
let mathText;

export default class Signup extends Phaser.Scene{
    constructor(){
        super({
            key: "Signup"
        });
    }

    preload(){
        console.log("Signup");
    }

    create(){
        this.data = this.cache.json.get("questionnaire");

        this.player = new Player();

        let background = this.add.image(0, 0);
        background.setOrigin(0, 0);

        this.pageNum = 0;

        this.question = this.data["questions"][this.pageNum];
        this.questionText = this.add.text(240, 60, this.question["text"], {fontFamily: "NoPixel", fontSize: "24px", align: "center", wordWrap: { width: 400, useAdvancedWrap: true }});
        this.questionText.setOrigin(0.5, 0.5);

        //this.enter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        
        this.answerButtons = [
            Button(this, 240, 140, this.question["answers"][0]["text"], "16px"),
            Button(this, 240, 180, this.question["answers"][1]["text"], "16px"),
            Button(this, 240, 220, this.question["answers"][2]["text"], "16px")
        ];

        for(let i = 0; i < this.answerButtons.length; i++){
            this.answerButtons[i].setButtonOnClick(() => {
                let incStats = this.question["answers"][i]["inc"].split(" ");
                let decStats = this.question["answers"][i]["dec"].split(" ");
                for (let j = 0; j < incStats.length; j++){
                    this.player.incrementStat(incStats[j], 1);
                    console.log("increment " + incStats[j]);
                }
                for (let j = 0; j < decStats.length; j++){
                    this.player.incrementStat(decStats[j], -1);
                    console.log("decrement " + decStats[j]);
                }
            
                this.pageNum++;
                this.destroyText = true;

            });
            this.answerButtons[i].setButtonColor("#FFFFFF");
            this.answerButtons[i].setButtonHoverColor("#DDDDDD");
        }
    }

    update(){

        if (this.destroyText){

            this.destroyText = false;

            if (this.pageNum >= this.data["questions"].length){

                this.scene.start("BulletHell");
                
            }

            else{

                let btnHeight = 140;

                this.questionText.destroy();
                
                this.question = this.data["questions"][this.pageNum];
                this.questionText = this.add.text(240, 60, this.question["text"], {fontFamily: "NoPixel", fontSize: "24px", align: "center", wordWrap: { width: 400, useAdvancedWrap: true }});
                this.questionText.setOrigin(0.5, 0.5);

                if (this.question["text"].split(" ")[0].toLowerCase() === "evaluate"){
                    mathGen = new MathGenerator();
                    currentProblem = mathGen.generateMathTest();
                    mathText = currentProblem.expression + "=?";
                    mathExp = this.add.text(240,100, mathText, {fontFamily: "NoPixel", fontSize: "24px", align: "center", wordWrap: { width: 400, useAdvancedWrap: true }});
                    mathExp.setOrigin(0.5, 0.5);
                }

                for (let i = 0; i < this.answerButtons.length; i++){
                    if (this.answerButtons[i].height === 0){
                        if (mathExp){mathExp.destroy();}
                        this.answerButtons[i].remove();
                    }
                    else{
                        this.answerButtons[i].destroy();
                    }
                    if (this.question["answers"][i]["text"] === ""){
                        this.answerButtons[i] = new TextField(this, 240, btnHeight, 70, 30, 16, {borderStyle: "solid", borderWidth: "2px 2px 2px 2px", borderColor: "white"});
                        btnHeight+=40;
                    }
                    else{
                        this.answerButtons[i] = new Button(this, 240, btnHeight, this.question["answers"][i]["text"], "16px");
                        btnHeight+=40;
                    }
                }

                console.log(this.answerButtons.length);

                for(let i = 0; i < this.answerButtons.length; i++){
                    if (this.answerButtons[i].height === 0){

                        let incStats = this.question["answers"][i]["inc"].split(" ");
                        let decStats = this.question["answers"][i]["dec"].split(" ");

                        if (this.answerButtons[i].text === this.expressionAnswer){
                            for (let j = 0; j < incStats.length; j++){
                                this.player.incrementStat(incStats[j], 1);
                                console.log("increment " + incStats[j]);
                            }
                        }
                        for (let j = 0; j < decStats.length; j++){
                            this.player.incrementStat(decStats[j], -1);
                            console.log("decrement " + decStats[j]);
                        }
                        //this.pageNum++;
                        //this.destroyText = true;
                    }
                    else{
                        this.answerButtons[i].setButtonOnClick(() => {
                        let incStats = this.question["answers"][i]["inc"].split(" ");
                        let decStats = this.question["answers"][i]["dec"].split(" ");
                        for (let j = 0; j < incStats.length; j++){
                            this.player.incrementStat(incStats[j], 1);
                            console.log("increment " + incStats[j]);
                        }
                        for (let j = 0; j < decStats.length; j++){
                            this.player.incrementStat(decStats[j], -1);
                            console.log("decrement " + decStats[j]);
                        }
                        this.pageNum++;
                        this.destroyText = true;
                        });
                        this.answerButtons[i].setButtonColor("#FFFFFF");
                        this.answerButtons[i].setButtonHoverColor("#DDDDDD");
                    }
                }

                console.log(this.player.getPlayerStats());

            }
        }
    }
}