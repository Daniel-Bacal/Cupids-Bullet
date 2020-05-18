import Phaser, {} from "phaser"
import AbstractTab from "./AbstractTab"
import Person from "../objects/Person"
import Button from "../ui_elements/Button"
import { randomFrom } from "../utils/MathUtils"
import { messageText } from "../utils/MessageText"

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

        this.personText = this.add.text(61, 125, "", {fill: "#FFFFFF", fontFamily: "NoPixel", fontSize: "8px"});
        this.personText.setOrigin(0.5, 0.5);

        this.messageLocations = [50, 85, 120, 155, 190];
        this.playerMessageX = 270;
        this.matchMessageX = 245;
        this.messages = [null, null, null, null, null];
        this.messageTexts = [null, null, null, null, null];
        this.bioText = this.add.text(15, 145, "", {fill: "#431c5c", fontFamily: "NoPixel", fontSize: "8px", wordWrap: { width: 150, useAdvancedWrap: true }});

        this.initRelationshipMeter();

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

        this.updateRelationshipMeter();

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
            this.add.image(61, 82, this.appearance[i]);
        }

        // Show message if possible
        if(person.isAwaitingMessage()){
            this.showMessageOptions();
        } else {
            this.hideMessageOptions();
        }
    }

    displayPersonIcon(x, y, person){
        for(let i in person.getAppearance()){
            let image = this.add.image(x, y, person.getAppearance()[i]);
            image.setScale(0.375, 0.375);
            image.setCrop(0, 0, 59, 55);
        }
    }

    updateRelationshipMeter(){
        this.relationshipMeter.clear();
        this.relationshipMeter.fillStyle(0xFF83AC);
        this.relationshipMeter.fillRect(110, 133, 10, -(Math.round(this.currentPerson.relationshipMeter*0.91)));
    }

    initRelationshipMeter(){
        this.relationshipMeter = this.add.graphics();
        this.relationshipMeter.setScrollFactor(0, 0);

        this.relationshipMeterBox = this.add.graphics();
        this.relationshipMeterBox.lineStyle(2, 0x431C5C);
        this.relationshipMeterBox.strokeRect(110, 42, 10, 91);
        this.relationshipMeterBox.setScrollFactor(0, 0);
    }

    initMatchButtons(){
        let y = 44.5;
        let yOff = 21;

        this.displayPersonIcon(156, y+3, this.parent.personArray[0]);
        this.match1 = Button(this, 156.5, y, "1", "16px");
        this.match1.setButtonColor("#FFFFFF");
        this.match1.setButtonHoverColor("#330c4c");
        this.match1.setButtonOnClick(() => this.displayCurrentPerson(this.parent.personArray[0]));

        this.displayPersonIcon(156, y+yOff*1+3, this.parent.personArray[1])
        this.match1 = Button(this, 156.5, y+yOff*1, "2", "16px");
        this.match1.setButtonColor("#FFFFFF");
        this.match1.setButtonHoverColor("#330c4c");
        this.match1.setButtonOnClick(() => this.displayCurrentPerson(this.parent.personArray[1]));

        this.displayPersonIcon(156, y+yOff*2+3, this.parent.personArray[2])
        this.match1 = Button(this, 156.5, y+yOff*2, "3", "16px");
        this.match1.setButtonColor("#FFFFFF");
        this.match1.setButtonHoverColor("#330c4c");
        this.match1.setButtonOnClick(() => this.displayCurrentPerson(this.parent.personArray[2]));

        this.displayPersonIcon(156, y+yOff*3+3, this.parent.personArray[3])
        this.match1 = Button(this, 156.5, y+yOff*3, "4", "16px");
        this.match1.setButtonColor("#FFFFFF");
        this.match1.setButtonHoverColor("#330c4c");
        this.match1.setButtonOnClick(() => this.displayCurrentPerson(this.parent.personArray[3]));

        this.displayPersonIcon(156, y+yOff*4+3, this.parent.personArray[4])
        this.match1 = Button(this, 156.5, y+yOff*4, "5", "16px");
        this.match1.setButtonColor("#FFFFFF");
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
            jock: Button(this, 180, 206, "Send Jock Message", "8px"),
            flirt: Button(this, 180, 214, "Send Flirty Message", "8px"),
            int: Button(this, 180, 222, "Send Intelligent Message", "8px"),
            hum: Button(this, 180, 230, "Send Funny Message", "8px"),
            sinc: Button(this, 180, 238, "Send Sincere Message", "8px"),
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
        let messages = messageText; //from utils/MessageText.js
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