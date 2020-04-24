import Phaser from "phaser";
import BulletManager from "./controllers/BulletManager"
import EnemyManager from "./controllers/EnemyManager"
import Player from "../src/objects/Player";
import FireAtPlayerBehavior from "./behaviors/FireAtPlayerBehavior"

const Vector2 = Phaser.Math.Vector2;

export default class BulletHell extends Phaser.Scene {
    constructor() {
        super({
        key: "BulletHell"
        });
        this.keysPressed = {w: 0, a: 0, s: 0, d: 0};
    }

    create() {
        this.createAnimations();

        this.createGroups();

        this.setUpBulletManagers();

        // Player
        this.player = new Player();
        this.player.loadFromSession();
        this.player.initBulletHell(this, this.playerBulletManager);

        this.setUpCollisions();

        this.setUpEnemies();

        this.setUpControls();
    }

    update(time, delta) {
        this.updatePlayer();
        this.enemyManager.doBehaviors();
    }

    createAnimations(){
        this.anims.create({
            key: "blue",
            frames: this.anims.generateFrameNumbers("bullet", {
                start: 0,
                end: 1
            }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: "red",
            frames: this.anims.generateFrameNumbers("bullet", {
                start: 2,
                end: 3
            }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: "enemy_idle",
            frames: this.anims.generateFrameNumbers("enemy", {
            start: 0,
            end: 0
            }),
            frameRate: 0,
            repeat: -1
        })
    }

    createGroups(){
        this.playerBullets = this.physics.add.group();
        this.enemyBullets = this.physics.add.group();
        this.enemyGroup = this.physics.add.group();
    }

    setUpCollisions(){
        this.physics.add.collider(this.player.getSprite(), this.enemyGroup);
        
        this.playerBulletManager.setCollisionData([{
            otherGroup: this.enemyGroup,
            callback: () => console.log("Hit Enemy")
        }]);

        this.enemyBulletManager.setCollisionData([{
            otherGroup: this.player.getSprite(),
            callback: () => console.log("Hit Player")
        }]);
    }

    setUpBulletManagers(){
        // Player bullet manager
        this.playerBulletManager = new BulletManager(
            100, 
            this,
            "bullet",
            this.playerBullets,
            [],
            1000
        );

        // Enemy bullet manager
        this.enemyBulletManager = new BulletManager(
            1000,
            this,
            "bullet",
            this.enemyBullets,
            [],
            1000
        )
    }

    setUpEnemies(){
        this.enemyManager = new EnemyManager(100, this, "enemy", this.enemyGroup, this.enemyBulletManager);
        this.enemyManager.requestEnemy(100, 100, new FireAtPlayerBehavior(this.player, this));
    }

    setUpControls(){
        // Set up key controls
        this.input.keyboard.on("keydown", (event) => {
            if("wasd".includes(event.key)){
                this.keysPressed[event.key] = "wa".includes(event.key) ? -1 : 1;
            }
        });

        this.input.keyboard.on("keyup", (event) => {
            if("wasd".includes(event.key)){
                this.keysPressed[event.key] = 0;
            }
        });

        this.mouseDown = false;

        // Set up mouse controls
        this.input.on("pointerdown", (event) => {
            this.mouseDown = true;
        });

        this.input.on("pointerup", (event) => {
            this.mouseDown = false;
        });
    }

    updatePlayer(){
        this.movePlayer();
        this.playerFireBullet();
    }

    movePlayer(){
        let directionX = this.keysPressed.a + this.keysPressed.d;
        let directionY = this.keysPressed.w + this.keysPressed.s;

        if(directionX && directionY){
            directionX /= 1.414;
            directionY /= 1.414;
        }

        this.player.setDirection(directionX, directionY);
    }

    playerFireBullet(){
        this.player.fireBullet(this.input.mousePointer.x, this.input.mousePointer.y, this.mouseDown, this.time.now);
    }
}
