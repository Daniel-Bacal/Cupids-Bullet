import Phaser, {} from "phaser"
import TextField from "../ui_elements/TextField.js"
import Button from "../ui_elements/Button"
import Player from "../objects/Player"

let enter; 

export default class Login extends Phaser.Scene{
    constructor(){
        super({
            key: "Login"
        });
    }

    preload(){
        console.log("Login");
    }

    create(){
        enter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        this.add.image(0, 0, "mountains-background").setOrigin(0, 0);
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

        this.player = null;

        let title = this.add.text(240, 30, "Log In:", {fontFamily: "NoPixel", fontSize: "48px"});
        title.setOrigin(0.5, 0.5);

        let usernameText = this.add.text(160, 100, "Username:", {fontFamily: "NoPixel", fontSize: "16px"});
        usernameText.setOrigin(0.5, 0.5);
        this.username = new TextField(this, 300, 100, 160, 30, 20, {borderStyle: "solid", borderWidth: "0px 0px 2px 0px", borderColor: "white"});

        this.currentPlayerText = this.add.text(240, 150, "Current User:", {fontFamily: "NoPixel", fontSize: "16px"});
        this.currentPlayerText.setOrigin(0.5, 0.5);

        let loginButtons = [
            Button(this, 100, 240, "Return", "16px", "btn-background", 80, 30),
            Button(this, 240, 240, "Sign Out", "16px", "btn-background", 80, 30),
            Button(this, 380, 240, "Login", "16px", "btn-background", 80, 30)
        ];
        loginButtons[0].setButtonOnClick(() => {
            this.scene.start("MainMenu");
            this.username.remove();
        });
        loginButtons[0].setButtonColor("#431c5c");
        loginButtons[0].setButtonHoverColor("#431c5c");

        loginButtons[1].setButtonOnClick(() => {
            if(this.player){
                this.startGameOut.resume();
                this.startGameOut.restart();
            }
            this.player = null;
            window.sessionStorage.removeItem("current_player");
            this.currentPlayerText.text = "Current User:"
        });
        loginButtons[1].setButtonColor("#431c5c");
        loginButtons[1].setButtonHoverColor("#431c5c");

        loginButtons[2].setButtonOnClick(() => {
            if(this.player === null){
                let name = this.username.value;
                this.player = new Player();
                if(this.player.loadFromLocalStorage(name)){
                    this.currentPlayerText.text = "Current User: " + this.player.getName();
                    this.startGameIn.resume();
                    this.startGameIn.restart();
                } else {
                    this.player = null;
                }
            }
        });
        loginButtons[2].setButtonColor("#431c5c");
        loginButtons[2].setButtonHoverColor("#431c5c");

        this.startGameButton = Button(this, -160, 190, "Start Game", "48px");
        this.startGameButton.setButtonColor("#FFFFFF");
        this.startGameButton.setButtonHoverColor("#DDDDDD");
        this.startGameButton.setButtonOnClick(() => {
            if(this.player){
                this.game.player = this.player;
                this.scene.start("LevelSelect");
                this.username.remove();
            }
        });

        this.startGameIn = this.add.tween({
            targets: [this.startGameButton, this.startGameButton.buttonBackgroundImage],
            x: {from: -160, to: 240},
            ease: "power4",
            duration: 1000,
            delay: 0,
            paused: true
        });
        this.startGameOut = this.add.tween({
            targets: [this.startGameButton, this.startGameButton.buttonBackgroundImage],
            x: {from: 240, to: 640},
            ease: "Quart.easeIn",
            duration: 800,
            delay: 0,
            paused: true
        })
    }

    update(){
        if (Phaser.Input.Keyboard.JustDown(enter)){
            if(this.player === null){
                let name = this.username.value;
                this.player = new Player();
                if(this.player.loadFromLocalStorage(name)){
                    this.currentPlayerText.text = "Current User: " + this.player.getName();
                    this.startGameIn.resume();
                    this.startGameIn.restart();
                } else {
                    this.player = null;
                }
            }
        }
    }
}