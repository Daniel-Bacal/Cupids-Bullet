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
        let splash = this.add.image(0, 0, "splash-screen");

        splash.setOrigin(0, 0);
        splash.setInteractive();
        splash.on('pointerdown', () => {
            this.scene.start("MainMenu");
        }, this);

        // if(this.game.music && this.game.music.isPlaying){
        //     if(this.game.music.songName !== "MainMenu"){
        //       this.game.music.stop();
        //       this.game.music = this.sound.add("MainMenu", {loop: true});
        //       this.game.music.play();
        //       this.game.music.isPlaying = true;
        //       this.game.music.songName = "MainMenu"
        //     }
        //   } else {
        //     this.game.music = this.sound.add("MainMenu", {loop: true});
        //     this.game.music.play();
        //     this.game.music.isPlaying = true;
        //     this.game.music.songName = "MainMenu"
        // }
    }
}