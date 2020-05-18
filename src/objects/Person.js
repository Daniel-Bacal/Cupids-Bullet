import { randIntFrom, randomFrom } from "../utils/MathUtils";
import NameGenerator from "../utils/NameGenerator";
import BioGenerator from "../utils/BioGenerator";
import Phaser from "phaser";

export default class Person {

    constructor(gender){
        this.preferences = {jock : -1, flirt: -1, hum: -1, int: -1, sinc: -1};
        this.gender;
        this.name = "";
        this.appearance = ["", "", "", "", "", ""];
        this.bio = "";
        this.nameGenerator = new NameGenerator();
        this.bioGenerator = new BioGenerator();
        this.relationshipMeter = 0;
        this.messagesRecieved = {jock : 0, flirt: 0, hum: 0, int: 0, sinc: 0};
        this.nextMessageTime = Infinity;
        this.awaitingMessage = true;
        this.notRead = false;
        this.messageHistory = [];
        this.generateRandomPerson(gender);
    }

    getName(){
        return this.name;
    }

    getPreferences(){
        return this.preferences;
    }

    getAppearance(){
        return this.appearance;
    }

    getBio(){
        return this.bio;
    }

    isAwaitingMessage(){
        return this.awaitingMessage;
    }

    setAwaitingMessage(flag){
        this.awaitingMessage = flag;
    }

    sendMessage(message, type, time){
        // Add to history
        this.messageHistory.push({text: message, sender: "player", type: type});

        // Set message cooldown
        this.nextMessageTime = time + Math.floor(Math.random()*10000 + 5000 - 45*this.relationshipMeter);

        this.awaitingMessage = false;
    }

    getLastPlayerMessage(){
        return this.messageHistory[this.messageHistory.length - 2];
    }

    incrementRelationshipMeter(inc){
        this.relationshipMeter += inc;
        this.relationshipMeter = Phaser.Math.Clamp(this.relationshipMeter, 0, 100);
    }

    likesMessage(type){
        return this.preferences[type];
    }

    messagePlayer(){
        let lastMessage = this.messageHistory[this.messageHistory.length - 1];
        let type = lastMessage.type;

        // Increment relationship meter
        this.relationshipMeter += this.likesMessage(type)*Math.floor(Math.random()*4 + 1) + (this.likesMessage(type) === 0 ? Math.floor(Math.random()*2) : 0);
        // Every other message type grows less stale
        for(let key in this.messagesRecieved){
            this.messagesRecieved[key] -= 1;
        }
        this.messagesRecieved[type] += 2;

        // Messages grow stale - be diverse
        this.relationshipMeter -= 3*Math.floor(this.messagesRecieved[type]/5);

        // Restrict relationship meter to 0 and 100
        this.relationshipMeter = Phaser.Math.Clamp(this.relationshipMeter, 0, 100);

        let responses = [["´","¹","µ"],["¶","º"],["·","²","¯"]];
        let response = randomFrom(responses[this.likesMessage(lastMessage.type) + 1]);
        this.messageHistory.push({text: response, sender: "person", type: ""});
        this.awaitingMessage = true;
        this.notRead = true;
    }

    getMessageHistory(){
        return this.messageHistory;
    }

    readMessage(){
        this.notRead = false;
    }

    generateRandomPerson(gender){
        if(gender == "sm"){
            this.gender = 0;
        } else if(gender == "sf"){
            this.gender = 1;
        } else{
            this.gender = randIntFrom(0, 2);
        }

        this.generateRandomName();
        this.generateRandomPreferences();
        this.generateRandomAppearance();
        this.generateBio();
        this.relationshipMeter = Math.floor(Math.random()*20 + 20);
    }

    generateRandomName(){
        this.name = this.nameGenerator.generateName();
    }

    generateRandomPreferences(){
        let preferences = {jock : -1, flirt: -1, hum: -1, int: -1, sinc: -1};
        for(let key in preferences){
            this.preferences[key] = this.preferences[key] + randIntFrom(0, 3);
        }
    }

    generateRandomAppearance(){
        let genderText = "";
        if(this.gender == 0){
            genderText = "m";
        }else{
            genderText = "f";
        }

        this.appearance[0] = "background" + randIntFrom(1, 6);
        this.appearance[1] = genderText + "Body" + randIntFrom(1, 6);
        this.appearance[2] = genderText + "Feature" + randIntFrom(1, 6);
        this.appearance[3] = genderText + "Clothes" + randIntFrom(1, 4) + randIntFrom(1, 4);
        this.appearance[4] = genderText + "Eyes" + randIntFrom(1, 4) + randIntFrom(1, 4);
        this.appearance[5] = genderText + "Hair" + randIntFrom(1, 4) + randIntFrom(1, 4);
    }

    generateBio(){
        this.bioGenerator.setPreferences(this.preferences);
        this.bio = this.bioGenerator.generateBio();

    }

    static parsePerson(personObj){
        let p = new Person("sm");
        p.gender = personObj.gender;
        p.preferences = personObj.preferences;
        p.name = personObj.name;
        p.appearance = personObj.appearance;
        p.bio = personObj.bio;
        p.gender = personObj.gender;
        p.relationshipMeter = personObj.relationshipMeter;
        return p;
    }

    saveToSession(){
        let personObj = {};
        personObj.preferences = this.preferences;
        personObj.name = this.name;
        personObj.appearance = this.appearance;
        personObj.bio = this.bio;
        personObj.gender = this.gender;

        let current_person = JSON.stringify(personObj);
        window.sessionStorage.setItem("current_person", current_person);

        this.saveToLocalStorage();
    }

    loadFromSession(){
        let current_person = window.sessionStorage.getItem("current_person");
        if(current_person){
            let personObj = JSON.parse(current_person);
            this.preferences = personObj.preferences;
            this.name = personObj.name;
            this.appearance = personObj.appearance;
            this.bio = personObj.bio;
            this.gender = personObj.gender;
            return true;
        }
        return false;
    }
}