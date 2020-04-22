export default class Player {
    constructor(){
        this.stats = {jock : 10, flirt: 10, hum: 10, int: 10, sinc: 10};
        this.skills = [];
        this.name="";
    }; 

    incrementStat(statType, step){
        if (statType=="jock"){this.stats.jock+=step; if(this.stats.jock <= 0){this.stats.jock=0;}}
        else if (statType=="flirt"){this.stats.flirt+=step; if(this.stats.flirt <= 0){this.stats.flirt=0;}}
        else if (statType=="hum"){this.stats.hum+=step; if(this.stats.hum <= 0){this.stats.hum=0;}}
        else if (statType=="int"){this.stats.int+=step; if(this.stats.int <= 0){this.stats.int=0;}}
        else if (statType=="hum"){this.stats.sinc+=step; if(this.stats.sinc <= 0){this.stats.sinc=0;}}
    }

    getPlayerStats(){
        return this.stats;
    }

    setName(playerName){
        this.name=playerName;
    }
}