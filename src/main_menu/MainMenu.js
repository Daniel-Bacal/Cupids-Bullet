import Phaser, {} from "phaser";
import Button from "../ui_elements/Button.js";

var scene;
var splash;
var mainMenu;
var background;
var controlsButtons;
var controlsTitle;
var controlsLineBreak;
var controlsText;
var backstoryButtons;
var backstoryTitle;
var backstoryText;

export default class MainMenu extends Phaser.Scene {
  constructor() {
    super({
      key: "MainMenu"
    });
  }

  preload(){
    console.log("Main Menu");
  }

  create(){
    mainMenu = this.add.image(0, 0, "main-menu");
    mainMenu.setOrigin(0, 0);

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

    // Create buttons
    let buttons = [
      Button(this, 380, 150, "Log-In", "24px"),
      Button(this, 380, 120, "Sign-Up", "24px"),
      Button(this, 380, 180, "Backstory", "24px"),
      Button(this, 380, 210, "Controls", "24px"),
      Button(this, 380, 240, "About", "24px")
    ];

    for(let i = 0; i < buttons.length; i++){
      buttons[i].setButtonColor("#FFFFFF");
      buttons[i].setButtonHoverColor("#DDDDDD");
    }

    buttons[0].setButtonOnClick(() => {
      this.scene.start("Login");
    });

    buttons[1].setButtonOnClick(() => {
      this.scene.start("Signup");
    });

    buttons[2].setButtonOnClick(() => {
      this.scene.start("Backstory");
    });

    buttons[3].setButtonOnClick(() => {
      this.scene.start("Controls", {returnCallback: () => {
        this.scene.start("MainMenu");
        this.scene.stop("Controls");
      }});
    });

    buttons[4].setButtonOnClick(() => {
      this.scene.start("About");
    });
  }

  update(time, delta) {}
}