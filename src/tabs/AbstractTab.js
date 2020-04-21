import Phaser, {} from "phaser"

export default class AbstractTab extends Phaser.Scene{
    constructor(key){
        super({
            key: key
        });
        this.textFields = [];
    }

    init(data){
        this.parent = data.parent;
        this.events.on("sleep", () => this.hideTextFields());
        this.events.on("wake", () => this.showTextFields());
        this.events.on("shutdown", () => this.removeTextFields());
    }
    
    hideTextFields(){
        for(let i = 0; i < this.textFields.length; i++){
            this.textFields[i].style.visibility = "hidden";
            this.textFields[i].blur();
        }
    }

    showTextFields(){
        for(let i = 0; i < this.textFields.length; i++){
            this.textFields[i].style.visibility = "visible";
        }
    }

    removeTextFields(){
        for(let i = 0; i < this.textFields.length; i++){
            this.textFields[i].remove();
        }
        this.textFields = [];
    }
}