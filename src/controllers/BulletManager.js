import Vector2 from "../utils/Vector2";

export default class BulletManager {
    constructor(){
        this.maxNumBullets = 1000;
        this.bullets = new Array(this.maxNumBullets);
        this.deadBullets = [];
        this.initBullets();
    }


    initBullets(){
        let bullet;
        for(let i = 0; i < this.maxNumBullets; i++){
            bullet = new Bullet();
            this.bullets[i] = bullet;
            this.deadBullets.push(bullet);
        }
    }

    addNewBullet(xPos, yPos, vxPos, vyPos, bulletOwner){
        let bullet = this.deadBullets.pop();
    }
}

export const bulletOwner = {
    PLAYER: 0,
    ENEMY: 1
}

class Bullet{
    constructor(){
        this.isAlive = false;
        this.owner = null;
        this.position = new Vector2();
        this.velocity = new Vector2();
    }

}