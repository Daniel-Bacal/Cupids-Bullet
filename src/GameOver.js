import Phaser, {} from "phaser";

export default class GameOver extends Phaser.Scene{
    constructor(){
        super({
            key: "GameOver"
        });
    }

    preload(){
        console.log("GameOver");
    }

    create(){
        let background = this.add.image(0, 0, "game-over");

        background.setOrigin(0, 0);
        background.setInteractive();
        background.on('pointerdown', () => {
            this.scene.start("MainMenu");
        }, this);

        if(this.game.music && this.game.music.isPlaying){
            if(this.game.music.songName !== "game-over"){
              this.game.music.stop();
              this.game.music = this.sound.add("game-over", {loop: false});
              this.game.music.play();
              this.game.music.isPlaying = true;
              this.game.music.songName = "game-over"
            }
          } else {
            this.game.music = this.sound.add("game-over", {loop: false});
            this.game.music.play();
            this.game.music.isPlaying = true;
            this.game.music.songName = "game-over"
        }
    }
}