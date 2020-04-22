import Phaser, {} from "phaser"
import AbstractTab from "./AbstractTab"
import Player from "../Player"

export default class Home extends AbstractTab{
    constructor(){
        super("Home");
        this.player = new Player();
    }

    preload(){
        console.log("Home");
    }

    create(){
        let home = this.add.image(0, 0, "home");
        home.setOrigin(0, 0);

        this.add.image(61, 88, "player");

        //todo: get actual Person created in sign-up

        this.player.setName("CSE380 Student");

        let name = this.player.getName();
        this.add.text(20, 140, name, {fill: "#431c5c", fontFamily: "NoPixel", fontSize: "24px"});

        this.add.text(115, 45, "skills", {fill: "#431c5c", fontFamily: "NoPixel", fontSize: "24px"});

        this.add.text(250, 45, "stats", {fill: "#431c5c", fontFamily: "NoPixel", fontSize: "24px"});

        this.generateStats();

        this.generateBio();
    }

    generateStats(){
        let stats = this.player.getPlayerStats();
        let y = 70;
        for(let key in stats){
            let statText = key + ":" + stats[key];
            this.add.text(250, y, statText, {fill: "#431c5c", fontFamily: "NoPixel", fontSize: "16px"});
            y = y + 15;
        }
    }

    generateBio(){
        //todo, generate bio based on sign-up questions
    }

}