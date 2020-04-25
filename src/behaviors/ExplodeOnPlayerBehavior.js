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
        if(this.scene.time.now > enemy.waitUntilTime){
            let enemyPosition = enemy.getCenter();
            enemy.currentDirection = this.player.getCenter().clone().subtract(enemyPosition).normalize()
            let dist = enemyPosition.distance(this.player.getCenter());

            if(dist < 50){
                enemy.waitUntilTime = this.scene.time.now + 1000;
                enemy.setVelocity(0, 0);
                for(let i = 0; i < 8; i++){
                    enemy.currentDirection.setToPolar(i*Math.PI/4, 1);
                    enemy.bulletManager.requestBullet(enemyPosition.x, enemyPosition.y, enemy.currentDirection.x, enemy.currentDirection.y, enemy.bulletSpeed, enemy.damage);
                }
            } else {
                let opp = new Vector2(enemy.currentDirection.y, -enemy.currentDirection.x);
                let speed = 200 - Phaser.Math.Clamp(dist, 0, 200)*Phaser.Math.Clamp(dist, 0, 200)/40000*150;
                opp.x /= 200/Phaser.Math.Clamp(dist, 0, 150);
                opp.y /= 200/Phaser.Math.Clamp(dist, 0, 150);
                enemy.currentDirection = enemy.currentDirection.add(opp).normalize();
                enemy.setVelocity(enemy.currentDirection.x*speed, enemy.currentDirection.y*speed);
            }
        }
    }
}