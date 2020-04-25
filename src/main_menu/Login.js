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

        let title = this.add.text(240, 30, "Log In:", {fontFamily: "NoPixel", fontSize: "48px"});
        title.setOrigin(0.5, 0.5);

        let usernameText = this.add.text(160, 100, "Username:", {fontFamily: "NoPixel", fontSize: "16px"});
        usernameText.setOrigin(0.5, 0.5);
        // let passwordText = this.add.text(160, 150, "Password:", {fontFamily: "NoPixel", fontSize: "16px"});
        // passwordText.setOrigin(0.5, 0.5);
        let username = new TextField(this, 300, 100, 160, 30, 20, {borderStyle: "solid", borderWidth: "0px 0px 2px 0px", borderColor: "white"});
        // let password = new TextField(this, 300, 150, 160, 30, 16, {borderStyle: "solid", borderWidth: "0px 0px 2px 0px", borderColor: "white"});

        let currentPlayerText = this.add.text(140, 150, "Current User:", {fontFamily: "NoPixel", fontSize: "16px"});
        currentPlayerText.setOrigin(0.5, 0.5);

        let loginButtons = [
            Button(this, 100, 240, "Return", "16px", "btn-background", 80, 30),
            Button(this, 240, 240, "Sign Out", "16px", "btn-background", 80, 30),
            Button(this, 380, 240, "Login", "16px", "btn-background", 80, 30)
        ];
        loginButtons[0].setButtonOnClick(() => {
            this.scene.start("MainMenu");
            username.remove();
            //password.remove();
        });
        loginButtons[0].setButtonColor("#431c5c");
        loginButtons[0].setButtonHoverColor("#431c5c");

        loginButtons[1].setButtonOnClick(() => {
            player = null;
            window.localStorage.removeItem("current_player");
            currentPlayerText.text = "Current User: none"
        });
        loginButtons[1].setButtonColor("#431c5c");
        loginButtons[1].setButtonHoverColor("#431c5c");

        loginButtons[2].setButtonOnClick(() => {
            if(player === null){
                let name = username.value;
                player = new Player();
                if(player.loadFromLocalStorage(name)){
                    player.saveToSession();
                    currentPlayerText.text = "Current User: " + player.getName();
                } else {
                    player = null;
                }
            } else {
                this.scene.start("LevelSelect");
                username.remove();
            }

            //password.remove();
        });
        loginButtons[2].setButtonColor("#431c5c");
        loginButtons[2].setButtonHoverColor("#431c5c");

        // TODO: get rid of this
        let player = new Player();
        if(player.loadFromSession()){
            currentPlayerText.text = "Current User: " + player.getName();
        } else {
            currentPlayerText.text = "Current User: none";
            player = null;
        }
    }
}