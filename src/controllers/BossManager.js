import Phase1 from "../behaviors/boss/Phase1"

export default class BossManager{
    constructor(scene, sprite, group, bulletManager, player, bombs, enemies){
        this.scene = scene;
        this.sprite = sprite;
        this.group = group;
        this.bulletManager = bulletManager
        this.player = player;
        this.bombs = bombs;
        this.enemies = enemies;
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

    requestBoss(xPos, yPos){
        let boss = this.scene.physics.add.sprite(0, 0, this.sprite);
        boss.bulletManager = this.bulletManager;
        boss.spriteName = this.sprite;
        boss.bombs = this.bombs;
        boss.enemies = this.enemies;
        boss.way = "";
        boss.inPhase2 = false;

        // Enemy Health Bar
        this.initBossHealth(boss);

        // Add to physics group
        this.group.add(boss);

        boss.isAlive = true;

        // Enable enemy
        boss.enableBody(true, xPos, yPos, true, true);
        boss.setCollideWorldBounds(true);

        boss.anims.play(this.sprite + '_walk', true);

        boss.behavior = new Phase1(this.player, this.scene, 100);
        boss.health = 100000;
        boss.maxHealth = boss.health;
        boss.damage = 10;

        boss.behavior.setUpEnemy(boss);
    }

    doBehaviors(){
        this.group.children.iterate((boss) => {
            if(boss.isAlive){
                boss.behavior.behave(boss);
                this.renderHealthBar(boss);
            }
        })
    }

    handleCollision(){
        console.log("Collided");
    }

    killBoss(boss){
        // Show Explosions
        this.scene.anims.create({
            key: "fire-explode",
            frames: this.scene.anims.generateFrameNumbers("fire-explosion", {
            start: 0,
            end: 6
            }),
            frameRate: 20,
            repeat: 0
        });

        let bossPosition = boss.getCenter();
        
        for(let i = 1; i < 10; i++){

            this.scene.time.addEvent({
                delay: 5500*i/10 + (Math.random()*400 - 200),
                callback: () => {
                    let e1 = this.scene.add.sprite("fire-explosion")
                    e1.setPosition(bossPosition.x + Math.random()*64 - 32, bossPosition.y + Math.random()*64 - 32);
                    e1.anims.play("fire-explode");
                },
                loop: false
            })
        }

        

        boss.isDying = true;

        boss.setVelocity(0, 0);

        boss.anims.play(boss.spriteName + '_death', true);

        boss.nameText.text = "";
        boss.healthBox.clear();
        boss.healthBar.clear();
        boss.isAlive = false;

        boss.on("animationcomplete", () => this.afterDeath(boss));
    }

    afterDeath(boss){
        boss.disableBody(true, true);
        boss.destroy();
    }

    initBossHealth(boss){
        boss.nameText = this.scene.add.text(246, 241, "Chad", {fontFamily: "NoPixel", color: "white", fontSize: "24px"}).setOrigin(0.5, 0.5);
        boss.nameText.depth = 1000;
        boss.nameText.setScrollFactor(0, 0);
        boss.healthBox = this.scene.add.graphics();
        boss.healthBox.setScrollFactor(0, 0);
        boss.healthBox.depth = 1000;
        boss.healthBar = this.scene.add.graphics();
        boss.healthBar.setScrollFactor(0, 0);
        boss.healthBar.depth = 1000;
    }

    renderHealthBar(boss){
        boss.nameText.text = "Chad";
        boss.nameText.setOrigin(0.5, 0.5);

        boss.healthBox.clear();
        boss.healthBox.lineStyle(3, 0xFFFFFF);
        boss.healthBox.strokeRect(100, 250, 280, 8);

        boss.healthBar.clear();
        boss.healthBar.fillStyle(0xFF0000);
        boss.healthBar.fillRect(100, 250, 280*boss.health/boss.maxHealth, 8)
    }
}