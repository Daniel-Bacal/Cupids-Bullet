import { randIntFrom } from "../utils/MathUtils"
import NameGenerator from "../utils/NameGenerator";
import Phaser from "phaser";

export default class Person {

    constructor(){
        this.preferences = {jock : -1, flirt: -1, hum: -1, int: -1, sinc: -1};
        this.name = "";
        this.appearance = ["", "", "", "", "", ""];
        this.gender = 0;
        this.bio = "";
        this.nameGenerator = new NameGenerator();
        this.generateRandomPerson();
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

    generateRandomPerson(){
        this.gender = randIntFrom(0, 2);
        this.generateRandomName();
        this.generateRandomPreferences();
        this.generateRandomAppearance();
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
        //todo
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