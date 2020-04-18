import Phaser, {} from "phaser"
import Button from "./ui_elements/Button"

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
        let levelSelect = this.add.image(0, 0, "level-select");
        levelSelect.setOrigin(0, 0);

        let locations = [
            {x: 110, y: 165},
            {x: 195, y: 165},
            {x: 285, y: 165},
            {x: 370, y: 165}
        ]

        //TODO: Somehow get player data to know which level they can select
        let currentDay = 0;

        this.add.image(locations[currentDay].x, locations[currentDay].y, "level-select-circle");

        for(let i = currentDay + 1; i <= 3; i++){
            this.add.image(locations[i].x, locations[i].y, "level-select-x");
        }

        let levelSelectButtons = [
            Button(this, 240, 240, "Return", "16px", "btn-background", 150, 30)
        ];
        levelSelectButtons[0].setButtonOnClick(() => {
        this.scene.start("MainMenu");
        });
        levelSelectButtons[0].setButtonColor("#431c5c");
        levelSelectButtons[0].setButtonHoverColor("#431c5c");
    }

}