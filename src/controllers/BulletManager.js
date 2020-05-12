import Phaser from "phaser";

const Vector2 = Phaser.Math.Vector2;

export default class BulletManager {
    constructor(numBullets, scene, sprite, group, collisionData, bulletTimeAlive, bulletScale, bulletHealth = 1){
        // Init instance vars  
        this.maxNumBullets = numBullets;
        this.scene = scene;
        this.sprite = sprite;
        this.group = group;
        this.collisionData = collisionData;
        this.bulletScale = bulletScale;
        this.bulletHealth = bulletHealth;
        console.log(this.bulletHealth);

        // Init bullet data
        this.bulletTimeAlive = bulletTimeAlive;
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
                    if(obj1.isDying) return;
                    if (obj1 != obj2.lastCollision){
                        this.collisionData[i].callback(obj1, obj2);
                        obj2.lastCollision = obj1;
                        obj2.health--;
                        if (obj2.health <= 0){
                            this.killBullet(obj2); 
                        }
                    }
                },
                null,
                this);
        }
    }

    requestBullet(xPos, yPos, xDir, yDir, bulletSpeed, damage, animKey){
        // Bring a bullet to life
        let bullet = this.scene.physics.add.sprite(0, 0, this.sprite);
        if (this.bulletScale){
            bullet.setScale(this.bulletScale, this.bulletScale);
        }

        bullet.health = this.bulletHealth;

        bullet.timesFired = 0;

        // Add to physics group
        this.group.add(bullet);

        bullet.lastCollision = null;
        bullet.health = this.bulletHealth;
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
        bullet.anims.play(animKey, true);

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
        bullet.destroy();
    }

}