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
        this.load.image("level-select", "assets/level-select.png");
        this.load.image("level-select-circle", 'assets/level-select-circle.png');
        this.load.image("level-select-x", "assets/level-select-x.png");
    }

    create(){
        this.scene.start("SplashScreen");
    }
}