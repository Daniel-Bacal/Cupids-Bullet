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
        this.personArray = [new Person(), new Person(), new Person(), new Person(), new Person(),
            new Person(), new Person(), new Person(), new Person(), new Person()];
        this.matches = [];
        this.index = 0;
    }

    preload(){
        console.log("DayStart");
    }

    create(){
        let home = this.add.image(0, 0, "swipe");
        home.setOrigin(0, 0);

        this.personText = this.add.text(240, 130, "", {fill: "#431c5c", fontFamily: "NoPixel", fontSize: "16px"});
        this.personText.setOrigin(0.5, 0.5);

        let like = Button(this, 370, 135, "", "8px", "heart-button", 54, 54);
        like.setButtonOnClick(() => {
            this.handleMatch();
            this.sound.play("SwipeRightSFX");
        });

        let dislike = Button(this, 110, 135, "", "8px", "x-button", 54, 54);
        dislike.setButtonOnClick(() => {
            this.handleReject();
            this.sound.play("SwipeLeftSFX");
        });

        this.displayCurrentPerson();
    }

    update(){

    }

    displayCurrentPerson(){
        if(this.index === 10){
            this.scene.start("SkillTree");
        }

        let name = this.personArray[this.index].getName();
        this.personText.setText(name);

        let appearance = this.personArray[this.index].getAppearance();
        let preferenceText = this.personArray[this.index].getPreferences();

        for(let i in appearance){
            let image = this.add.image(240, 60, appearance[i]);
            image.setScale(1.75);
        }
    }

    handleMatch(){
        this.matches.push(this.personArray[this.index]);

        if(this.matches.length === 5){
            this.scene.start("SkillTree");
        }
        this.index++;
        this.displayCurrentPerson();
    }

    handleReject(){
        this.index++;
        this.displayCurrentPerson();
    }
}