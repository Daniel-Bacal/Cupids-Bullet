import Phaser from "phaser"
import Behavior from "./Behavior"

const Vector2 = Phaser.Math.Vector2;

export default class FireAtPlayerBehavior extends Behavior{
    setUpEnemy(enemy){
        enemy.bulletCoolDown = 1000;
        enemy.lastBulletFired = -1000;
        enemy.bulletSpeed = 200;
    }

    behave(enemy){
        if(this.scene.time.now - enemy.lastBulletFired > enemy.bulletCoolDown){
            enemy.lastBulletFired = this.scene.time.now;
            let enemyPosition = enemy.getCenter();
            let playerPosition = this.player.getCenter();
            let dir = new Vector2(playerPosition.x - enemyPosition.x, playerPosition.y - enemyPosition.y);
            dir = dir.normalize();
            enemy.bulletManager.requestBullet(enemyPosition.x, enemyPosition.y, dir.x, dir.y, enemy.bulletSpeed);
        }
    }
}