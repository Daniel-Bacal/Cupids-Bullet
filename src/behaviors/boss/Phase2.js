import Behavior from "../Behavior"
import Phaser from "phaser"
import BombBehavior from "../BombBehavior"
import FireAtPlayerBehavior from "../FireAtPlayerBehavior"
import ExplodeOnPlayerBehavior from "../ExplodeOnPlayerBehavior"
import FireShotgunAtPlayerBehavior from "../FireShotgunAtPlayerBehavior"

const Vector2 = Phaser.Math.Vector2;

const currentAction = {
    BULLET_WAVE: 1,
    LUNGE_AT_PLAYER: 2,
    THROW_BOMBS: 3,
    FIRE_LASER: 4
}

export default class Phase1 extends Behavior{

    setUpEnemy(enemy){
        enemy.currentDirection = new Vector2();

        // Bullet wave
        enemy.nextBulletWave = null;
        enemy.numBulletWavesLeft = 4;
        enemy.currentAttack = currentAction.BULLET_WAVE;
        enemy.inBulletWave = false;
        enemy.bulletWaveEnd = null;
        enemy.bulletOffset = 0;
        enemy.bulletTimeOffset = null;

        // Lunge at player
        enemy.lungeTime = null;
        enemy.stopLungeTime = null;
        enemy.numLungesLeft = 7;

        // Throw bombs
        enemy.throwNextBomb = null;
        enemy.bombsLeft = 4;
        enemy.numBombWaves = 1;

        // Fire laser
        enemy.laserChargeTime = null;
        enemy.laserFiringTime = null;
        enemy.laserCooldownTime = null;
        enemy.numLaserFires = 20;
    }

    behave(enemy){
        if ((enemy.stunDuration && enemy.stunDuration > 0) || (enemy.freezeDuration && enemy.freezeDuration > 0)){
            this.setEnemyVelocity(enemy, 0, 0);
            if (enemy.stunDuration){
                enemy.stunDuration--;
            }
            if (enemy.freezeDuration){
                enemy.freezeDuration--;
            }

            console.log("Boss Frozen");
            return;
        }

        switch(enemy.currentAttack){

            case currentAction.BULLET_WAVE:
                // Initialize bullet waves
                if(enemy.nextBulletWave === null){
                    enemy.nextBulletWave = this.scene.time.now + 1000;
                    enemy.bulletWaveEnd = this.scene.time.now - 1;
                }

                // Do bullet wave
                if(enemy.numBulletWavesLeft > 0 && this.scene.time.now < enemy.bulletWaveEnd){
                    // We are in a bullet wave, so fire bullet if we've waited long enough
                    if(enemy.bulletTimeOffset < this.scene.time.now){
                        enemy.bulletTimeOffset = this.scene.time.now + 100;
                        let enemyPosition = enemy.getCenter();
                        let dir = new Vector2();
                        for(let i = 0; i < 6; i++){
                            dir.setToPolar(Math.PI*2/6*i + (enemy.bulletOffset)*Math.PI/32)
                            enemy.bulletManager.requestBullet(enemyPosition.x, enemyPosition.y, dir.x, dir.y, 100, 10, "blue");
                        }
                        if(enemy.numBulletWavesLeft%2 === 0){
                            enemy.bulletOffset--;
                        } else {
                            enemy.bulletOffset++;
                        }
                    }
                } else if(enemy.numBulletWavesLeft > 0 && this.scene.time.now > enemy.nextBulletWave){
                    // Start a bullet wave
                    enemy.nextBulletWave = this.scene.time.now + 6000;
                    enemy.bulletWaveEnd = this.scene.time.now + 5000;
                    enemy.bulletTimeOffset = this.scene.time.now;
                    enemy.bulletOffset = 0;
                    enemy.numBulletWavesLeft--;
                } else if(enemy.numBulletWavesLeft === 0){
                    enemy.numBulletWavesLeft = 5;
                    enemy.nextBulletWave = null;
                    enemy.currentAttack = currentAction.LUNGE_AT_PLAYER;
                }

                break;
            case currentAction.LUNGE_AT_PLAYER:
                // Initialize Lunge timer
                if(enemy.lungeTime === null){
                    enemy.lungeTime = this.scene.time.now + 1000;
                }

                if(enemy.stopLungeTime !== null && this.scene.time.now >= enemy.stopLungeTime){
                    this.setEnemyVelocity(enemy, 0, 0);
                }

                // Lunge at player
                if(this.scene.time.now >= enemy.lungeTime && enemy.numLungesLeft > 0){
                    // Lunge
                    let enemyPosition = enemy.getCenter();
                    enemy.currentDirection = this.player.getCenter().clone().subtract(enemyPosition).normalize();
                    this.setEnemyVelocity(enemy, enemy.currentDirection.x*this.speed*6, enemy.currentDirection.y*this.speed*6);
                    
                    // Spawn Enemy
                    if(enemy.numLungesLeft === 0){
                        let i = Math.floor(Math.random()*3);
                        let em = enemy.enemies[i];
                        let b = [FireShotgunAtPlayerBehavior, FireAtPlayerBehavior, ExplodeOnPlayerBehavior];
                        let color = ["pink", "blue", "purple"];
                        em.requestEnemy(enemyPosition.x, enemyPosition.y, new b[i](this.player, this.scene, this.scene.slowerEnemies ? 50 : 100), this.scene.weakEnemy==color[i] ? 300-this.player.stats.flirt : 600-this.player.stats.flirt, 20, this.scene.enemyScale ? this.scene.enemyScale : 1);
                        this.scene.numEnemiesRemaining++;
                    }

                    // Increment lunge time and decrement lunge counter
                    if(enemy.numLungesLeft <= 3){
                        enemy.lungeTime = this.scene.time.now + 500;
                    } else {
                        enemy.lungeTime = this.scene.time.now + 800;
                    }
                    enemy.stopLungeTime = this.scene.time.now + 300;
                    
                    enemy.numLungesLeft--;
                } else if(enemy.numLungesLeft === 0 && (enemy.stopLungeTime !== null && this.scene.time.now >= enemy.stopLungeTime)){
                    enemy.lungeTime = null;
                    enemy.stopLungeTime = null;
                    enemy.numLungesLeft = 5;
                    enemy.currentAttack = currentAction.THROW_BOMBS;
                }
                
                break;
            case currentAction.THROW_BOMBS:
                if(enemy.throwNextBomb === null){
                    enemy.throwNextBomb = this.scene.time.now + 1000;
                }

                if(enemy.bombsLeft === 0){
                    // We are done with this wave
                    if(enemy.numBombWaves === 0){
                        // Totally done with this move
                        enemy.throwNextBomb = null;
                        enemy.numBombWaves = 1;
                        enemy.bombsLeft = 3;
                        enemy.currentAttack = currentAction.FIRE_LASER; 
                    } else {
                        enemy.throwNextBomb = this.scene.time.now + 2000;
                        enemy.numBombWaves--;
                    }
                } else if(this.scene.time.now >= enemy.throwNextBomb){
                    // Throw a bomb
                    let enemyPosition = enemy.getCenter();
                    enemy.bombs.requestEnemy(enemyPosition.x, enemyPosition.y, new BombBehavior(this.player, this.scene, 200), 100000, 0, 1);

                    enemy.throwNextBomb = this.scene.time.now + 300;
                    enemy.bombsLeft--;
                }

                break;
            case currentAction.FIRE_LASER:
                if(enemy.laserChargeTime === null){
                    enemy.laserChargeTime = this.scene.time.now + 3000;
                    enemy.laserFiringTime = this.scene.time.now + 3200;
                    enemy.laserCooldownTime = this.scene.time.now - 1;
                }

                if(this.scene.time.now > enemy.laserChargeTime && this.scene.time.now > enemy.laserCooldownTime){
                    enemy.laserFiringTime = this.scene.time.now + 200;
                    enemy.laserCooldownTime = this.scene.time.now + 300;
                    enemy.numLaserFires--;
                    enemy.laserPlayerPosition = this.player.getCenter();
                }

                if(this.scene.time.now > enemy.laserChargeTime && this.scene.time.now < enemy.laserFiringTime){
                    let enemyPosition = enemy.getCenter();
                    let playerPosition = enemy.laserPlayerPosition;
                    let dir = new Vector2(playerPosition.x - enemyPosition.x, playerPosition.y - enemyPosition.y);
                    dir = dir.normalize();
                    enemy.bulletManager.requestBullet(enemyPosition.x, enemyPosition.y, dir.x, dir.y, 1000, 10, "blue");
                } else if(enemy.numLaserFires <= 0){
                    enemy.currentAttack = currentAction.BULLET_WAVE;
                    enemy.laserChargeTime = null;
                    enemy.laserFiringTime = null;
                    enemy.laserCooldownTime = null
                    enemy.numLaserFires = 20;
                }
                break;
            default:
                break;
        }
    }
}