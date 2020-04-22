import Phaser, {} from "phaser"
import AbstractTab from "./AbstractTab"
import Person from "../Person"

export default class Matches extends AbstractTab{
    constructor(){
        super("Matches");
        this.person = new Person();
    }

    preload(){
        console.log("Matches");
    }

    create(){
        let home = this.add.image(0, 0, "matches");
        home.setOrigin(0, 0);

        let name = this.person.getName();
        let nameText = this.add.text(61, 130, name, {fill: "#FFFFFF", fontFamily: "NoPixel", fontSize: "8px"});
        nameText.setOrigin(0.5, 0.5);

        let appearance = this.person.getAppearance();
        let preferences = this.person.getPreferences();

        for(let i in appearance){
            this.add.image(61, 88, appearance[i]);
        }

        //just printing preferences
        //todo: generate bio based on preferences
        this.add.text(60, 140, "preferences:", {fill: "#431c5c", fontFamily: "NoPixel", fontSize: "8px"});

        let y = 150;
        for(let key in preferences){
            this.add.text(60, y, key + ": " + preferences[key], {fill: "#431c5c", fontFamily: "NoPixel", fontSize: "8px"});
            y = y + 10;
        }

    }
}