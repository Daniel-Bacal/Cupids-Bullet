import { randIntFrom, randomFrom } from "./MathUtils";
import {bioText, schoolText, employeeText} from "./BioText";

export default class BioGenerator {
    constructor(){

        this.preferences;

    }

    setPreferences(preferences){
        this.preferences = preferences;
    }

    generateBio(){
        let generatedBioText = "";

        let studentOrEmployee = randIntFrom(0,2);
        if (studentOrEmployee === 0){
            generatedBioText += randomFrom(schoolText["major"]) + " major at " + randomFrom(schoolText["school"]) + ".\n";
        }
        else if (studentOrEmployee === 1){
            generatedBioText += randomFrom(employeeText["job"]) + " at " + randomFrom(employeeText["company"]) + ".\n";
        }

        if (this.preferences.jock === 1){
            generatedBioText += randomFrom(bioText["proJock"]);
            generatedBioText += " ";
        }
        else if (this.preferences.jock === -1){
            generatedBioText += randomFrom(bioText["antiJock"]);
            generatedBioText += " ";
        }
        if (this.preferences.flirt === 1){
            generatedBioText += randomFrom(bioText["proFlirt"]);
            generatedBioText += " ";
        }
        else if (this.preferences.flirt === -1){
            generatedBioText += randomFrom(bioText["antiFlirt"]);
            generatedBioText += " ";
        }
        if (this.preferences.hum === 1){
            generatedBioText += randomFrom(bioText["proHumor"]);
            generatedBioText += " ";
        }
        else if (this.preferences.hum === -1){
            generatedBioText += randomFrom(bioText["antiHumor"]);
            generatedBioText += " ";
        }
        if (this.preferences.int === 1){
            generatedBioText += randomFrom(bioText["proInt"]);
            generatedBioText += " ";
        }
        else if (this.preferences.int === -1){
            generatedBioText += randomFrom(bioText["antiInt"]);
            generatedBioText += " ";
        }
        if (this.preferences.sinc === 1){
            generatedBioText += randomFrom(bioText["proSinc"]);
            generatedBioText += " ";
        }
        else if (this.preferences.sinc === -1){
            generatedBioText += randomFrom(bioText["antiSinc"]);
            generatedBioText += " ";
        }

        console.log(generatedBioText);
        return generatedBioText;
    }
}