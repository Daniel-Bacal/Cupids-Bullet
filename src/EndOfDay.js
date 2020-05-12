import Phaser from "phaser"
import Button from "./ui_elements/Button"

export default class EndOfDay extends Phaser.Scene{
    constructor(){
        super({
            key: "EndOfDay"
        });
    }

    preload(){
        console.log("End of Day");

        // Save player
        this.game.player.day++;
        console.log("day: " + this.game.player.day);
        if(this.game.player.day <= 3){
            this.game.player.skillPoints++;
        }
        this.game.player.saveToLocalStorage();
    }

    create(){
        this.anims.create({
            key: "got-date",
            frames: this.anims.generateFrameNumbers("night", {
                start: 0,
                end: 24
            }),
            frameRate: 10,
            repeat: -1
        });

        this.background = this.add.sprite(0, 0, 'got-date').setOrigin(0,0);
        this.background.anims.play("got-date", true);
        // let background = this.add.graphics();
        // background.fillStyle(0x000000);
        // background.fillRect(0, 0, 480, 270);

        let text = "Day " + (this.game.player.day) + " Complete";
        let x = 75 - 600;
        let lastWidth = 0;
        let delay = (text.length - 1)*40 + 2500;
        for(let i = 0; i < text.length; i++){
            let c = text.charAt(i);
            if(c === 'l'){
                lastWidth -= 10;
            }
            let t = this.add.text(x + lastWidth, 50, c, {fontFamily: "NoPixel", fontSize: "48px", color: "white"}).setOrigin(0.5, 0.5);
            if(c === 'l'){
                lastWidth += 10;
            }
            lastWidth += t.displayWidth;
            this.add.tween({
                targets: t,
                x: "+=600",
                ease: "power2",
                duration: 500,
                delay: delay
            });
            delay -= 40;
        }

        
        
        text = "You landed a date";
        x = 170 - 600;
        lastWidth = 0;
        delay = (text.length - 1)*40 + 4500;
        for(let i = 0; i < text.length; i++){
            let c = text.charAt(i);
            if(c === 'l'){
                lastWidth -= 3;
            }
            let t = this.add.text(x + lastWidth, 125, c, {fontFamily: "NoPixel", fontSize: "16px", color: "white"}).setOrigin(0.5, 0.5);
            if(c === 'l'){
                lastWidth += 3;
            }
            lastWidth += t.displayWidth;
            this.add.tween({
                targets: t,
                x: "+=600",
                ease: "power2",
                duration: 500,
                delay: delay
            });
            delay -= 40;
        }
        
        let btn = Button(this, 240, 200 + 200, "Continue");
        btn.setButtonColor("white");
        btn.setButtonHoverColor("#DDDDDD");
        btn.setButtonOnClick(() => {
            this.scene.start("LevelSelect");
        });

        this.add.tween({
            targets: [btn, btn.buttonBackgroundImage],
            y: "-=200",
            ease: "power4",
            duration: 1000,
            delay: 6800
        });

        let musicName = "victory-music"
        if(this.game.music && this.game.music.isPlaying){
            if(this.game.music.songName !== musicName){
              this.game.music.stop();
              this.game.music = this.sound.add(musicName, {loop: false});
              this.game.music.play();
              this.game.music.isPlaying = true;
              this.game.music.songName = musicName;
            }
        } else {
            this.game.music = this.sound.add(musicName, {loop: false});
            this.game.music.play();
            this.game.music.isPlaying = true;
            this.game.music.songName = musicName;
        }
    }


}