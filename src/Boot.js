import Phaser, {} from "phaser";

export default class Boot extends Phaser.Scene{
    constructor(){
        super({
            key: "Boot"
        });
    }

    preload(){
        console.log("Boot");
        // Load all game files here
        // TODO: add progress bar
        this.load.image("splash-screen", "assets/splash-screen.png");
        this.load.image("main-menu", "assets/main-menu.png");
        this.load.image("btn-background", "assets/button.png");
        this.load.image("background", "assets/background.png");
    }

    create(){
        this.scene.start("SplashScreen");
    }
}