import Phaser from "phaser";
import Person from "./Person"

const Vector2 = Phaser.Math.Vector2;

export default class Player {
    constructor(){
        this.stats = {jock : 10, flirt: 10, hum: 10, int: 10, sinc: 10};
        this.skills = [];
        this.name="";
        this.bio = "";
        this.day = 0;
        this.skillPoints = 1;
        this.matches = [];
        this.way = "_front";
    }; 

    incrementStat(statType, step){
        if (statType=="jock"){this.stats.jock+=step; if(this.stats.jock <= 0){this.stats.jock=0;}}
        else if (statType=="flirt"){this.stats.flirt+=step; if(this.stats.flirt <= 0){this.stats.flirt=0;}}
        else if (statType=="hum"){this.stats.hum+=step; if(this.stats.hum <= 0){this.stats.hum=0;}}
        else if (statType=="int"){this.stats.int+=step; if(this.stats.int <= 0){this.stats.int=0;}}
        else if (statType=="sinc"){this.stats.sinc+=step; if(this.stats.sinc <= 0){this.stats.sinc=0;}}
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

    getWay(){
        return this.way;
    }

    setWay(way){
        this.way = way;
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
        this.bulletCoolDown = 300 - this.stats.int;
        this.bulletSpeed = 500 + (this.bulletSpeedBoost ? this.bulletSpeedBoost : 0);

        this.speed = 150 + this.stats.hum + (this.speedBoost ? this.speedBoost : 0);
        this.maxHealth = 1600 + 5*this.stats.sinc + (this.healthBoost ? this.healthBoost : 0);
        this.health = 1600 + 5*this.stats.sinc + (this.healthBoost ? this.healthBoost : 0);
        this.damage = 50 + this.stats.jock + (this.damageBoost ? this.damageBoost : 0);

        this.playerSprite = this.scene.physics.add.sprite(0, 0, "bhPlayer");
        this.playerSprite.setCollideWorldBounds(true);
        this.playerSprite.anims.play('player_idle', true);

        this.stunnedUntil = null;
        this.invincibleUntil = null;

        this.bulletSpeedBoost = 0;
        this.speedBoost = 0;
        this.damageBoost = 0;
        this.healthBoost = 0;
    }

    initEndlessBulletHell(scene, bulletManager){
        this.scene = scene;
        this.bulletManager = bulletManager;

        this.lastBulletFired = -1000;
        this.bulletCoolDown = 250;
        this.bulletSpeed = 500;

        this.speed = 160;
        this.maxHealth = 1600;
        this.health = 1600;
        this.damage = 75;

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

        if(this.stunnedUntil === null){
            this.stunnedUntil = this.scene.time.now - 1;
        }

        if(this.stunnedUntil < this.scene.time.now){
            this.playerSprite.setVelocity(x * this.speed, y * this.speed);
        }

        if(this.directionX !== 0){
            if(this.directionY === 0){
                this.dir = this.directionX === 1 ? "d" : "a";
            }
            // Otherwise leave it as the most recently set direction
        } else {
            if(this.directionY !== 0){
                this.dir = this.directionY === 1 ? "s" : "w";
            }
        }

        if(this.dir == "w"){
            this.way = "_back";
        }
        else if(this.dir == "a"){
            this.way = "";
            this.playerSprite.flipX = true;
        }
        else if(this.dir == "s"){
            this.way = "_front";
        }
        else if(this.dir == "d"){
            this.way = "";
            this.playerSprite.flipX = false;
        }

        // else {
        //     if(this.directionX > 0){
        //         this.playerSprite.flipX = false;
        //         this.playerSprite.anims.play('player_walk', true);
        //     } else {
        //         this.playerSprite.flipX = true;
        //         this.playerSprite.anims.play('player_walk', true);
        //     }
        // }
    }

    getDirection(){
        return new Vector2(this.directionX, this.directionY);
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
                this.bulletManager.requestBullet(playerCenter.x, playerCenter.y, newBulletDirection.x, newBulletDirection.y, this.bulletSpeed, this.damage, "heart");
                newBulletDirection.setToPolar(angle - Math.PI/12, 1);
                this.bulletManager.requestBullet(playerCenter.x, playerCenter.y, newBulletDirection.x, newBulletDirection.y, this.bulletSpeed, this.damage, "heart");
            }
            else{
                this.bulletManager.requestBullet(playerCenter.x, playerCenter.y, bulletDirection.x, bulletDirection.y, this.bulletSpeed, this.damage, "heart");
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
        playerObj.matches = this.matches;

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
            this.matches = [];
            for(let i = 0; i < playerObj.matches.length; i++){
                this.matches.push(Person.parsePerson(playerObj.matches[i]));
            }
            return true;
        }
        return false;
    }
}