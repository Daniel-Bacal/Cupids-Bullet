import Phaser from "phaser"
import Behavior from "./Behavior"

const Vector2 = Phaser.Math.Vector2;

export default class BombBehavior extends Behavior{
    setUpEnemy(enemy){
        enemy.currentDirection = new Vector2();
        enemy.bulletSpeed = 100;
        enemy.detonationTime = null;
    }

    behave(enemy){
        if(enemy.detonationTime === null){
            // Set movement towards player
            let enemyPosition = enemy.getCenter();
            enemy.currentDirection = this.player.getCenter().clone().subtract(enemyPosition);
            let playerDir = this.player.getDirection();
            let targetX = enemy.currentDirection.x + Math.random()*playerDir.x*this.player.speed;
            let targetY = enemy.currentDirection.y + Math.random()*playerDir.y*this.player.speed;
            enemy.currentDirection.x = targetX;
            enemy.currentDirection.y = targetY;
            enemy.currentDirection.normalize();
            enemy.setVelocity(enemy.currentDirection.x*this.speed, enemy.currentDirection.y*this.speed);
            // Set detonation time
            enemy.detonationTime = this.scene.time.now + 1000;
            enemy.anims.play("bomb_normal");
        }

        if(this.scene.time.now >= enemy.detonationTime){
            // Fire a circle of bullets
            let enemyPosition = enemy.getCenter();
            for(let i = 0; i < 32; i++){
                enemy.currentDirection.setToPolar(Math.PI*2/32*i, 1);
                enemy.bulletManager.requestBullet(enemyPosition.x, enemyPosition.y, enemy.currentDirection.x, enemy.currentDirection.y, 100, 25, "blue");
                enemy.bulletManager.requestBullet(enemyPosition.x, enemyPosition.y, enemy.currentDirection.x, enemy.currentDirection.y, 200, 10, "blue");
            }
            // Kill bomb
            enemy.manager.killEnemy(enemy);
        }
    }
}