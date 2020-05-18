import Phaser, {} from "phaser"
import Button from "../ui_elements/Button"
import Player from "../objects/Player"

export default class LevelSelect extends Phaser.Scene {
    constructor(){
        super({
            key: "LevelSelect"
        });
    }

    preload(){
        console.log("Level Select");
    }

    create(){
        this.add.image(0, 0, "mountains-background").setOrigin(0,0);
        let levelSelect = this.add.image(0, 0, "level-select");
        levelSelect.setOrigin(0, 0);


        if(this.game.music && this.game.music.isPlaying){
            if(this.game.music.songName !== "level-select"){
              this.game.music.stop();
              this.game.music = this.sound.add("level-select", {loop: true});
              this.game.music.play();
              this.game.music.isPlaying = true;
              this.game.music.songName = "level-select"
            }
        } else {
            this.game.music = this.sound.add("level-select", {loop: true});
            this.game.music.play();
            this.game.music.isPlaying = true;
            this.game.music.songName = "level-select"
        }

        let locations = [
            {x: 110, y: 165},
            {x: 195, y: 165},
            {x: 285, y: 165},
            {x: 370, y: 165}
        ]

        let player = this.game.player;

        let currentDay = player.getDay();

        this.add.text(98, 65, currentDay + 1, {fontFamily: "NoPixel", fontSize: "24px", color: "white"}).setOrigin(0.5, 0.5);

        // this.add.image(, "level-select-circle");

        for(let i = 0; i < currentDay; i++){
            this.add.image(locations[i].x, locations[i].y, "level-select-x");
        }

        let levelSelectButtons;
        if(currentDay < 4){
            levelSelectButtons = [
                Button(this, 240, 240, "Return", "16px", "btn-background", 150, 30),
                Button(this, locations[currentDay].x, locations[currentDay].y, "", "16px", "level-select-circle", 88, 73)
            ];
            if(currentDay === 3 && player.skillPoints === 0){
                levelSelectButtons[1].setButtonOnClick(() => {
                    this.scene.start("ChooseDate");
                });
            } else {
                levelSelectButtons[1].setButtonOnClick(() => {
                    this.scene.start("SkillTree");
                });
            }
        } else {
            levelSelectButtons = [
                Button(this, 240, 240, "Return", "16px", "btn-background", 150, 30),
            ];
        }
        levelSelectButtons[0].setButtonOnClick(() => {
            this.scene.start("MainMenu");
        });
        levelSelectButtons[0].setButtonColor("#431c5c");
        levelSelectButtons[0].setButtonHoverColor("#431c5c");
    }

}