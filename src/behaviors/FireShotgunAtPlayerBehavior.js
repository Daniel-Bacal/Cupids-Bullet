import Phaser from "phaser"
import Behavior from "./Behavior"

const Vector2 = Phaser.Math.Vector2;

export default class FireShotgunAtPlayerBehavior extends Behavior{
    setUpEnemy(enemy){
        enemy.bulletCoolDown = 2000;
        enemy.lastBulletFired = -1000;
        enemy.bulletSpeed = 200;
        enemy.currentDirection = new Vector2();
        enemy.timeLeftMoving = -1000;
    }

    behave(enemy){
        if(enemy.isDying){
            return;
        }

        if(this.player.isInvisible){
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
            let enemyPosition = enemy.getCenter();

            if(enemy.timeLeftMoving <= this.scene.time.now){
                // Get a new direction
                let distSq = enemyPosition.distanceSq(this.player.getCenter());
                if(distSq < 10000){
                    enemy.currentDirection = this.player.getCenter().clone().subtract(enemyPosition).normalize();
                } else {
                    let direction = Math.random()*Math.PI*2;
                    enemy.currentDirection = enemy.currentDirection.setToPolar(direction, 1);
                }
                this.setEnemyVelocity(enemy, enemy.currentDirection.x*this.speed, enemy.currentDirection.y*this.speed);
                // Get a random time to stop moving
                enemy.timeLeftMoving = this.scene.time.now + Math.random()*100 + 200;
            }

            if(this.scene.time.now - enemy.lastBulletFired > enemy.bulletCoolDown){
                enemy.lastBulletFired = this.scene.time.now + Math.floor(Math.random()*200);
                let enemyPosition = enemy.getCenter();
                let playerPosition = this.player.getCenter();
                let playerDir = this.player.getDirection();
                let dir = new Vector2(playerPosition.x + playerDir.x*100 - enemyPosition.x, playerPosition.y + playerDir.y*100 - enemyPosition.y);
                dir = dir.normalize();
                let angle = Math.atan2(dir.y, dir.x);
                for(let i = 0; i < 6; i++){
                    dir.setToPolar(angle + Math.random()*Math.PI/6, 1);
                    let speed = enemy.bulletSpeed*(Math.random() + 0.5);
                    enemy.bulletManager.requestBullet(enemyPosition.x, enemyPosition.y, dir.x, dir.y, speed, enemy.damage, "blue");
                } 
            }
        }
        else{
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