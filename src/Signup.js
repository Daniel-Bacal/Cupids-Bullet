import Phaser, {} from "phaser";
import TextField from "./ui_elements/TextField.js";
import Button from "./ui_elements/Button";
import Player from "./Player";

let pageNum;
let data;
let question;
let questionText;
let answer;
let answerButtons;
let player;
let destroyText = false;


export default class Signup extends Phaser.Scene{
    constructor(){
        super({
            key: "Signup"
        });
        this.player = new Player();
    }

    preload(){
        console.log("Signup");
    }

    create(){

        this.data = this.cache.json.get("questionnaire");

        let background = this.add.image(0, 0);
        background.setOrigin(0, 0);

        this.pageNum = 0;

        this.question = this.data["questions"][this.pageNum];
        this.questionText = this.add.text(240, 60, this.question["text"], {fontFamily: "NoPixel", fontSize: "24px", align: "center", wordWrap: { width: 400, useAdvancedWrap: true }});
        this.questionText.setOrigin(0.5, 0.5);
        

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

                this.scene.start("MainMenu");
                
            }

            else{

                let btnHeight = 140;

                this.questionText.destroy();
                
                this.question = this.data["questions"][this.pageNum];
                this.questionText = this.add.text(240, 60, this.question["text"], {fontFamily: "NoPixel", fontSize: "24px", align: "center", wordWrap: { width: 400, useAdvancedWrap: true }});
                this.questionText.setOrigin(0.5, 0.5);
                

                for (let i = 0; i < this.answerButtons.length; i++){
                    this.answerButtons[i].destroy();
                    this.answerButtons[i] = new Button(this, 240, btnHeight, this.question["answers"][i]["text"], "16px");
                    btnHeight+=40;
                }

                console.log(this.answerButtons.length);

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

                console.log(this.player.getPlayerStats());

            }
        }
    }
}