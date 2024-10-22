import Phaser from "phaser"
import Behavior from "./Behavior"

const Vector2 = Phaser.Math.Vector2;

export default class ExplodeOnPlayerBehavior extends Behavior{
    setUpEnemy(enemy){
        enemy.currentDirection = new Vector2();
        enemy.waitUntilTime = 0;
        enemy.bulletSpeed = 100;
    }

    behave(enemy){
        if(enemy.isDying){
            return;
        }

        if(this.player.isInvisible){
            if(!enemy.timeLeftMoving){
                enemy.timeLeftMoving = 0;
            }
            if(enemy.timeLeftMoving <= this.scene.time.now){
                // Get a new direction
                let direction = Math.random()*Math.PI*2;
                enemy.currentDirection = enemy.currentDirection.setToPolar(direction, 1);
                this.setEnemyVelocity(enemy, enemy.currentDirection.x*this.speed, enemy.currentDirection.y*this.speed);
                // Get a random time to stop moving
                enemy.timeLeftMoving = this.scene.time.now + Math.random()*100 + 200;
            }
            return
        }

        if (!enemy.stunDuration && !enemy.freezeDuration) {
            if(this.scene.time.now > enemy.waitUntilTime){
                let enemyPosition = enemy.getCenter();
                enemy.currentDirection = this.player.getCenter().clone().subtract(enemyPosition).normalize()
                let dist = enemyPosition.distance(this.player.getCenter());

                if(dist < 50){
                    enemy.waitUntilTime = this.scene.time.now + 1000;
                    this.setEnemyVelocity(enemy, 0, 0);
                    for(let i = 0; i < 8; i++){
                        enemy.currentDirection.setToPolar(i*Math.PI/4, 1);
                        enemy.bulletManager.requestBullet(enemyPosition.x, enemyPosition.y, enemy.currentDirection.x, enemy.currentDirection.y, enemy.bulletSpeed, enemy.damage, "red");
                    }
                } else {
                    let opp = new Vector2(enemy.currentDirection.y, -enemy.currentDirection.x);
                    let speed = 200 - Phaser.Math.Clamp(dist, 0, 200)*Phaser.Math.Clamp(dist, 0, 200)/40000*150;
                    if (this.speed == 50){ speed /= 2; }
                    opp.x /= 200/Phaser.Math.Clamp(dist, 0, 150);
                    opp.y /= 200/Phaser.Math.Clamp(dist, 0, 150);
                    enemy.currentDirection = enemy.currentDirection.add(opp).normalize();
                    let rand = (new Vector2(Math.random(), Math.random())).normalize().divide(new Vector2(10, 10));
                    enemy.currentDirection = enemy.currentDirection.add(rand).normalize();
                    this.setEnemyVelocity(enemy, enemy.currentDirection.x*speed, enemy.currentDirection.y*speed);
                }
            } else {
                this.setEnemyVelocity(enemy, 0, 0);
            }
        }
        else {
            this.setEnemyVelocity(enemy, 0, 0);
            if (enemy.stunDuration){
                enemy.stunDuration--;
            }
            if (enemy.freezeDuration){
                enemy.freezeDuration--;
            }
        }
    }
}