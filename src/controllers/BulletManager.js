import Phaser from "phaser";

const Vector2 = Phaser.Math.Vector2;

export default class BulletManager {
    constructor(numBullets, scene, sprite, group, collisionData, bulletTimeAlive){
        // Init instance vars
        this.maxNumBullets = numBullets;
        this.scene = scene;
        this.sprite = sprite;
        this.group = group;
        this.collisionData = collisionData;

        // Init bullet data
        this.bulletTimeAlive = bulletTimeAlive;

        this.deadBullets = [];
        this.initBullets();
        this.setUpBulletCollisions();
    }

    initBullets(){
        let bullet;
        for(let i = 0; i < this.maxNumBullets; i++){
            // Create bullet
            bullet = this.scene.physics.add.sprite(0, 0, this.sprite);

            bullet.timesFired = 0;

            // Initially set to dead
            bullet.isAlive = false;

            // Add to physics group
            this.group.add(bullet);

            // Hide Bullet
            bullet.disableBody(true, true);

            // Add to dead bullet list
            this.deadBullets.push(bullet);
        }
    }

    setCollisionData(collisionData){
        this.collisionData = collisionData;
        this.setUpBulletCollisions();
    }

    setUpBulletCollisions(){
        // Set up collisions with any of the input collision data
        for(let i = 0; i < this.collisionData.length; i++){
            this.scene.physics.add.overlap(
                this.collisionData[i].otherGroup,
                this.group,
                (obj1, obj2) => {
                    this.collisionData[i].callback(obj1, obj2);
                    this.killBullet(obj2);
                },
                null,
                this);
        }
    }

    requestBullet(xPos, yPos, xDir, yDir, bulletSpeed, damage){
        // Bring a bullet to life
        let bullet = this.deadBullets.pop();
        bullet.isAlive = true;
        bullet.timesFired++;
        let currentTimesFired = bullet.timesFired;

        // Enable bullet
        bullet.enableBody(true, xPos, yPos, true, true);

        // Set bullet damage
        bullet.damage = damage;

        // Send bullet with speed in direction
        bullet.setVelocity(xDir*bulletSpeed, yDir*bulletSpeed);

        // Set bullet animation
        bullet.anims.play("blue", true);

        // Set up bullet death after delay
        this.scene.time.delayedCall(
            this.bulletTimeAlive,
            () => {
                // If the bullet hasn't been refired
                if(currentTimesFired === bullet.timesFired){
                    this.killBullet(bullet);
                }
            }
        );
    }

    killBullet(bullet){
        bullet.isAlive = false;
        bullet.disableBody(true, true);
        this.deadBullets.push(bullet);
    }

}