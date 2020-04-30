import Phaser, {} from "phaser"
import Button from "./ui_elements/Button"
import Player from "./objects/Player"
import Person from "./objects/Person";
import Matches from "./tabs/Matches";

export default class DayStart extends Phaser.Scene{
    constructor(){
        super({
            key: "DayStart"
        });
    }

    preload(){
        console.log("DayStart");
    }

    create(){
        this.anims.create({
            key: "swipe-date",
            frames: this.anims.generateFrameNumbers("heart", {
                start: 0,
                end: 15
            }),
            frameRate: 10,
            repeat: -1
        });

        this.background = this.add.sprite(0, 0, 'swipe-date').setOrigin(0,0);
        this.background.anims.play("swipe-date", true);

        let home = this.add.image(0, 0, "swipe");
        home.setOrigin(0, 0);

        this.personArray = [new Person(), new Person(), new Person(), new Person(), new Person(),
            new Person(), new Person(), new Person(), new Person(), new Person()];
        this.matches = [];
        this.index = 0;
        this.numRejections = 0;

        this.rejectionsRemaining = 5;
        this.matchesRemaining = 5;

        this.matchesRemainingText = this.add.text(300, 10, "", {fill: "#ffffff", fontFamily: "NoPixel", fontSize: "16px"});
        this.rejectionsRemainingText = this.add.text(10, 10, "", {fill: "#ffffff", fontFamily: "NoPixel", fontSize: "16px"});
        this.personText = this.add.text(240, 130, "", {fill: "#431c5c", fontFamily: "NoPixel", fontSize: "16px"});
        this.personText.setOrigin(0.5, 0.5);

        this.bioText = this.add.text(240, 150, "", {fill: "#431c5c", fontFamily: "NoPixel", fontSize: "8px",  wordWrap: { width: 170, useAdvancedWrap: true }});
        this.personText.setOrigin(0.5, 0);

        let like = Button(this, 370, 135, "", "8px", "heart-button", 54, 54);
        like.setButtonOnClick(() => {
            this.handleMatch();
            this.sound.play("SwipeRightSFX");
            this.matchesRemaining--;
        });

        let dislike = Button(this, 110, 135, "", "8px", "x-button", 54, 54);
        dislike.setButtonOnClick(() => {
            this.handleReject();
            this.sound.play("SwipeLeftSFX");
            this.rejectionsRemaining--;
        });

        this.displayCurrentPerson();
    }

    update(){
        this.matchesRemainingText.setText("Matches Remaining: " + this.matchesRemaining);
        this.rejectionsRemainingText.setText("Rejections Remaining: " + this.rejectionsRemaining);
    }

    displayCurrentPerson(){
        if(this.numRejections === 5){
            for(let i = this.index; i < this.personArray.length; i++){
                this.matches.push(this.personArray[i]);
            }
            this.game.matches = this.matches;
            this.scene.start("SkillTree");
        }

        let name = this.personArray[this.index].getName();
        this.personText.setText(name);

        let appearance = this.personArray[this.index].getAppearance();
        let bioText = this.personArray[this.index].getBio();
        this.bioText.setText(bioText);
        this.bioText.setOrigin(0.5, 0);

        for(let i in appearance){
            let image = this.add.image(240, 60, appearance[i]);
            image.setScale(1.75);
        }
    }

    handleMatch(){
        this.matches.push(this.personArray[this.index]);

        if(this.matches.length === 5){
            this.game.matches = this.matches;
            this.scene.start("SkillTree");
        }
        this.index++;
        this.displayCurrentPerson();
    }

    handleReject(){
        this.index++;
        this.numRejections++;
        this.displayCurrentPerson();
    }
}