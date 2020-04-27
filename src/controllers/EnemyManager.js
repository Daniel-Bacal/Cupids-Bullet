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
            enemy.spriteName = this.sprite;

            // Enemy Health Bar
            this.initEnemyHealth(enemy)

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

    requestEnemy(xPos, yPos, behavior, enemyHealth, enemyDamage){
        let enemy = this.deadEnemies.pop();
        enemy.isAlive = true;

        // Enable enemy
        enemy.enableBody(true, xPos, yPos, true, true);
        enemy.setCollideWorldBounds(true);

        enemy.behavior = behavior;
        enemy.anims.play(this.sprite + '_walk', true);
        enemy.health = enemyHealth;
        enemy.maxHealth = enemy.health;
        enemy.damage = enemyDamage;

        enemy.behavior.setUpEnemy(enemy);
    }

    doBehaviors(){
        this.group.children.iterate((enemy) => {
            if(enemy.isAlive){
                enemy.behavior.behave(enemy);

                this.renderHealthBar(enemy);
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

        // Hide enemy health bar
        enemy.healthBox.clear();
        enemy.healthBar.clear();
    }

    initEnemyHealth(enemy){
        enemy.healthBox = this.scene.add.graphics();
        enemy.healthBar = this.scene.add.graphics();
    }

    renderHealthBar(enemy){
        enemy.healthBox.clear();
        enemy.healthBox.lineStyle(1, 0xFFFFFF);
        enemy.healthBox.strokeRect(enemy.x - 10, enemy.y + enemy.height/2 + 2, 20, 4);

        enemy.healthBar.clear();
        enemy.healthBar.fillStyle(0xFF0000);
        enemy.healthBar.fillRect(enemy.x - 10, enemy.y + enemy.height/2 + 2, 20*enemy.health/enemy.maxHealth, 4)
    }
}