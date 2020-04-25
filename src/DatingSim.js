import Phaser, {} from "phaser"
import Button from "./ui_elements/Button"
import { clamp } from "./utils/MathUtils"
import Player from "./objects/Player";

export default class DatingSim extends Phaser.Scene{
    constructor(){
        super({
            key: "DatingSim"
        });
    }

    preload(){
        console.log("Dating Sim");
    }

    create(){
        this.player = new Player();
        this.player.loadFromSession();

        this.initTabs();

        this.initTimer();
        
        this.initPauseButton();
    }

    update(){
        if(this.previousTime === null) this.setTimer();
        this.handleTimer();
    }

    initTabs(){
        this.tabs = ["Home", "Matches", "Gym", "Haikus", "Jokes", "Math"];
        this.scene.launch("Ads", {parent: this});
        this.scene.launch("PauseMenu", {parent: this});
        this.scene.sleep("PauseMenu");

        this.buttons = {};
        
        for(let i = 0; i < this.tabs.length; i++){
            this.scene.launch(this.tabs[i], {parent: this});
            this.buttons[this.tabs[i]] = Button(this, 38 + i*57, 11, this.tabs[i], "8px", "invisibutton", 49, 14);
            this.buttons[this.tabs[i]].setButtonColor("#FFFFFF");
            this.buttons[this.tabs[i]].setButtonOnClick(() => this.moveToTab(this.tabs[i]));
        }

        this.scene.sendToBack("Ads");
        this.currentTab = "Home";
        this.moveToTab(this.currentTab);
    }

    initTimer(){
        this.timeActive = 0;
        this.previousTime = null;
        this.totalTime = 61;
        this.timerText = this.add.text(420, 10, "Error", {color: "white", fontSize: "16px", fontFamily: "NoPixel"});
    }

    setTimer(){
        this.previousTime = this.time.now;
    }

    handleTimer(){
        // Increment active time
        this.timeActive += this.time.now - this.previousTime;
        this.previousTime = this.time.now;
        let timeRemaining = this.totalTime - this.timeActive/1000;

        if(timeRemaining <= 0){
            this.endDay();
        } else if(timeRemaining <= 30){
            this.timerText.setStyle({color: "red"});
        }

        let minutesRemaining = Math.floor(timeRemaining / 60);
        let secondsRemaining = Math.floor(timeRemaining % 60);

        secondsRemaining = secondsRemaining < 10 ? "0" + secondsRemaining : secondsRemaining;

        clamp(minutesRemaining, 0, 59);
        clamp(secondsRemaining, 0, 59);

        // Otherwise, display the clock
        this.timerText.text = minutesRemaining + ":" + secondsRemaining;
        this.timerText.setOrigin(0.5, 0.5);

    }

    endDay(){

        // TODO: SAVE GAME DATA
        this.player.saveToSession();

        this.goToMainMenu();
    }

    goToMainMenu(){
        for(let i = 0; i < this.tabs.length; i++){
            this.scene.stop(this.tabs[i]);
        }
        this.scene.stop("Ads");
        this.scene.stop("PauseMenu");

        // GO TO END OF DAY SCENE
        this.scene.start("MainMenu");
    }

    moveToTab(key){
        for(let i = 0; i < this.tabs.length; i++){
            this.scene.sleep(this.tabs[i]);
        }
        this.currentTab = key;
        this.scene.wake(this.currentTab);
        this.scene.sendToBack("Ads");
        this.scene.bringToTop();
        this.scene.bringToTop("PauseMenu");
    }

    initPauseButton(){
        this.pauseButton = Button(this, 450, 10, "P");
        this.pauseButton.setButtonColor("white");
        this.pauseButton.setButtonOnClick(() => this.pauseGame(true));
    }

    pauseGame(flag){
        if(flag){
            this.scene.wake("PauseMenu");
            this.scene.pause(this.currentTab);
            this.scene.pause();
        } else {
            this.scene.sleep("PauseMenu");

            // Unpaused, so reset the timer
            this.previousTime = null;

            this.scene.resume(this.currentTab);
            this.scene.resume();
        }    
    }
}