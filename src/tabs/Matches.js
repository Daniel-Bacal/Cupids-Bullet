import Phaser, {} from "phaser"
import AbstractTab from "./AbstractTab"
import Person from "../objects/Person"
import Button from "../ui_elements/Button"
import { randomFrom } from "../utils/MathUtils"

export default class Matches extends AbstractTab{
    constructor(){
        super("Matches");
    }

    preload(){
        console.log("Matches");
    }

    create(){
        let background = this.add.image(0, 0, "matches");
        background.setOrigin(0, 0);

        this.initMatchButtons();

        this.personText = this.add.text(61, 130, "", {fill: "#FFFFFF", fontFamily: "NoPixel", fontSize: "8px"});
        this.personText.setOrigin(0.5, 0.5);

        this.messageLocations = [50, 85, 120, 155, 190];
        this.playerMessageX = 270;
        this.matchMessageX = 245;
        this.messages = [null, null, null, null, null];
        this.messageTexts = [null, null, null, null, null];
        this.bioText = this.add.text(15, 150, "", {fill: "#431c5c", fontFamily: "NoPixel", fontSize: "8px", wordWrap: { width: 150, useAdvancedWrap: true }});

        this.initMessaging();

        this.currentPerson = this.parent.personArray[0];
        this.displayCurrentPerson(this.currentPerson);

        this.shadeGraphics = [this.add.graphics(), this.add.graphics(), this.add.graphics(), this.add.graphics(), this.add.graphics()];
        this.messageGraphics = [this.add.graphics(), this.add.graphics(), this.add.graphics(), this.add.graphics(), this.add.graphics()];
    }

    update(){
        if(this.currentPerson.isAwaitingMessage()){
            this.showMessageOptions();
        }

        if(this.currentPerson.notRead){
            this.currentPerson.readMessage();
            // Get last message type
            let lastMessage = this.currentPerson.getLastPlayerMessage();
            let type = lastMessage.type;
            // Increment Stats
            console.log("Here");
            if(this.currentPerson.likesMessage(type) === 1){
                this.parent.player.incrementStat("flirt", 1);
                this.parent.displayProgress("flirt", 1);
            } else if(this.currentPerson.likesMessage(type) === -1){
                this.parent.player.incrementStat("flirt", -1);
                this.parent.displayProgress("flirt", -1);
            }
        }

        let x = 147;
        let y = 34;
        for(let i = 0; i < this.parent.personArray.length; i++){
            this.messageGraphics[i].clear();
            if(this.parent.personArray[i].notRead){
                this.messageGraphics[i].fillStyle(0xFF0000);
                this.messageGraphics[i].fillCircle(x + 18-2, y+2, 4)
            }
            
            this.shadeGraphics[i].clear();
            this.shadeGraphics[i].fillStyle(0x000000, 0.3);
            this.shadeGraphics[i].fillRect(x, y, 18, 20 + (i === 0 || i === this.parent.personArray.length - 1? 1 : 0));
            y += 21;
            if(i === 0) y += 1;

            if(this.parent.personArray[i] === this.currentPerson){
                this.shadeGraphics[i].clear();
            }
        }

        this.drawMessages();
    }

    displayCurrentPerson(person){
        this.currentPerson = person;

        let name = person.getName();
        this.personText.setText(name);

        this.appearance = person.getAppearance();
        let tempBioText = person.getBio();
        this.bioText.setText(tempBioText);

        for(let i in this.appearance){
            this.add.image(61, 88, this.appearance[i]);
        }

        // Show message if possible
        if(person.isAwaitingMessage()){
            this.showMessageOptions();
        } else {
            this.hideMessageOptions();
        }
    }

    initMatchButtons(){
        let y = 44.5;
        let yOff = 21;
        this.match1 = Button(this, 156.5, y, "1", "16px");
        this.match1.setButtonColor("#431c5c");
        this.match1.setButtonHoverColor("#330c4c");
        this.match1.setButtonOnClick(() => this.displayCurrentPerson(this.parent.personArray[0]));

        this.match1 = Button(this, 156.5, y+yOff*1, "2", "16px");
        this.match1.setButtonColor("#431c5c");
        this.match1.setButtonHoverColor("#330c4c");
        this.match1.setButtonOnClick(() => this.displayCurrentPerson(this.parent.personArray[1]));

        this.match1 = Button(this, 156.5, y+yOff*2, "3", "16px");
        this.match1.setButtonColor("#431c5c");
        this.match1.setButtonHoverColor("#330c4c");
        this.match1.setButtonOnClick(() => this.displayCurrentPerson(this.parent.personArray[2]));

        this.match1 = Button(this, 156.5, y+yOff*3, "4", "16px");
        this.match1.setButtonColor("#431c5c");
        this.match1.setButtonHoverColor("#330c4c");
        this.match1.setButtonOnClick(() => this.displayCurrentPerson(this.parent.personArray[3]));

        this.match1 = Button(this, 156.5, y+yOff*4, "5", "16px");
        this.match1.setButtonColor("#431c5c");
        this.match1.setButtonHoverColor("#330c4c");
        this.match1.setButtonOnClick(() => this.displayCurrentPerson(this.parent.personArray[4]));
    }

    initMessaging(){
        this.initMessagingOptions();
    }

    initMessagingOptions(){
        /*
            TODO:
                Consider changing this to randomly generate 5 messages of any type
        */
        this.messageChoices = {
            jock: Button(this, 180, 206, "1) Send Jock Message", "8px"),
            flirt: Button(this, 180, 214, "2) Send Flirty Message", "8px"),
            int: Button(this, 180, 222, "3) Send Intelligent Message", "8px"),
            hum: Button(this, 180, 230, "4) Send Funny Message", "8px"),
            sinc: Button(this, 180, 238, "5) Send Sincere Message", "8px"),
        }

        for(let key in this.messageChoices){
            this.messageChoices[key].setButtonColor("#431c5c");
            this.messageChoices[key].setOrigin(0, 0);
            this.messageChoices[key].setButtonOnClick(() => {
                this.sendMessage(key);
            });
        }

        this.hideMessageOptions();
    }

    sendMessage(type){
        console.log("sent");
        this.sound.play("MessageSentSFX");
        let messages = {
            jock: ["Wanna go to the gym?", "i have a six pack.","r u flexible?","need a spotter?","I can bench 200lb"],
            int: ["I'm reading a great book rn.", "Do you like math?", "wanna grab coffee? I need a <br/>","I have a 4.0 ;)"],
            hum: ["You like raisins? How about a date?","ru garbage? I wanna take u out"],
            sinc: ["You're so beautiful", "Want to be my one and only?", "I can recite poetry for you"],
            flirt: ["want to come over later?", "hey there sexy"]
        };
        let message = randomFrom(messages[type]);
        this.currentPerson.sendMessage(message, type, this.time.now);
        this.hideMessageOptions();
    }

    showMessageOptions(){
        for(let key in this.messageChoices){
            this.messageChoices[key].setButtonVisible(true);
        }
    }

    hideMessageOptions(){
        console.log("hide");
        for(let key in this.messageChoices){
            this.messageChoices[key].setButtonVisible(false);
        }
    }

    drawMessages(){
        let messageHistory = this.currentPerson.getMessageHistory();
        let str = "-message";
        let index = 0;
        if(messageHistory.length > 5){
            index = messageHistory.length - 5;
        }

        if(messageHistory.length !== 0){
            str = messageHistory[index].sender + str;
        }
        
        for(let i = 0; i < this.messageLocations.length; i++){
            if(this.messages[i] !== null){
                this.messages[i].destroy();
            }
            if(this.messageTexts[i] !== null){
                this.messageTexts[i].destroy();
            }
        }
        
        let x;
        if(str === "player-message"){
            x = this.playerMessageX;
        } else {
            x = this.matchMessageX;
        }
        

        for(let i = 0; i < this.messageLocations.length; i++){
            if(index + i < messageHistory.length){
                this.messages[i] = this.add.image(x, this.messageLocations[i], str)

                this.messageTexts[i] = this.add.text(x, this.messageLocations[i], messageHistory[i+index].text, {color: "#431c5c", fontSize: "8px", fontFamily: "NoPixel"});
                this.messageTexts[i].setOrigin(0.5, 1);

                x = x === this.playerMessageX ? this.matchMessageX : this.playerMessageX;
                str = str === "player-message" ? "person-message" : "player-message";
            }
        }
    }
}