import Phaser from "phaser"
import Button from "./ui_elements/Button"

export default class ChooseDate extends Phaser.Scene{
    constructor(){
        super({
            key: "ChooseDate"
        });
    }

    preload(){
        console.log("ChooseDate");
    }

    create(){
        this.background = this.add.image(0, 0, "end-of-day").setOrigin(0, 0);

        this.matches = this.game.matches;

        let picX = 22;
        let picY = 43;
        let nameX = 54;
        let nameY = 120;
        let scoreX = 70;
        let scoreY = 130;
        let buttonX = 19;
        let buttonY = 153;
        let x = 74;
        let y = 27;
        let xInc = 93;
        for(let i = 0; i < this.matches.length; i++){
            // Add profile picture
            let appearance = this.matches[i].getAppearance();
            for(let i in appearance){
                let image = this.add.image(picX, picY, appearance[i]);
                image.setOrigin(0, 0);
            }
            
            // Add name
            let name = this.matches[i].getName();
            name = name.split(" ")[0];
            this.add.text(nameX, nameY, name, {fontFamily: "NoPixel", color: "#431c5c", fontSize: "16px"}).setOrigin(0.5, 0.5);

            // Add score
            let scoreColor;
            if(this.matches[i].relationshipMeter < 25){
                scoreColor = "#ac3232";
            } else if(this.matches[i].relationshipMeter < 50){
                scoreColor = "#f08036"
            } else if(this.matches[i].relationshipMeter < 75){
                scoreColor = "#f7b637";
            } else {
                scoreColor = "#63c855";
            }
            
            this.add.text(scoreX, scoreY, this.matches[i].relationshipMeter, {fontFamily: "NoPixel", color: scoreColor, fontSize: "16px"}).setOrigin(0, 0);

            // Add heart status box
            this.add.image(x, y, "heart-box").setOrigin(0, 0);
            if(this.matches[i].relationshipMeter > 70){
                this.add.image(x+4, y+4, "status-heart").setOrigin(0, 0);
            }

            // Add date button
            let btn = Button(this, buttonX + 35, buttonY + 11, "Date", "16px", "btn-background", 69, 21);
            btn.setButtonColor("#431c5c");
            btn.setButtonHoverColor("#330c4c");
            btn.setButtonOnClick(() => {
                this.scene.start("BulletHell");
            });

            x += xInc;
            picX += xInc;
            nameX += xInc;
            scoreX += xInc;
            buttonX += xInc;
        }

        if(this.game.music) this.game.music.stop();
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

        // TODO: animate this text
        this.selectText = this.add.text(87, 199, "Select a date", {fontFamily: "NoPixel", fontSize: "48px", color: "#431c5c"}).setOrigin(0, 0);
    }

    update(){

    }
}