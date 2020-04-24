import Phaser from "phaser";

const Vector2 = Phaser.Math.Vector2;

export default class Player {
    constructor(){
        this.stats = {jock : 10, flirt: 10, hum: 10, int: 10, sinc: 10};
        this.skills = [];
        this.name="";
        this.speed = 200;
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

    getName(){
        return this.name;
    }

    initBulletHell(scene, bulletManager){
        this.scene = scene;
        this.bulletManager = bulletManager;

        this.lastBulletFired = -1000;
        this.bulletCoolDown = 200;

        this.playerSprite = this.scene.physics.add.sprite(0, 0, "bhPlayer");
        this.playerSprite.setCollideWorldBounds(true);
    }

    getSprite(){
        return this.playerSprite;
    }

    getCenter(){
        return this.playerSprite.getCenter();
    }

    setDirection(x, y){
        this.directionX = x;
        this.directionY = y;
        this.playerSprite.setVelocity(x * this.speed, y * this.speed);
    }

    getDirection(){
        return new Vector2(x, y);
    }
    
    fireBullet(clickX, clickY, mouseDown, currentTime){
        if(mouseDown && currentTime - this.lastBulletFired > this.bulletCoolDown){
            this.lastBulletFired = currentTime;
            
            let playerCenter = this.getCenter();
      
            //get normalized direction vecotr from player center to mouse click for bullet to travel
            let bulletDirection = new Vector2(clickX-playerCenter.x, clickY-playerCenter.y);
      
            bulletDirection.normalize();
      
            //bullet renders as a green square atm.
            this.bulletManager.requestBullet(playerCenter.x, playerCenter.y, bulletDirection.x, bulletDirection.y);
          }
    }

}