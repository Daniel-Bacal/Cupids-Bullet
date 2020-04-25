import Phaser, {} from "phaser"
import AbstractTab from "./AbstractTab"
import Person from "../objects/Person"
import Button from "../ui_elements/Button"

export default class Matches extends AbstractTab{
    constructor(){
        super("Matches");
        this.personArray = [new Person(), new Person(), new Person(), new Person(), new Person()];
        this.currentPerson;
    }

    preload(){
        console.log("Matches");
    }

    create(){
        let home = this.add.image(0, 0, "matches");
        home.setOrigin(0, 0);

        this.initMatchButtons();

        this.personText = this.add.text(61, 130, "", {fill: "#FFFFFF", fontFamily: "NoPixel", fontSize: "8px"});
        this.personText.setOrigin(0.5, 0.5);

        this.preferences = []
        let y = 150;
        for(let i = 0; i <= 5; i++){
            this.preferences.push(this.add.text(60, y, "", {fill: "#431c5c", fontFamily: "NoPixel", fontSize: "8px"}));
            y = y + 10;
        }

        this.currentPerson = this.personArray[0];
        this.displayCurrentPerson(this.currentPerson);
    }

    displayCurrentPerson(person){
        let name = person.getName();
        this.personText.setText(name);

        this.appearance = person.getAppearance();
        this.preferenceText = person.getPreferences();

        this.add.text(60, 140, "preferences:", {fill: "#431c5c", fontFamily: "NoPixel", fontSize: "8px"});

        let i = 0;
        for(let key in this.preferenceText){
            this.preferences[i++].text = key + ": " + this.preferenceText[key];
        }

        for(let i in this.appearance){
            this.add.image(61, 88, this.appearance[i]);
        }
    }

    initMatchButtons(){
        this.match1 = Button(this, 120, 140, "1", "8px");
        this.match1.setButtonColor("black");
        this.match1.setButtonHoverColor("#DDDDDD");
        this.match1.setButtonOnClick(() => this.displayCurrentPerson(this.personArray[0]));

        this.match1 = Button(this, 120, 160, "2", "8px");
        this.match1.setButtonColor("black");
        this.match1.setButtonHoverColor("#DDDDDD");
        this.match1.setButtonOnClick(() => this.displayCurrentPerson(this.personArray[1]));

        this.match1 = Button(this, 120, 180, "3", "8px");
        this.match1.setButtonColor("black");
        this.match1.setButtonHoverColor("#DDDDDD");
        this.match1.setButtonOnClick(() => this.displayCurrentPerson(this.personArray[2]));

        this.match1 = Button(this, 120, 200, "4", "8px");
        this.match1.setButtonColor("black");
        this.match1.setButtonHoverColor("#DDDDDD");
        this.match1.setButtonOnClick(() => this.displayCurrentPerson(this.personArray[3]));

        this.match1 = Button(this, 120, 220, "5", "8px");
        this.match1.setButtonColor("black");
        this.match1.setButtonHoverColor("#DDDDDD");
        this.match1.setButtonOnClick(() => this.displayCurrentPerson(this.personArray[4]));
    }
}