import Phaser, {} from "phaser";
import Button from "../ui_elements/Button.js";
import Player from "../objects/Player"

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

  init(data){
    if(this.fromSplash === undefined){
      this.fromSplash = data.fromSplash;
    } else {
      this.fromSplash = false;
    }
  }

  create(){
    this.add.image(0, 0,"mountains-background").setOrigin(0, 0);

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
      Button(this, 380, 120, "Sign-Up", "24px"),
      Button(this, 380, 150, "Log-In", "24px"),
      Button(this, 380, 180, "Backstory", "24px"),
      Button(this, 380, 210, "Controls", "24px"),
      Button(this, 380, 240, "About", "24px")
    ];

    if(this.fromSplash){
      this.tweens.add({
        targets: mainMenu,
        alpha: {from: 0, to: 1},
        ease: "Sine.In",
        duration: 1000,
        repeat: 0
      });

      let d = 500;
      let dInc = 50;
      for(let i = 0; i < buttons.length; i++){
        buttons[i].x = 580;
        this.tweens.add({
          targets: buttons[i],
          x: "-=200",
          ease: "Quart",
          delay: d,
          duration: 500,
          repeat: 0
        });
        d += dInc;
      }
    }

    // let b = Button(this, 100, 100, "Endless", "24px");
    // b.setButtonOnClick(() => {
    //   this.game.player = new Player();
    //   this.game.player.loadFromLocalStorage("test");
    //   this.scene.start("BulletHell", {endless: true});
    // })

    for(let i = 0; i < buttons.length; i++){
      buttons[i].setButtonColor("#FFFFFF");
      buttons[i].setButtonHoverColor("#DDDDDD");
    }

    buttons[0].setButtonOnClick(() => {
      this.fromSplash = false;
      this.scene.start("Signup");
    });

    buttons[1].setButtonOnClick(() => {
      this.fromSplash = false;
      this.scene.start("Login");
    });

    buttons[2].setButtonOnClick(() => {
      this.fromSplash = false;
      this.scene.start("Backstory");
    });

    buttons[3].setButtonOnClick(() => {
      this.fromSplash = false;
      this.scene.start("Controls", {returnCallback: () => {
        this.scene.start("MainMenu");
        this.scene.stop("Controls");
      }});
    });

    buttons[4].setButtonOnClick(() => {
      this.fromSplash = false;
      this.scene.start("About");
    });
  }

  update(time, delta) {}
}