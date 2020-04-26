export default class Behavior{
    constructor(player, scene){
        this.player = player;
        this.scene = scene;
    }

    setUpEnemy(enemy){}

    behave(enemy){}

    setEnemyVelocity(enemy, vX, vY){
        enemy.setVelocity(vX, vY);

        if(vX === 0 && vY === 0){
            enemy.anims.play(enemy.spriteName + '_idle', true);
        } else {
            if(vX < 0){
                enemy.flipX = true;
                enemy.anims.play(enemy.spriteName + '_walk', true);
            } else {
                enemy.flipX = false;
                enemy.anims.play(enemy.spriteName + '_walk', true);
            }
        }
    }
}