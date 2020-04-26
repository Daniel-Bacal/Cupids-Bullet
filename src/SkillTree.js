import Phaser from "phaser"
import Button from "./ui_elements/Button"
import Player from "./objects/Player"

export default class SkillTree extends Phaser.Scene{
    constructor(){
        super({
            key: "SkillTree"
        });
    }

    preload(){
        console.log("SkillTree");
    }

    create(){
        this.background = this.add.image(0, 0, "skill-tree");
        this.background.setOrigin(0, 0);

        // Calculate available skills
        this.player = new Player();
        let latestSkill = "";
        this.skillPoints = 0;
        if(this.player.loadFromSession()){
            if(this.player.skills.length !== 0){
                latestSkill = this.player.skills[this.player.skills.length];
            }
            this.skillPoints = this.player.skillPoints;
        }

        let pref = ['f', 'm', 'b'];
        let centers = [82, 240, 398];
        let baseLevel = 108;
        for(let i = 0; i < pref.length; i++){
            let skillGender = 's' + pref[i]
            let x = centers[i]
            let y = baseLevel
            if(latestSkill === ""){
                // Can choose any
                let button = Button(this, x, y, "", "16px", skillGender, 16, 16);
                button.setButtonOnClick(() => this.handleSelection(skillGender));
            } else if(latestSkill.includes(skillGender)){
                // Have selected
                this.add.image(x, y, skillGender);
            } else {
                // Did not select
                this.add.image(x, y, skillGender);
                let shade = this.add.graphics();
                shade.fillStyle(0x000000, 0.3);
                shade.fillRect(x-8, y-8, 16, 16);
            }
            for(let j = 1; j < 3; j++){
                let key = skillGender + j;
                let x = centers[i] - 38 + 76*(j-1);
                let y = baseLevel + 44;

                if(latestSkill === "" ){
                    // Can't yet select this
                    this.add.image(x, y, key);
                    let shade = this.add.graphics();
                    shade.fillStyle(0x000000, 0.3);
                    shade.fillRect(x-8, y-8, 16, 16);
                } else if(key.includes(latestSkill)){
                    // Then we can select this or have selected it
                    if(key === latestSkill){
                        // Have selected
                        this.add.image(x, y, key);
                    } else {
                        let button = Button(this, x, y, "", "16px", key, 16, 16);
                        button.setButtonOnClick(() => this.handleSelection(key));
                    }
                } else {
                    // Can't select this, different tree
                    this.add.image(x, y, key);
                    let shade = this.add.graphics();
                    shade.fillStyle(0x000000, 0.3);
                    shade.fillRect(x-8, y-8, 16, 16);
                }
                for(let k = 1; k < 3; k++){
                    let key = skillGender + j + "" + k;
                    let x = centers[i] - 40 + 80*(j-1) - 20 + 40*(k-1);
                    let y = baseLevel + 44 + 54;

                    if(latestSkill === "" || latestSkill.length <= 2){
                        // Can't yet select this
                        this.add.image(x, y, key);
                        let shade = this.add.graphics();
                        shade.fillStyle(0x000000, 0.3);
                        shade.fillRect(x-8, y-8, 16, 16);
                    } else if(key.includes(latestSkill)){
                        // Then we can select this or have selected it
                        if(key === latestSkill){
                            // Have selected
                            this.add.image(x, y, key);
                        } else {
                            let button = Button(this, x, y, "", "16px", key, 16, 16);
                            button.setButtonOnClick(() => this.handleSelection(key));
                        }
                    } else {
                        // Can't select this, different tree
                        this.add.image(x, y, key);
                        let shade = this.add.graphics();
                        shade.fillStyle(0x000000, 0.3);
                        shade.fillRect(x-8, y-8, 16, 16);
                    }
                }
            }
        }
    }

    update(){
        if(this.skillPoints === 0){
            this.scene.start("DatingSim");
        }
    }

    handleSelection(key){
        this.player.skills.push(key);
        this.player.skillPoints--;
        this.player.saveToSession();
        this.skillPoints--;
        this.sound.play("SkillPointSpentSFX");
    }
}