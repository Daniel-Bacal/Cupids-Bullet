import { randIntFrom } from "../utils/MathUtils"
import NameGenerator from "../utils/NameGenerator";
import Phaser from "phaser";

export default class Person {

    constructor(){
        this.preferences = {jock : -1, flirt: -1, hum: -1, int: -1, sinc: -1};
        this.name = "";
        this.appearance = ["", "", "", "", "", ""];
        this.match = 0;
        this.gender = 0;
        this.bio = "";
        this.nameGenerator = new NameGenerator();
        this.generateRandomPerson();
    }

    setGender(gender){
        this.gender = gender;
    }
    getGender(){
        return this.gender;
    }

    setMatch(bool){
        this.match = bool;
    }
    getMatch(){
        return this.match;
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
}