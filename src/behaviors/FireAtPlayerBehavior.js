import Phaser from "phaser"
import Behavior from "./Behavior"

const Vector2 = Phaser.Math.Vector2;

export default class FireAtPlayerBehavior extends Behavior{
    setUpEnemy(enemy){
        enemy.bulletCoolDown = 1000;
        enemy.lastBulletFired = -1000;
        enemy.bulletSpeed = 200;
        enemy.currentDirection = new Vector2();
        enemy.speed = 100;
        enemy.timeLeftMoving = -1000;
    }

    behave(enemy){
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
            this.setEnemyVelocity(enemy, enemy.currentDirection.x*enemy.speed, enemy.currentDirection.y*enemy.speed);
            // Get a random time to stop moving
            enemy.timeLeftMoving = this.scene.time.now + Math.random()*100 + 200;
        }

        if(this.scene.time.now - enemy.lastBulletFired > enemy.bulletCoolDown){
            enemy.lastBulletFired = this.scene.time.now;
            let enemyPosition = enemy.getCenter();
            let playerPosition = this.player.getCenter();
            let dir = new Vector2(playerPosition.x - enemyPosition.x, playerPosition.y - enemyPosition.y);
            dir = dir.normalize();
            enemy.bulletManager.requestBullet(enemyPosition.x, enemyPosition.y, dir.x, dir.y, enemy.bulletSpeed, enemy.damage);
        }
    }
}