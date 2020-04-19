import Phaser, {} from "phaser"
import Button from "./ui_elements/Button"

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
        this.initTabs();

        this.initTimer();
    }

    update(){
        this.handleTimer();
    }

    initTabs(){
        this.tabs = ["Home", "Matches", "Gym", "Haikus", "Jokes", "Math"];
        this.scene.launch("Ads", {parent: this});

        this.buttons = {};
        
        for(let i = 0; i < this.tabs.length; i++){
            this.scene.launch(this.tabs[i], {parent: this});
            this.buttons[this.tabs[i]] = Button(this, 38 + i*57, 11, this.tabs[i], "8px", "invisibutton", 49, 14);
            this.buttons[this.tabs[i]].setButtonColor("#FFFFFF");
            this.buttons[this.tabs[i]].setButtonOnClick(() => this.moveToTab(this.tabs[i]));
        }

        this.scene.sendToBack("Ads");
        this.moveToTab("Home");
    }

    initTimer(){
        this.startTime = this.time.now;
        this.totalTime = 60;

        this.timerText = this.add.text(450, 10, "Error", {color: "white", fontSize: "16px", fontFamily: "NoPixel"});
    }

    handleTimer(){
        let timeRemaining = this.totalTime - (this.time.now - this.startTime)/1000;

        // if(timeRemaining <= 0){
        //     this.scene.start("MainMenu");
        // }

        let minutesRemaining = Math.floor(timeRemaining / 60);
        let secondsRemaining = Math.floor(timeRemaining % 60);

        // Otherwise, display the clock
        this.timerText.text = minutesRemaining + ":" + secondsRemaining;
        this.timerText.setOrigin(0.5, 0.5);

    }

    moveToTab(key){
        for(let i = 0; i < this.tabs.length; i++){
            this.scene.sleep(this.tabs[i]);
        }
        this.scene.wake(key);
        this.scene.sendToBack("Ads");
        this.scene.bringToTop();
    }

}