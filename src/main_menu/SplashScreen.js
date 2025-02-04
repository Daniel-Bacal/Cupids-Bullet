import Phaser, {} from "phaser";

export default class SpashScreen extends Phaser.Scene{
    constructor(){
        super({
            key: "SplashScreen"
        });
    }

    preload(){
        console.log("splash");
    }

    create(){
        this.add.image(0, 0, "mountains-background").setOrigin(0,0);

        this.anims.create({
            key: "mountain-lines",
            frames: this.anims.generateFrameNumbers("lines", {
                start: 0,
                end: 81
            }),
            frameRate: 10,
            repeat: -1
        });
        this.background = this.add.sprite(0, 0, 'mountain-lines').setOrigin(0,0);
        this.background.anims.play("mountain-lines", true);

        let splash = this.add.image(0, 0, "splash-screen");

        splash.setOrigin(0, 0);
        splash.setInteractive();
        this.hasStarted = false;
        splash.on('pointerdown', () => {
            if(!this.hasStarted){
                this.time.addEvent({
                    delay: 1000,
                    callback: () => this.scene.start("MainMenu", {fromSplash: true}),
                    loop: false
                });
                this.tweens.add({
                    targets: splash,
                    alpha: {from: 1, to: 0},
                    ease: "Sine.Out",
                    duration: 1000,
                    repeat: 0
                });
                this.hasStarted = true;
            }
        }, this);

        if(this.game.music && this.game.music.isPlaying){
            if(this.game.music.songName !== "MainMenu"){
              this.game.music.stop();
              this.game.music = this.sound.add("MainMenu", {loop: true});
              this.game.music.play();
              this.game.music.isPlaying = true;
              this.game.music.songName = "MainMenu"
            }
          } else {
            this.game.music = this.sound.add("MainMenu", {loop: true});
            this.game.music.play();
            this.game.music.isPlaying = true;
            this.game.music.songName = "MainMenu"
        }
    }
}