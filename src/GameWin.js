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
        let background = this.add.image(0, 0, "game-win");

        background.setOrigin(0, 0);
        background.setInteractive();
        background.on('pointerdown', () => {
            this.scene.start("MainMenu");
        }, this);

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