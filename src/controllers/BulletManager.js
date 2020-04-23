import Phaser from "phaser";

const Vector2 = Phaser.Math.Vector2;

export default class BulletManager {
    constructor(){
        this.maxNumBullets = 1000;
        this.bullets = new Array(this.maxNumBullets);
        this.deadBullets = [];
        this.initBullets();
    }

    update(){
        let bullet;
        let justDied;
        for(let i = 0; i < this.bullets.length; i++){
            bullet = this.bullets[i];
            if(bullet.isAlive()){
                justDied = bullet.update();

                if(justDied){
                    this.deadBullets.push(bullet);
                }
            }
        }
    }

    initBullets(){
        let bullet;
        for(let i = 0; i < this.maxNumBullets; i++){
            bullet = new Bullet();
            this.bullets[i] = bullet;
            this.deadBullets.push(bullet);
        }
    }

    addNewBullet(xPos, yPos, xDir, yDir, bulletOwner){
        let bullet = this.deadBullets.pop();
        bullet.create(xPos, yPos, xDir, yDir, bulletOwner);
    }
}

export const BulletOwner = {
    PLAYER: 0,
    ENEMY: 1
}

const Speeds = [
    5,
    5
]

const DeathTimes = [
    2000,
    2000
]

class Bullet{
    constructor(){
        this.alive = false;
        this.owner = null;
        this.position = new Vector2();
        this.direction = new Vector2();
        this.speed = 0;
        this.timeAlive = 0;
        this.deathTime = 0;
    }

    isAlive(){
        return this.alive;
    }

    create(xPos, yPos, xDir, yDir, bulletOwner){
        this.alive = true;
        this.owner = bulletOwner;
        this.position.set(xPos, yPos);
        this.direction.set(xDir, yDir);
        this.speed = Speeds[bulletOwner];
        this.timeAlive = 0;
        this.deathTime = DeathTimes[bulletOwner];
    }

    update(deltaTime){
        this.position.add(this.direction.x * this.speed, this.direction.y * this.speed);
        this.timeAlive += deltaTime;
        if(this.timeAlive >= deathTime){
            // Kill the bullet
            this.alive = false;
            return false; // Bullet is dead
        }
        return true;    // Bullet is alive
    }
}