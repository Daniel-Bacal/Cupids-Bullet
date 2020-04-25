import Phaser from "phaser";
import BulletManager from "./controllers/BulletManager"
import EnemyManager from "./controllers/EnemyManager"
import Player from "../src/objects/Player";
import FireAtPlayerBehavior from "./behaviors/FireAtPlayerBehavior"
import ExplodeOnPlayerBehavior from "./behaviors/ExplodeOnPlayerBehavior"
import Button from "./ui_elements/Button"

const Vector2 = Phaser.Math.Vector2;

export default class BulletHell extends Phaser.Scene {
    constructor() {
        super({
        key: "BulletHell"
        });
        this.keysPressed = {w: 0, a: 0, s: 0, d: 0};
    }

    create() {
        this.physics.world.setBounds(0, 0, 2*480, 2*270);

        this.background = this.add.image(0, 0, "bullet-hell-background");
        this.background.setOrigin(0, 0);

        this.createAnimations();

        this.createGroups();

        this.setUpBulletManagers();

        // Player
        this.player = new Player();
        this.player.loadFromSession();
        this.player.initBulletHell(this, this.playerBulletManager);

        this.cameras.main.startFollow(this.player.getSprite());
        this.cameras.main.setBounds(0, 0, 2*480, 2*270);

        this.setUpCollisions();

        this.setUpEnemies();

        this.setUpControls();

        this.setUpWalls();

        this.initPauseMenu();

        this.initPlayerHealth();

        this.startMusic();
    }

    update(time, delta) {
        this.updatePlayer();
        this.fEnemyManager.doBehaviors();
        this.mEnemyManager.doBehaviors();
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
            key: "player_idle",
            frames: this.anims.generateFrameNumbers("bhPlayer", {
                start: 0,
                end: 0
            }),
            frameRate: 0,
            repeat: -1
        });

        this.anims.create({
            key: "player_walk",
            frames: this.anims.generateFrameNumbers("bhPlayer", {
                start: 0,
                end: 7
            }),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: "fEnemy_idle",
            frames: this.anims.generateFrameNumbers("fEnemy", {
            start: 0,
            end: 0
            }),
            frameRate: 0,
            repeat: -1
        });

        this.anims.create({
            key: "fEnemy_walk",
            frames: this.anims.generateFrameNumbers("fEnemy", {
                start: 0,
                end: 10
            }),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: "mEnemy_idle",
            frames: this.anims.generateFrameNumbers("mEnemy", {
                start: 0,
                end: 0
            }),
            frameRate: 0,
            repeat: -1
        });

        this.anims.create({
            key: "mEnemy_walk",
            frames: this.anims.generateFrameNumbers("mEnemy", {
                start: 0,
                end: 10
            }),
            frameRate: 8,
            repeat: -1
        });

    }

    createGroups(){
        this.playerBullets = this.physics.add.group();
        this.enemyBullets = this.physics.add.group();
        this.fEnemyGroup = this.physics.add.group();
        this.mEnemyGroup = this.physics.add.group();
        this.walls = this.physics.add.staticGroup();
    }

    setUpCollisions(){
        this.physics.add.collider(this.player.getSprite(), this.fEnemyGroup);
        this.physics.add.collider(this.player.getSprite(), this.mEnemyGroup);

        this.physics.add.collider(this.fEnemyGroup, this.fEnemyGroup);
        this.physics.add.collider(this.mEnemyGroup, this.fEnemyGroup);
        this.physics.add.collider(this.mEnemyGroup, this.mEnemyGroup);

        this.physics.add.collider(this.fEnemyGroup, this.walls);
        this.physics.add.collider(this.mEnemyGroup, this.walls);
        this.physics.add.collider(this.player.getSprite(), this.walls);
        
        this.playerBulletManager.setCollisionData([{
            otherGroup: this.fEnemyGroup,
            callback: (enemy, bullet) => {
              enemy.health -= bullet.damage;
              if (enemy.health <= 0){
                this.fEnemyManager.killEnemy(enemy);
              }
            }
        },
        {
            otherGroup: this.mEnemyGroup,
            callback: (enemy, bullet) => {
              enemy.health -= bullet.damage;
              if (enemy.health <= 0){
                this.mEnemyManager.killEnemy(enemy);
              }
            }
        },
        {
            otherGroup: this.walls,
            callback: (wall, bullet) => {}
        }]);

        this.enemyBulletManager.setCollisionData([{
            otherGroup: this.player.getSprite(),
            callback: (playerSprite, bullet) => {
              this.player.health -= bullet.damage;
              if (this.player.health <= 0){
                this.scene.start("MainMenu");
              }
            }
        },
        {
            otherGroup: this.walls,
            callback: (wall, bullet) => {}
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
        this.fEnemyManager = new EnemyManager(100, this, "fEnemy", this.fEnemyGroup, this.enemyBulletManager);

        this.fEnemyManager.requestEnemy(100, 100, new ExplodeOnPlayerBehavior(this.player, this), 120, 500, 50, this.player.stats.flirt);
        this.fEnemyManager.requestEnemy(300, 300, new ExplodeOnPlayerBehavior(this.player, this), 120, 500, 50, this.player.stats.flirt);
        this.fEnemyManager.requestEnemy(300, 100, new ExplodeOnPlayerBehavior(this.player, this), 120, 500, 50, this.player.stats.flirt);
        this.fEnemyManager.requestEnemy(400, 200, new ExplodeOnPlayerBehavior(this.player, this), 120, 500, 50, this.player.stats.flirt);

        // this.fEnemyManager.requestEnemy(150, 150, new ExplodeOnPlayerBehavior(this.player, this), 120, 500, 50, this.player.stats.flirt);
        // this.fEnemyManager.requestEnemy(350, 350, new ExplodeOnPlayerBehavior(this.player, this), 120, 500, 50, this.player.stats.flirt);
        // this.fEnemyManager.requestEnemy(350, 150, new ExplodeOnPlayerBehavior(this.player, this), 120, 500, 50, this.player.stats.flirt);
        // this.fEnemyManager.requestEnemy(450, 250, new ExplodeOnPlayerBehavior(this.player, this), 120, 500, 50, this.player.stats.flirt);

        this.mEnemyManager = new EnemyManager(100, this, "mEnemy", this.mEnemyGroup, this.enemyBulletManager);
        this.mEnemyManager.requestEnemy(200, 100, new FireAtPlayerBehavior(this.player, this), 120, 500, 50, this.player.stats.flirt);
        this.mEnemyManager.requestEnemy(400, 200, new FireAtPlayerBehavior(this.player, this), 120, 500, 50, this.player.stats.flirt);
        this.mEnemyManager.requestEnemy(300, 500, new FireAtPlayerBehavior(this.player, this), 120, 500, 50, this.player.stats.flirt);
        this.mEnemyManager.requestEnemy(400, 400, new FireAtPlayerBehavior(this.player, this), 120, 500, 50, this.player.stats.flirt);

        // this.mEnemyManager.requestEnemy(250, 150, new FireAtPlayerBehavior(this.player, this), 120, 500, 50, this.player.stats.flirt);
        // this.mEnemyManager.requestEnemy(450, 250, new FireAtPlayerBehavior(this.player, this), 120, 500, 50, this.player.stats.flirt);
        // this.mEnemyManager.requestEnemy(350, 550, new FireAtPlayerBehavior(this.player, this), 120, 500, 50, this.player.stats.flirt);
        // this.mEnemyManager.requestEnemy(450, 450, new FireAtPlayerBehavior(this.player, this), 120, 500, 50, this.player.stats.flirt);
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

    setUpWalls(){
        for(let i = 0; i < 20; i++){
            let x = Math.floor(Math.random()*960);
            let y = Math.floor(Math.random()*540);
            this.addWall(x, y);
        }
    }

    addWall(x, y){
        this.walls.create(x, y, "wall");
    }

    updatePlayer(){
        this.movePlayer();
        this.playerFireBullet();

        // Player Health
        this.playerHealthBar.clear();
        this.playerHealthBar.fillStyle(0xFF0000);
        this.playerHealthBar.fillRect(5, 5, Math.ceil(200*this.player.getHealthPercent()), 10);
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
        this.player.fireBullet(this.input.mousePointer.x + this.cameras.main.scrollX, this.input.mousePointer.y + this.cameras.main.scrollY, this.mouseDown, this.time.now);
    }

    initPauseMenu(){
        this.initPauseButton();
        this.scene.launch("PauseMenu", {parent: this});
        this.scene.sleep("PauseMenu");
        this.scene.bringToTop("PauseMenu");
    }

    initPauseButton(){
        this.pauseButton = Button(this, 450, 10, "P");
        this.pauseButton.setButtonColor("white");
        this.pauseButton.setButtonOnClick(() => this.pauseGame(true));
        this.pauseButton.setScrollFactor(0, 0);
    }

    pauseGame(flag){
        if(flag){
            this.scene.wake("PauseMenu");
            this.scene.pause();
        } else {
            this.scene.sleep("PauseMenu");
            this.scene.resume();
        }    
    }

    goToMainMenu(){
        this.scene.pause("PauseMenu");
        this.scene.launch("YesNoModal", {
            yesCallback: () => {
                this.scene.stop("YesNoModal");
                this.returnToMainMenu();
            },
            noCallback: () => {
                this.scene.stop("YesNoModal");
                this.scene.resume("PauseMenu");
            }
        });
        this.scene.bringToTop("YesNoModal");
    }

    returnToMainMenu(){
        this.scene.stop("PauseMenu")
        this.scene.start("MainMenu");
        this.scene.stop();
    }

    goToControls(){
        this.scene.sleep("PauseMenu");
        this.scene.launch("Controls", {returnCallback: () => {
            this.scene.wake("PauseMenu");
            this.scene.stop("Controls");
        }});
        this.scene.bringToTop("Controls");
    }

    initPlayerHealth(){
        this.playerHealthBar = this.add.graphics();
        this.playerHealthBar.setScrollFactor(0, 0);

        this.playerHealthBox = this.add.graphics();
        this.playerHealthBox.lineStyle(2, 0xFFFFFF);
        this.playerHealthBox.strokeRect(5, 5, 200, 10);
        this.playerHealthBox.setScrollFactor(0, 0);
    }

    startMusic(){
        if(this.game.music && this.game.music.isPlaying){
            if(this.game.music.songName !== "Battle"){
              this.game.music.stop();
              this.game.music = this.sound.add("Battle", {loop: true});
              this.game.music.play();
              this.game.music.isPlaying = true;
              this.game.music.songName = "Battle"
            }
          } else {
            this.game.music = this.sound.add("Battle", {loop: true});
            this.game.music.play();
            this.game.music.isPlaying = true;
            this.game.music.songName = "Battle"
          }
    }
}
