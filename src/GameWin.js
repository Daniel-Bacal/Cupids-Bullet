import Phaser, {} from "phaser";

export default class GameWin extends Phaser.Scene{
    constructor(){
        super({
            key: "GameWin"
        });
    }

    preload(){
        console.log("GameWin");
    }

    create(){
        let blackScreen = this.add.graphics();
        blackScreen.fillStyle(0x000000);
        blackScreen.fillRect(0, 0, 480, 270);
        blackScreen.depth = 1000;

        let background = this.add.image(0, 0, "game-win");

        background.setOrigin(0, 0);

        this.time.addEvent({
            delay: 10000,
            callback: () => {
                background.setInteractive();
                background.on('pointerdown', () => {
                    this.scene.start("MainMenu");
                }, this);
            },
            loop: false
        });

        this.add.tween({
            targets: blackScreen,
            alpha: {from: 1, to: 0},
            duration: 200,
            delay: 10000,
            ease: "Quad",
        })

        this.time.addEvent({
            delay: 2000,
            callback: () => {
                let musicName = "gameComplete"
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
            },
            loop: false
        });
    }
}