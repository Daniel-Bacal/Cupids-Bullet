import Phaser, {} from "phaser";
import Button from "./ui_elements/Button.js";

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

class MainMenu extends Phaser.Scene {
  constructor() {
    super({
      key: "SplashScreen"
    });
  }

  preload(){
    this.load.image("splash-screen", "assets/splash-screen.png");
    this.load.image("main-menu", "assets/main-menu.png");
    this.load.image("btn-background", "assets/button.png");
    this.load.image("background", "assets/background.png");
    scene = this;
  }

  create(){
    console.log("Main Menu");
    setUpSplashScreen();
    setUpMainMenuScreen();
    setUpBackground();
    setUpBackstoryScreen();
    setUpControlsScreen();
  }

  update(time, delta) {}
}

function setUpSplashScreen(){
  splash = scene.add.image(0, 0, "splash-screen");
  splash.setOrigin(0, 0);
  splash.setInteractive();
  splash.on('pointerdown', () => {
    showSplashScreen(false);
    showMainMenuScreen(true);
  }, scene);
}

function showSplashScreen(flag){
  splash.visible = flag;
}

function setUpMainMenuScreen(){
  mainMenu = scene.add.image(0, 0, "main-menu");
  mainMenu.setOrigin(0, 0);
  mainMenu.visible = false;

  // Create buttons
  let buttons = [
    Button(scene, 380, 120, "Log-In", "24px"),
    Button(scene, 380, 150, "Sign-Up", "24px"),
    Button(scene, 380, 180, "Backstory", "24px"),
    Button(scene, 380, 210, "Controls", "24px"),
    Button(scene, 380, 240, "About", "24px")
  ];

  for(let i = 0; i < buttons.length; i++){
    buttons[i].setButtonColor("#FFFFFF");
    buttons[i].setButtonHoverColor("#DDDDDD");
    buttons[i].setButtonVisible(false);
  }

  buttons[2].setButtonOnClick(() => {
    showMainMenuScreen(false);
    showBackstoryScreen(true);
  });

  buttons[3].setButtonOnClick(() => {
    showMainMenuScreen(false);
    showControlsScreen(true);
  });

  mainMenu.buttons = buttons;
}

function showMainMenuScreen(flag){
  mainMenu.visible = flag;
  for(let i = 0; i < mainMenu.buttons.length; i++){
    mainMenu.buttons[i].setButtonVisible(flag);
  }
}

function setUpBackground(){
  background = scene.add.image(0, 0, "background");
  background.setOrigin(0, 0);
  background.visible = false;
}

function setUpControlsScreen(){
  controlsButtons = [
    Button(scene, 240, 240, "Return", "16px", "btn-background", 150, 30)
  ];
  controlsButtons[0].setButtonOnClick(() => {
    showControlsScreen(false);
    showMainMenuScreen(true);
  });
  controlsButtons[0].setButtonColor("#431c5c");
  controlsButtons[0].setButtonHoverColor("#431c5c");
  controlsButtons[0].setButtonVisible(false);
  let title = "Controls";
  controlsTitle = scene.add.text(240, 30, title, {fill: "#ffffff", fontFamily: "NoPixel", fontSize: "48px"});
  controlsTitle.setOrigin(0.5, 0.5);
  controlsTitle.visible = false;
  
  controlsLineBreak = scene.add.rectangle(140, 126, 200, 4, 0xffffff);
  controlsLineBreak.setOrigin(0, 0);
  controlsLineBreak.visible = false;
  let text = "Click - to interact with app\nKeyboard - to play minigames\n\n\nClick - to shoot bullets in battles\nWASD - to move around in battles\nSpace - to use special ability";
  controlsText = scene.add.text(240, 135, text, {fill: "#ffffff", fontFamily: "NoPixel", bafontSize: "16px", align: "center", wordWrap: { width: 400, useAdvancedWrap: true }});
  controlsText.setOrigin(0.5, 0.5);
  controlsText.visible = false;
}

function showControlsScreen(flag){
  background.visible = flag;
  controlsTitle.visible = flag;
  controlsText.visible = flag;
  controlsLineBreak.visible = flag;
  for(let i = 0; i < controlsButtons.length; i++){
    controlsButtons[i].setButtonVisible(flag);
  }
}

function setUpBackstoryScreen(){
  backstoryButtons = [
    Button(scene, 240, 240, "Return", "16px", "btn-background", 150, 30)
  ];
  backstoryButtons[0].setButtonOnClick(() => {
    showBackstoryScreen(false);
    showMainMenuScreen(true);
  });
  let title = "Backstory";
  backstoryTitle = scene.add.text(240, 30, title, {fill: "#ffffff", fontFamily: "NoPixel", fontSize: "48px"});
  backstoryTitle.setOrigin(0.5, 0.5);
  backstoryTitle.visible = false;
  let text = "You've been struggling to find romance. It's only 3 days until Valentine's Day and you're trying to find a date for the big day. You've been hearing about this new dating app called Grynder and decide to give it a go. However, what you don't realize, is that this dating app has special features. You don't just land a date, you have to fight for it.";
  backstoryText = scene.add.text(240, 135, text, {fill: "#ffffff", fontFamily: "NoPixel", bafontSize: "16px", align: "center", wordWrap: { width: 400, useAdvancedWrap: true }});
  backstoryText.setOrigin(0.5, 0.5);
  backstoryText.visible = false;
  backstoryButtons[0].setButtonColor("#431c5c");
  backstoryButtons[0].setButtonHoverColor("#431c5c");
  backstoryButtons[0].setButtonVisible(false);
}

function showBackstoryScreen(flag){
  background.visible = flag;
  backstoryTitle.visible = flag;
  backstoryText.visible = flag;
  for(let i = 0; i < backstoryButtons.length; i++){
    backstoryButtons[i].setButtonVisible(flag);
  }
}


export default MainMenu;
