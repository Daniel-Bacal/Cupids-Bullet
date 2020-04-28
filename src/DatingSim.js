import Phaser, {} from "phaser"
import Button from "./ui_elements/Button"
import { clamp } from "./utils/MathUtils"
import Player from "./objects/Player";
import Person from "./objects/Person"

var cheatSkip;

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
        this.player = this.game.player;

        this.personArray = this.game.matches;

        this.unreadMessage = false;
        this.showingUnreadMessage = false;
        this.unreadMessageGraphic = this.add.graphics();
        this.unreadMessageText = this.add.text(115, 5, "", {fill: "white", fontFamily: "NoPixel", fontSize: "8px"});

        this.initTabs();

        this.initTimer();
        
        this.initPauseButton();

        this.startMusic();

        cheatSkip = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F1);
    }

    update(){
        // Check for cheats
        if(Phaser.Input.Keyboard.JustDown(cheatSkip)){
            this.goToScene("ChooseDate");
        }

        if(this.previousTime === null) this.setTimer();
        this.handleTimer();

        this.handleMessaging();
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
        this.totalTime = 5*60 + 1;
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

        minutesRemaining = clamp(minutesRemaining, 0, 59);
        secondsRemaining = clamp(secondsRemaining, 0, 59);

        // Otherwise, display the clock
        this.timerText.text = minutesRemaining + ":" + secondsRemaining;
        this.timerText.setOrigin(0.5, 0.5);

    }

    endDay(){
        this.goToScene("ChooseDate");
    }

    goToMainMenu(){
        this.scene.pause("PauseMenu");
        this.scene.launch("YesNoModal", {
            yesCallback: () => {
                this.scene.stop("YesNoModal");
                this.goToScene("MainMenu");
            },
            noCallback: () => {
                this.scene.stop("YesNoModal");
                this.scene.resume("PauseMenu");
            }
        });
        this.scene.bringToTop("YesNoModal");
    }

    goToScene(sceneName){
        for(let i = 0; i < this.tabs.length; i++){
            this.scene.stop(this.tabs[i]);
        }
        this.scene.stop("Ads");
        this.scene.stop("PauseMenu");

        // GO TO END OF DAY SCENE
        this.scene.start(sceneName);
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

    goToControls(){
        this.scene.sleep("PauseMenu");
        this.scene.launch("Controls", {returnCallback: () => {
            this.scene.wake("PauseMenu");
            this.scene.stop("Controls");
        }});
        this.scene.bringToTop("Controls");
    }

    startMusic(){
        let musicName = "Day" + 1;//this.player.getName();
        if(this.game.music && this.game.music.isPlaying){
            if(this.game.music.songName !== musicName){
              this.game.music.stop();
              this.game.music = this.sound.add(musicName, {loop: true});
              this.game.music.play();
              this.game.music.isPlaying = true;
              this.game.music.songName = musicName;
            }
        } else {
            this.game.music = this.sound.add(musicName, {loop: true});
            this.game.music.play();
            this.game.music.isPlaying = true;
            this.game.music.songName = musicName
        }
    }

    messagePlayer(person){
        console.log("recieved");
        this.sound.play("MessageReceivedSFX");
        person.messagePlayer();
        this.unreadMessage = true;
    }

    handleMessaging(){
        let allMessagesRead = true;
        let numUnreadMessages = 0;
        for(let i = 0; i < this.personArray.length; i++){
            let person = this.personArray[i];

            // If person should message player, do so
            if(person.nextMessageTime < this.time.now){
                this.messagePlayer(person);
                person.nextMessageTime = Infinity;
            }

            if(person.notRead){
                // Player hasn't read recieved message
                allMessagesRead = false;
                numUnreadMessages++;
            }
        }
        
        if(allMessagesRead){
            this.unreadMessage = false;
        }

        if(this.unreadMessage && !this.showingUnreadMessage){
            this.unreadMessageGraphic.fillStyle(0xFF0000);
            this.unreadMessageGraphic.fillCircle(115, 5, 4);
            this.showingUnreadMessage = true;
        } else if(!this.unreadMessage && this.showingUnreadMessage){
            this.unreadMessageGraphic.clear();

            this.showingUnreadMessage = false;
        }

        if(this.unreadMessage){
            this.unreadMessageText.text = numUnreadMessages;
            this.unreadMessageText.setOrigin(0.5, 0.5);
        } else {
            this.unreadMessageText.text = "";
            this.unreadMessageText.setOrigin(0.5, 0.5);
        }
    }

    displayProgress(stat, change){
        if(!this.feedbackText){
            this.feedbackText = this.add.text(0, 0, "", {fontFamily: "NoPixel", fontSize: "16px"})
        }

        if(!this.feedbackTextFade){
            this.feedbackTextFade = this.tweens.add({
                targets: this.feedbackText,
                alpha: 0,
                y: "-=50",
                duration: 1000,
                ease: 'Power2'
            }, this);
        }

        this.feedbackText.setPosition(Math.floor(Math.random()*400 + 40), Math.floor(Math.random()*200 + 35));
        this.feedbackText.text = stat + " " + (change > 0 ? "+" + change : change);
        this.feedbackText.setOrigin(0.5, 0.5);
        this.feedbackText.setStyle(change > 0 ? {color: "green"} : {color: "red"});
        this.feedbackText.alpha = 1;

        this.feedbackTextFade.restart();
    }
}