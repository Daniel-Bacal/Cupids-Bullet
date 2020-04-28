
export default class Behavior{
    constructor(player, scene, speed){
        this.player = player;
        this.scene = scene;
        this.speed = speed;
    }

    setUpEnemy(enemy){}

    behave(enemy){}

    setEnemyVelocity(enemy, vX, vY){
        enemy.setVelocity(vX, vY);

        if(enemy.body.angle >= 0.79 && enemy.body.angle <= 2.35){
            enemy.way = "";
            enemy.flipX = false;
        }else if((enemy.body.angle >= -3.15 && enemy.body.angle < -2.35) ||
            (enemy.body.angle <= 3.15 && enemy.body.angle > 2.35)){
            enemy.way = "_front";
        }else if(enemy.body.angle <= -0.79 && enemy.body.angle > -2.35){
            enemy.way = "";
            enemy.flipX = true;
        }else{
            enemy.way = "_front";
        }
        // if(vX === 0 && vY === 0){
        //     // enemy.anims.play(enemy.spriteName + '_idle', true);
        // } else {
        //     if(vX < 0){
        //         enemy.flipX = true;
        //     } else {
        //         enemy.flipX = false;
        //     }
        // }
    }
}