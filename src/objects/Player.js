import Phaser from "phaser";

const Vector2 = Phaser.Math.Vector2;

export default class Player {
    constructor(){
        this.stats = {jock : 10, flirt: 10, hum: 10, int: 10, sinc: 10};
        this.skills = ["sb", "sb2","sb22"];
        this.name="";
        this.bio = "";
        this.day = 0;
        this.skillPoints = 1;
    }; 

    incrementStat(statType, step){
        if (statType=="jock"){this.stats.jock+=step; if(this.stats.jock <= 0){this.stats.jock=0;}}
        else if (statType=="flirt"){this.stats.flirt+=step; if(this.stats.flirt <= 0){this.stats.flirt=0;}}
        else if (statType=="hum"){this.stats.hum+=step; if(this.stats.hum <= 0){this.stats.hum=0;}}
        else if (statType=="int"){this.stats.int+=step; if(this.stats.int <= 0){this.stats.int=0;}}
        else if (statType=="hum"){this.stats.sinc+=step; if(this.stats.sinc <= 0){this.stats.sinc=0;}}
    }

    setPlayerStats(jock, flirt, hum, int, sinc){
        this.stats.jock = jock;
        this.stats.flirt = flirt;
        this.stats.hum = hum;
        this.stats.int = int;
        this.stats.sinc = sinc;
    }

    getPlayerSkills(){
        return this.skills;
    }

    incrementDay(){
        this.day++;
    }

    getDay(){
        return this.day;
    }

    setDay(day){
        this.day = day;
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

    setBio(bio){
        this.bio = bio;
    }

    getBio(){
        return this.bio;
    }

    initBulletHell(scene, bulletManager){
        this.scene = scene;
        this.bulletManager = bulletManager;

        this.lastBulletFired = -1000;
        this.bulletCoolDown = 300 - this.stats.hum;
        this.bulletSpeed = 500;

        this.speed = 150 + this.stats.hum;
        this.maxHealth = 1600 + this.stats.sinc;
        this.health = 1600 + this.stats.sinc;
        this.damage = 50 + this.stats.jock;

        this.playerSprite = this.scene.physics.add.sprite(0, 0, "bhPlayer");
        this.playerSprite.setCollideWorldBounds(true);
        this.playerSprite.anims.play('player_walk', true);
    }

    getHealthPercent(){
        return this.health/this.maxHealth;
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

        if(this.directionX === 0 && this.directionY === 0){
            this.playerSprite.anims.play('player_idle', true);
        } else {
            if(this.directionX > 0){
                this.playerSprite.flipX = false;
                this.playerSprite.anims.play('player_walk', true);
            } else {
                this.playerSprite.flipX = true;
                this.playerSprite.anims.play('player_walk', true);
            }
        }
    }

    getDirection(){
        return new Vector2(x, y);
    }
    
    fireBullet(clickX, clickY, mouseDown, currentTime, doubleBullet = false){
        if(mouseDown && currentTime - this.lastBulletFired > this.bulletCoolDown){
            this.lastBulletFired = currentTime;
            
            let playerCenter = this.getCenter();
      
            //get normalized direction vecotr from player center to mouse click for bullet to travel
            let bulletDirection = new Vector2(clickX-playerCenter.x, clickY-playerCenter.y);
      
            bulletDirection.normalize();

            if (doubleBullet){
                let newBulletDirection = new Vector2(bulletDirection.x, bulletDirection.y);
                let angle = Math.atan2(bulletDirection.y, bulletDirection.x);
                newBulletDirection.setToPolar(angle + Math.PI/12, 1);
                this.bulletManager.requestBullet(playerCenter.x, playerCenter.y, newBulletDirection.x, newBulletDirection.y, this.bulletSpeed, this.damage);
                newBulletDirection.setToPolar(angle - Math.PI/12, 1);
                this.bulletManager.requestBullet(playerCenter.x, playerCenter.y, newBulletDirection.x, newBulletDirection.y, this.bulletSpeed, this.damage);
            }
            else{
                this.bulletManager.requestBullet(playerCenter.x, playerCenter.y, bulletDirection.x, bulletDirection.y, this.bulletSpeed, this.damage);
            }
          }
    }

    saveToSession(){
        let playerObj = {};
        playerObj.stats = this.stats;
        playerObj.skills = this.skills;
        playerObj.name = this.name;
        playerObj.bio = this.bio;
        playerObj.day = this.day;
        playerObj.skillPoints = this.skillPoints

        let current_player = JSON.stringify(playerObj);
        window.sessionStorage.setItem("current_player", current_player);
        
        // Save player file
        this.saveToLocalStorage();
    }

    loadFromSession(){
        let current_player = window.sessionStorage.getItem("current_player");
        if(current_player){
            let playerObj = JSON.parse(current_player);
            this.stats = playerObj.stats;
            this.skills = playerObj.skills;
            this.name = playerObj.name;
            this.bio = playerObj.bio;
            this.day = playerObj.day;
            this.skillPoints = playerObj.skillPoints;
            return true;
        }
        return false;
    }

    saveToLocalStorage(){
        let playerObj = {};
        playerObj.stats = this.stats;
        playerObj.skills = this.skills;
        playerObj.name = this.name;
        playerObj.bio = this.bio;
        playerObj.day = this.day;
        playerObj.skillPoints = this.skillPoints

        let current_player = JSON.stringify(playerObj);
        window.localStorage.setItem(playerObj.name, current_player);
    }

    loadFromLocalStorage(username){
        let current_player = window.localStorage.getItem(username);
        if(current_player){
            let playerObj = JSON.parse(current_player);
            this.stats = playerObj.stats;
            this.skills = playerObj.skills;
            this.name = playerObj.name;
            this.bio = playerObj.bio;
            this.day = playerObj.day;
            this.skillPoints = playerObj.skillPoints;
            return true;
        }
        return false;
    }
}