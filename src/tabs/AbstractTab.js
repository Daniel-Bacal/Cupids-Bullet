import Phaser, {} from "phaser"

export default class AbstractTab extends Phaser.Scene{
    constructor(key){
        super({
            key: key
        });
    }

    init(data){
        this.parent = data.parent;
    }
    
}