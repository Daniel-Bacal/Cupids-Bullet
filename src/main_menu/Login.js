import Phaser, {} from "phaser"
import TextField from "../ui_elements/TextField.js"
import Button from "../ui_elements/Button"
import Player from "../objects/Player"

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
        let background = this.add.image(0, 0, "background");
        background.setOrigin(0, 0);

        this.player = null;

        let title = this.add.text(240, 30, "Log In:", {fontFamily: "NoPixel", fontSize: "48px"});
        title.setOrigin(0.5, 0.5);

        let usernameText = this.add.text(160, 100, "Username:", {fontFamily: "NoPixel", fontSize: "16px"});
        usernameText.setOrigin(0.5, 0.5);
        let username = new TextField(this, 300, 100, 160, 30, 20, {borderStyle: "solid", borderWidth: "0px 0px 2px 0px", borderColor: "white"});

        let currentPlayerText = this.add.text(240, 150, "Current User:", {fontFamily: "NoPixel", fontSize: "16px"});
        currentPlayerText.setOrigin(0.5, 0.5);

        let loginButtons = [
            Button(this, 100, 240, "Return", "16px", "btn-background", 80, 30),
            Button(this, 240, 240, "Sign Out", "16px", "btn-background", 80, 30),
            Button(this, 380, 240, "Login", "16px", "btn-background", 80, 30)
        ];
        loginButtons[0].setButtonOnClick(() => {
            this.scene.start("MainMenu");
            username.remove();
        });
        loginButtons[0].setButtonColor("#431c5c");
        loginButtons[0].setButtonHoverColor("#431c5c");

        loginButtons[1].setButtonOnClick(() => {
            this.player = null;
            window.sessionStorage.removeItem("current_player");
            currentPlayerText.text = "Current User:"
        });
        loginButtons[1].setButtonColor("#431c5c");
        loginButtons[1].setButtonHoverColor("#431c5c");

        loginButtons[2].setButtonOnClick(() => {
            if(this.player === null){
                let name = username.value;
                this.player = new Player();
                if(this.player.loadFromLocalStorage(name)){
                    currentPlayerText.text = "Current User: " + this.player.getName();
                } else {
                    this.player = null;
                }
            }
        });
        loginButtons[2].setButtonColor("#431c5c");
        loginButtons[2].setButtonHoverColor("#431c5c");

        this.startGameButton = Button(this, 240, 190, "", "48px");
        this.startGameButton.setButtonColor("red");
        this.startGameButton.setButtonHoverColor("#DD0000");
        this.startGameButton.setButtonOnClick(() => {
            this.game.player = this.player;
            this.scene.start("LevelSelect");
            username.remove();
        });
    }

    update(){
        if(this.player !== null){
            if(this.startGameButton.text === ""){
                this.startGameButton.text = "Start Game";
                this.startGameButton.setOrigin(0.5, 0.5);
            }
        } else {
            if(this.startGameButton.text !== ""){
                this.startGameButton.text = "";
            }
        }
    }
}