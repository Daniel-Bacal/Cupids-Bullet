export default class Player {
    constructor(){
        this.stats = {jock : 10, flirt: 10, hum: 10, int: 10, sinc: 10};
        this.skills = [];
        this.name="";
    }; 

    incrementStat(statType, step){
        if (statType=="jock"){this.stats.jock+=step;}
        else if (statType=="flirt"){this.stats.flirt+=step;}
        else if (statType=="hum"){this.stats.hum+=step;}
        else if (statType=="int"){this.stats.int+=step;}
        else if (statType=="hum"){this.stats.sinc+=step;}
    }

    getPlayerStats(){
        return this.stats;
    }

    setName(playerName){
        this.name=playerName;
    }
}