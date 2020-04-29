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

        let d = 400;
        let bX = 10 - 600;
        let bY = 31;
        let picX = 22 - 600;
        let picY = 43;
        let nameX = 54 - 600;
        let nameY = 120;
        let scoreX = 70 - 600;
        let scoreY = 130;
        let buttonX = 19 - 600;
        let buttonY = 153;
        let gX = 14 - 600;
        let gY = 35;
        let gsX = 78 - 600;
        let gsY = 31;
        let x = 74 - 600;
        let y = 27;
        let xInc = 93;

        this.numMatches = 0;
        let groups = [];
        for(let i = 0; i < this.matches.length; i++){
            if(this.matches[i].relationshipMeter > 60){
                this.numMatches++;
            }

            let elements = [];

            // Add background
            let background = this.add.image(bX, bY, "choice-background").setOrigin(0, 0);
            elements.push(background);

            // Add profile picture
            let appearance = this.matches[i].getAppearance();
            for(let i in appearance){
                let image = this.add.image(picX, picY, appearance[i]);
                image.setOrigin(0, 0);
                elements.push(image);
            }
            
            // Add name
            let name = this.matches[i].getName();
            name = name.split(" ")[0];
            let nameText = this.add.text(nameX, nameY, name, {fontFamily: "NoPixel", color: "#431c5c", fontSize: "16px"}).setOrigin(0.5, 0.5);
            elements.push(nameText);

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
            
            let scoreText = this.add.text(scoreX, scoreY, this.matches[i].relationshipMeter, {fontFamily: "NoPixel", color: scoreColor, fontSize: "16px"}).setOrigin(0, 0);
            elements.push(scoreText);

            // Add date button
            let btn = Button(this, buttonX + 35, buttonY + 11, "Date", "16px", "btn-background", 69, 21);
            btn.setButtonColor("#431c5c");
            btn.setButtonHoverColor("#330c4c");
            if(this.matches[i].relationshipMeter >= 60){
                btn.setButtonOnClick(() => {
                    this.scene.start("BulletHell");
                });
            }
            elements.push(btn);
            elements.push(btn.buttonBackgroundImage);

            // If relationship meter is too low, prevent the date from happening
            if(this.matches[i].relationshipMeter < 60){
                let g = this.add.graphics();
                g.fillStyle(0x000000, 0.3);
                g.fillRect(gX, gY, 80, 142);
                elements.push(g);
            }

            // Add heart status box
            let box = this.add.image(x, y, "heart-box").setOrigin(0, 0);
            elements.push(box);
            if(this.matches[i].relationshipMeter > 75){
                let heart = this.add.image(x+4, y+4, "status-heart").setOrigin(0, 0);
                elements.push(heart);
            }

            // Gray out heart status box if relationship meter is low
            if(this.matches[i].relationshipMeter < 60){
                let gs = this.add.graphics();
                gs.fillStyle(0x000000, 0.3);
                gs.fillRect(gsX, gsY, 20, 20);
                elements.push(gs);
            }

            groups.push(elements);
            this.add.tween({
                targets: elements,
                x: '+=600',
                duration: 1500,
                ease: 'Power2',
                delay: d
            })

            d -= 100;
            x += xInc;
            bX += xInc;
            picX += xInc;
            nameX += xInc;
            scoreX += xInc;
            buttonX += xInc;
            gX += xInc;
            gsX += xInc;
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

        this.selectText = this.add.text(87 + 600, 199, "Select a date", {fontFamily: "NoPixel", fontSize: "48px", color: "#431c5c"}).setOrigin(0, 0);

        this.add.tween({
            targets: this.selectText,
            x: "-=600",
            duration: 1500,
            ease: "power3"
        });

        this.add.tween({
            targets: this.selectText,
            alpha: {from: 1, to: 0.3},
            ease: "Sine.easeInOut",
            duration: 1000,
            delay: 1500,
            yoyo: true,
            loop: -1
        });

        this.loseTimer = Infinity;
        if(this.numMatches === 0){
            // No matches, lose game
            let noMatchesBackground = this.add.image(0, 197 - 400, "end-of-day-banner").setOrigin(0, 0);
            let noMatches = this.add.text(87, 199 - 400, "No Matches!", {fontFamily: "NoPixel", fontSize: "48px", color: "#431c5c"}).setOrigin(0, 0);

            this.add.tween({
                targets: [noMatches, noMatchesBackground],
                y: "+=400",
                duration: 1000,
                delay: 1000,
                ease: "power2"
            });

            let d = 0;
            for(let i in groups){
                this.add.tween({
                    targets: groups[i],
                    delay: 2000 + d,
                    alpha: {from: 1, to: 0},
                    scale: {from: 1, to: 0},
                    rotation: 10,
                    duration: 1000,
                    ease: "Sine.easeInOut"
                });
                d += 200;
            }
        }
    }

    update(){
        if(this.numMatches === 0 && this.loseTimer === Infinity){
            this.loseTimer = this.time.now + 5000;
        }

        if(this.time.now >= this.loseTimer){
            this.scene.start("GameOver");
        }
    }
}