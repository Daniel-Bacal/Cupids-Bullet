import Phaser from "phaser"

export default class EnemyManager{
    constructor(maxNumEnemies, scene, sprite, group, bulletManager){
        this.maxNumEnemies = maxNumEnemies;
        this.scene = scene;
        this.sprite = sprite;
        this.group = group;
        this.bulletManager = bulletManager

        this.deadEnemies = [];
        this.initEnemies();
    }

    initEnemies(){
        let enemy;
        for(let i = 0; i < this.maxNumEnemies; i++){
            enemy = this.scene.physics.add.sprite(0, 0, this.sprite);
            enemy.bulletManager = this.bulletManager;
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

    requestEnemy(xPos, yPos, behavior, enemySpeed, enemyHealth, enemyDamage, playerFlirt){
        let enemy = this.deadEnemies.pop();
        enemy.isAlive = true;

        // Enable enemy
        enemy.enableBody(true, xPos, yPos, true, true);

        enemy.behavior = behavior;

        enemy.speed = enemySpeed;
        enemy.health = enemyHealth - playerFlirt;
        enemy.damage = enemyDamage;

        enemy.behavior.setUpEnemy(enemy);
    }

    doBehaviors(){
        this.group.children.iterate((enemy) => {
            if(enemy.isAlive){
                enemy.behavior.behave(enemy);
            }
        })
    }

    handleCollision(){
        console.log("Collided");
    }

    killEnemy(enemy){
        enemy.isAlive = false;
        enemy.disableBody(true, true);
        this.deadEnemies.push(enemy);
    }
}