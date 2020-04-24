import Phaser from "phaser"

export default class EnemyManage{
    constructor(maxNumEnemies, scene, sprite, group){
        this.maxNumEnemies = maxNumEnemies;
        this.scene = scene;
        this.sprite = sprite;
        this.group = group;
        this.deadEnemies = [];
        this.initEnemies();
    }

    initEnemies(){
        let enemy;
        for(let i = 0; i < this.maxNumEnemies; i++){
            enemy = this.scene.physics.add.sprite(0, 0, this.sprite);
            enemy.isAlive = false;

            // Add to physics group
            this.group.add(enemy);

            // Hide Enemy
            enemy.disableBody(true, true);

            // Add to dead enemy list
            this.deadEnemies.push(enemy);
        }
    }

    setUpEnemyCollisions(){
        for(let i = 0; i < this.collisionData.length; i++){
            this.scene.physics.add.overlap(
                this.collisionData[i].otherGroup,
                this.group,
                () => {
                    this.collisionData[i].callback
                    this.handleCollision();
                },
                null,
                this);
        }
    }

    requestEnemy(xPos, yPos, behavior){
        let enemy = this.deadEnemies.pop();
        enemy.isAlive = true;

        // Enable enemy
        enemy.enableBody(true, xPos, yPos, true, true);

        enemy.behavior = behavior;
    }

    doBehaviors(){
        
    }

    handleCollision(){
        console.log("Collided");
    }

    killEnemy(enemy){
        enemy.isAlive - false;
        enemy.disableBody(true, true);
        this.deadEnemies.push(enemy);
    }
}