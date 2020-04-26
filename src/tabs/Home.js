import Phaser, {} from "phaser"
import AbstractTab from "./AbstractTab"
import Player from "../objects/Player"
import { SkillText }  from "../utils/SkillText"

export default class Home extends AbstractTab{
    constructor(){
        super("Home");
    }

    preload(){
        console.log("Home");
    }

    create(){
        let home = this.add.image(0, 0, "home");
        home.setOrigin(0, 0);

        this.add.image(61, 88, "player");

        let name = this.parent.player.getName();
        this.add.text(20, 140, name, {fill: "#431c5c", fontFamily: "NoPixel", fontSize: "24px"});

        this.add.text(115, 45, "skills", {fill: "#431c5c", fontFamily: "NoPixel", fontSize: "24px"});

        this.add.text(250, 45, "stats", {fill: "#431c5c", fontFamily: "NoPixel", fontSize: "24px"});

        this.generateStats();

        this.generateSkills();

        this.generateBio();

        let bio = this.parent.player.getBio()
        let bioText = this.add.text(170, 200, bio, {fill: "#431c5c", fontFamily: "NoPixel", fontSize: "16px", align: "center", wordWrap: { width: 320, useAdvancedWrap: true }});
        bioText.setOrigin(0.5, 0.5);

    }

    generateStats(){
        let stats = this.parent.player.getPlayerStats();
        let y = 70;
        for(let key in stats){
            let statText = key + ": " + stats[key];
            this.add.text(250, y, statText, {fill: "#431c5c", fontFamily: "NoPixel", fontSize: "16px"});
            y = y + 15;
        }
    }

    generateSkills(){
        let skills = this.parent.player.getPlayerSkills();
        console.log(skills);
        let y = 90;
        for(let i = 0; i < skills.length; i++){
            this.add.image(130, y, skills[i]);
            this.add.text(150, y, SkillText[skills[i]].effect, {fill: "#431c5c", fontFamily: "NoPixel", fontSize: "8px"}).setOrigin(0, 0.5);
            y = y + 30;
        }
    }

    generateBio(){
        //todo, generate bio based on sign-up questions
    }

}