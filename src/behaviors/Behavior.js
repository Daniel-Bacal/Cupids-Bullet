
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

        // if(enemy.body.angle >= 0.79 && enemy.body.angle <= 2.35){
        //     enemy.way = "";
        //     enemy.flipX = true;
        // }else if((enemy.body.angle >= -3.15 && enemy.body.angle < -2.35) ||
        //     (enemy.body.angle <= 3.15 && enemy.body.angle > 2.35)){
        //     enemy.way = "_front";
        // }else if(enemy.body.angle <= -0.79 && enemy.body.angle > -2.35){
        //     enemy.way = "";
        //     enemy.flipX = false;
        // }else{
        //     enemy.way = "_front";
        // }
        if(enemy.anims.getCurrentKey().includes("damage")){
            return;
        }
        if(vX === 0 && vY === 0){

        } else {
            if(vX < 0){
                enemy.way = "";
                enemy.flipX = true;
            } else {
                enemy.way = "";
                enemy.flipX = false;
            }
            if(Math.abs(vY) > Math.abs(vX) && vY > 0){
                enemy.way = "_front";
            }
            enemy.anims.play(enemy.spriteName + enemy.way + "_walk", true);
        }
    }
}