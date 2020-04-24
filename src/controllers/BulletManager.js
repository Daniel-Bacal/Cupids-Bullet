import Phaser from "phaser";

const Vector2 = Phaser.Math.Vector2;

export default class BulletManager {
    constructor(numBullets, scene, sprite, group, collisionData, bulletSpeed, bulletTimeAlive){
        /*
            collisionData = [
                {otherGroup}
            ]
        */
        this.maxNumBullets = numBullets;
        this.scene = scene;
        this.sprite = sprite;
        this.group = group;
        this.collisionData = collisionData;

        this.bulletSpeed = bulletSpeed;
        this.bulletTimeAlive = bulletTimeAlive;

        this.deadBullets = [];
        this.initBullets();
        this.setUpBulletCollisions();
    }

    // update(){
    //     let bullet;
    //     for(let i = 0; i < this.bullets.length; i++){
    //         bullet = this.bullets[i];
    //         if(bullet.isAlive){
    //             justDied = bullet.update();

    //             if(justDied){
    //                 this.deadBullets.push(bullet);
    //             }
    //         }
    //     }
    // }

    initBullets(){
        let bullet;
        for(let i = 0; i < this.maxNumBullets; i++){
            bullet = this.scene.physics.add.sprite(0, 0, this.sprite);
            bullet.isAlive = false;

            // Add to physics group
            this.group.add(bullet);

            // Hide Bullet
            bullet.disableBody(true, true);

            // Add to dead bullet list
            this.deadBullets.push(bullet);
        }
    }

    setUpBulletCollisions(){
        for(let i = 0; i < this.collisionData.length; i++){
            this.scene.physics.add.overlap(
                this.collisionData[i].otherGroup,
                this.group,
                () => {
                    this.collisionData[i].callback
                    this.killBullet();
                },
                null,
                this);
        }
    }

    requestBullet(xPos, yPos, xDir, yDir){
        let bullet = this.deadBullets.pop();
        bullet.isAlive = true;

        // Enable bullet
        bullet.enableBody(true, xPos, yPos, true, true);

        // Send bullet with speed in direction
        bullet.setVelocity(xDir*this.bulletSpeed, yDir*this.bulletSpeed);

        // Set bullet animation
        bullet.anims.play("blue", true);

        // Set up bullet death after delay
        this.scene.time.delayedCall(
            this.bulletTimeAlive,
            () => this.killBullet(bullet)
        );
    }

    killBullet(bullet){
        bullet.isAlive - false;
        bullet.disableBody(true, true);
        this.deadBullets.push(bullet);
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
        this.direction = new Vector2();
        this.speed = 0;
        this.timeAlive = 0;
        this.deathTime = 0;
    }

    isAlive(){
        return this.alive;
    }

    create(xDir, yDir, speed, deathTime){
        this.alive = true;
        this.direction.set(xDir, yDir);
        this.speed = speed;
        this.timeAlive = 0;
        this.deathTime = deathTime;
    }

    update(deltaTime){
        this.timeAlive += deltaTime;
        if(this.timeAlive >= deathTime){
            // Kill the bullet
            this.alive = false;
            return false; // Bullet is dead
        }
        return true;    // Bullet is alive
    }
}