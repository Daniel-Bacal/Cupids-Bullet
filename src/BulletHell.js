import Phaser from "phaser";
import BulletManager from "./controllers/BulletManager"
import EnemyManager from "./controllers/EnemyManager"
import Player from "../src/objects/Player";
import FireAtPlayerBehavior from "./behaviors/FireAtPlayerBehavior"
import ExplodeOnPlayerBehavior from "./behaviors/ExplodeOnPlayerBehavior"
import Button from "./ui_elements/Button"
import { level1, level2, level3 } from "./levels/levels"

const Vector2 = Phaser.Math.Vector2;

let space; 

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

        // Player
        this.player = this.game.player;
        if(this.player === null){
            this.player = new Player();
        }

        this.bulletHealth = 1;

        this.initPlayerSkills();

        this.createAnimations();

        this.createGroups();

        this.setUpBulletManagers();

        this.player.initBulletHell(this, this.playerBulletManager);

        this.setUpCollisions();

        this.setUpEnemies();

        this.numEnemiesRemaining;
        this.setUpLevel(this.player.day);
        this.numEnemiesRemainingText = this.add.text(240, 10, "", {fontFamily: "NoPixel", fontSize: "16px", color: "white"});
        this.numEnemiesRemainingText.setScrollFactor(0, 0);
        this.endTimer = null;

        this.cameras.main.startFollow(this.player.getSprite());
        this.cameras.main.setBounds(0, 0, 2*480, 2*270);

        this.setUpControls();

        this.initPauseMenu();

        this.initPlayerHealth();

        space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.startMusic();

        this.hasStarted = false;
        this.countdownTimer = null;
        this.roundedTimer = 4;
        this.countdownText = this.add.text(240, 135, "", {fontFamily: "NoPixel", fontSize: "96px", color: "white"});
        this.countdownText.setScrollFactor(0, 0);
        this.countdownAnimation = this.tweens.add({
            targets: this.countdownText,
            alpha: {from: 0, to: 1},
            scaleX: {from: 10, to: 1},
            scaleY: {from: 10, to: 1},
            duration: 500,
            ease: 'Power2'
          }, this);
    }

    update(time, delta) {
        if(!this.hasStarted){
            if(this.countdownTimer === null){
                this.countdownTimer = this.time.now - 1;
            }

            if(this.countdownTimer < this.time.now){
                this.countdownTimer = this.time.now + 1000;
                this.roundedTimer--;
                if(this.roundedTimer < 0){
                    this.hasStarted = true;
                    this.countdownText.destroy();
                } else if(this.roundedTimer <= 0){
                    this.countdownText.text = "Go!";
                } else {
                    this.countdownText.text = this.roundedTimer;
                }
                this.countdownText.setOrigin(0.5, 0.5);
                this.countdownAnimation.restart();
            }
        } else {
            this.updatePlayer();
            this.numEnemiesRemainingText.text = "Enemies Remaining: " + this.numEnemiesRemaining;
            this.numEnemiesRemainingText.setOrigin(0.5, 0.5);
            if(this.numEnemiesRemaining <= 0){
                if(this.endTimer === null){
                    this.endTimer = this.time.now + 3000;
                    this.victoryText = this.add.text(240, 135, "Date Secured", {fontFamily: "NoPixel", fontSize: "48px", color: "white"});
                    this.victoryText.setOrigin(0.5, 0.5);
                    this.victoryText.setScrollFactor(0, 0);
                    this.victoryTextAnimation = this.tweens.add({
                        targets: this.victoryText,
                        x: {from: -200, to: 240}, 
                        duration: 1000,
                        ease: 'Power2'
                      }, this);
                      this.victoryTextAnimation.restart();
                }
                if(this.time.now > this.endTimer){
                    this.goToScene("EndOfDay");
                }    
            }
            if (Phaser.Input.Keyboard.JustDown(space)){
                if (this.activeFreeze){
                  this.fEnemyGroup.children.iterate((enemy) => {if (enemy.isAlive){enemy.freezeDuration = 180;}});
                  this.mEnemyGroup.children.iterate((enemy) => {if (enemy.isAlive){enemy.freezeDuration = 180;}});
                }
                if (this.activeAOEDamage){
                  this.fEnemyGroup.children.iterate((enemy) => {if (enemy.isAlive){if (Phaser.Math.Distance.Squared(enemy.getCenter().x,enemy.getCenter().y, this.player.getCenter().x, this.player.getCenter().y)<= this.activeAOEDamageRadius*this.activeAOEDamageRadius){enemy.health-=this.activeAOEDamageAmount; if(enemy.health <= 0){this.fEnemyManager.killEnemy(enemy);}}}});
                  this.mEnemyGroup.children.iterate((enemy) => {if (enemy.isAlive){if (Phaser.Math.Distance.Squared(enemy.getCenter().x,enemy.getCenter().y, this.player.getCenter().x, this.player.getCenter().y)<= this.activeAOEDamageRadius*this.activeAOEDamageRadius){enemy.health-=this.activeAOEDamageAmount; if(enemy.health <= 0){this.mEnemyManager.killEnemy(enemy);}}}});
                }
            }
            this.fEnemyManager.doBehaviors();
            this.mEnemyManager.doBehaviors();
            this.oEnemyManager.doBehaviors();
        }
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

        //

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
            key: "fEnemy_damage",
            frames: this.anims.generateFrameNumbers("fEnemy", {
                start: 11,
                end: 17
            }),
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: "fEnemy_death",
            frames: this.anims.generateFrameNumbers("fEnemy", {
                start: 18,
                end: 26
            }),
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: "fEnemy_front_walk",
            frames: this.anims.generateFrameNumbers("fEnemy", {
                start: 27,
                end: 34
            }),
            frameRate: 8,
            repeat: -1
        });

        //

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
        this.anims.create({
            key: "mEnemy_damage",
            frames: this.anims.generateFrameNumbers("mEnemy", {
                start: 11,
                end: 17
            }),
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: "mEnemy_death",
            frames: this.anims.generateFrameNumbers("mEnemy", {
                start: 18,
                end: 26
            }),
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: "mEnemy_front_walk",
            frames: this.anims.generateFrameNumbers("mEnemy", {
                start: 27,
                end: 34
            }),
            frameRate: 8,
            repeat: -1
        });

        //

        this.anims.create({
            key: "oEnemy_idle",
            frames: this.anims.generateFrameNumbers("oEnemy", {
                start: 0,
                end: 0
            }),
            frameRate: 0,
            repeat: -1
        });
        this.anims.create({
            key: "oEnemy_walk",
            frames: this.anims.generateFrameNumbers("oEnemy", {
                start: 0,
                end: 10
            }),
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: "oEnemy_damage",
            frames: this.anims.generateFrameNumbers("oEnemy", {
                start: 11,
                end: 17
            }),
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: "oEnemy_death",
            frames: this.anims.generateFrameNumbers("oEnemy", {
                start: 18,
                end: 32
            }),
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: "oEnemy_front_walk",
            frames: this.anims.generateFrameNumbers("oEnemy", {
                start: 33,
                end: 40
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
        this.oEnemyGroup = this.physics.add.group();
        this.walls = this.physics.add.staticGroup();
    }

    setUpCollisions(){
        this.physics.add.collider(this.player.getSprite(), this.fEnemyGroup);
        this.physics.add.collider(this.player.getSprite(), this.mEnemyGroup);
        this.physics.add.collider(this.player.getSprite(), this.oEnemyGroup);

        this.physics.add.collider(this.fEnemyGroup, this.fEnemyGroup);
        this.physics.add.collider(this.mEnemyGroup, this.fEnemyGroup);
        this.physics.add.collider(this.mEnemyGroup, this.mEnemyGroup);
        this.physics.add.collider(this.fEnemyGroup, this.oEnemyGroup);
        this.physics.add.collider(this.mEnemyGroup, this.oEnemyGroup);
        this.physics.add.collider(this.oEnemyGroup, this.oEnemyGroup);

        this.physics.add.collider(this.fEnemyGroup, this.walls);
        this.physics.add.collider(this.mEnemyGroup, this.walls);
        this.physics.add.collider(this.oEnemyGroup, this.walls);
        this.physics.add.collider(this.player.getSprite(), this.walls);
        
        this.playerBulletManager.setCollisionData([{
            otherGroup: this.fEnemyGroup,
            callback: (enemy, bullet) => {
              enemy.health -= bullet.damage;
              this.sound.play("EnemyTakingDamageSFX");
              if (enemy.health <= 0){
                this.fEnemyManager.killEnemy(enemy);
                this.numEnemiesRemaining--;
              }
              if (this.player.bulletStun){
                let rand = Math.random();
                if (rand >= 0.43 && rand < 0.48){
                  enemy.stunDuration = 90;
                }
              }
            }
        },
        {
            otherGroup: this.mEnemyGroup,
            callback: (enemy, bullet) => {
              enemy.health -= bullet.damage;
              this.sound.play("EnemyTakingDamageSFX");
              if (enemy.health <= 0){
                this.mEnemyManager.killEnemy(enemy);
                this.numEnemiesRemaining--;
              }
              if (this.player.bulletStun){
                let rand = Math.random();
                if (rand >= 0.43 && rand < 0.48){
                  enemy.stunDuration = 90;
                }
              }
            }
        },
        {
            otherGroup: this.oEnemyGroup,
            callback: (enemy, bullet) => {
              enemy.health -= bullet.damage;
              this.sound.play("EnemyTakingDamageSFX");
              if (enemy.health <= 0){
                this.oEnemyManager.killEnemy(enemy);
                this.numEnemiesRemaining--;
              }
              if (this.player.bulletStun){
                let rand = Math.random();
                if (rand >= 0.43 && rand < 0.48){
                  enemy.stunDuration = 90;
                }
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
              this.sound.play("PlayerTakingDamageSFX");
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
            1000,
            this.bulletScale,
            this.bulletHealth
        );

        // Enemy bullet manager
        this.enemyBulletManager = new BulletManager(
            1000,
            this,
            "bullet",
            this.enemyBullets,
            [],
            1000,
            this.enemyScale
        );
    }

    setUpEnemies(){
        this.fEnemyManager = new EnemyManager(100, this, "fEnemy", this.fEnemyGroup, this.enemyBulletManager);

        // this.fEnemyManager.requestEnemy(100, 100, new ExplodeOnPlayerBehavior(this.player, this, this.slowerEnemies ? 50 : 100), this.weakEnemy=="pink" ? 300-this.player.stats.flirt : 600-this.player.stats.flirt, 50);
        // this.fEnemyManager.requestEnemy(300, 300, new ExplodeOnPlayerBehavior(this.player, this, this.slowerEnemies ? 50 : 100), this.weakEnemy=="pink" ? 300-this.player.stats.flirt : 600-this.player.stats.flirt, 50);
        // this.fEnemyManager.requestEnemy(300, 100, new ExplodeOnPlayerBehavior(this.player, this, this.slowerEnemies ? 50 : 100), this.weakEnemy=="pink" ? 300-this.player.stats.flirt : 600-this.player.stats.flirt, 50);
        // this.fEnemyManager.requestEnemy(400, 200, new ExplodeOnPlayerBehavior(this.player, this, this.slowerEnemies ? 50 : 100), this.weakEnemy=="pink" ? 300-this.player.stats.flirt : 600-this.player.stats.flirt, 50);

        // this.fEnemyManager.requestEnemy(150, 150, new ExplodeOnPlayerBehavior(this.player, this), 120, 500, 50, this.player.stats.flirt);
        // this.fEnemyManager.requestEnemy(350, 350, new ExplodeOnPlayerBehavior(this.player, this), 120, 500, 50, this.player.stats.flirt);
        // this.fEnemyManager.requestEnemy(350, 150, new ExplodeOnPlayerBehavior(this.player, this), 120, 500, 50, this.player.stats.flirt);
        // this.fEnemyManager.requestEnemy(450, 250, new ExplodeOnPlayerBehavior(this.player, this), 120, 500, 50, this.player.stats.flirt);

        this.mEnemyManager = new EnemyManager(100, this, "mEnemy", this.mEnemyGroup, this.enemyBulletManager);
        // this.mEnemyManager.requestEnemy(200, 100, new FireAtPlayerBehavior(this.player, this, this.slowerEnemies ? 50 : 100), this.weakEnemy=="blue" ? 300-this.player.stats.flirt : 600-this.player.stats.flirt, 50);
        // this.mEnemyManager.requestEnemy(400, 200, new FireAtPlayerBehavior(this.player, this, this.slowerEnemies ? 50 : 100), this.weakEnemy=="blue" ? 300-this.player.stats.flirt : 600-this.player.stats.flirt, 50);
        // this.mEnemyManager.requestEnemy(300, 500, new FireAtPlayerBehavior(this.player, this, this.slowerEnemies ? 50 : 100), this.weakEnemy=="blue" ? 300-this.player.stats.flirt : 600-this.player.stats.flirt, 50);
        // this.mEnemyManager.requestEnemy(400, 400, new FireAtPlayerBehavior(this.player, this, this.slowerEnemies ? 50 : 100), this.weakEnemy=="blue" ? 300-this.player.stats.flirt : 600-this.player.stats.flirt, 50);

        this.oEnemyManager = new EnemyManager(100, this, "oEnemy", this.oEnemyGroup, this.enemyBulletManager);
        // this.oEnemyManager.requestEnemy(200, 100, new FireAtPlayerBehavior(this.player, this, this.slowerEnemies ? 50 : 100), this.weakEnemy=="purple" ? 300-this.player.stats.flirt : 600-this.player.stats.flirt, 50);
        // this.oEnemyManager.requestEnemy(400, 200, new FireAtPlayerBehavior(this.player, this, this.slowerEnemies ? 50 : 100), this.weakEnemy=="purple" ? 300-this.player.stats.flirt : 600-this.player.stats.flirt, 50);
        // this.oEnemyManager.requestEnemy(300, 500, new FireAtPlayerBehavior(this.player, this, this.slowerEnemies ? 50 : 100), this.weakEnemy=="purple" ? 300-this.player.stats.flirt : 600-this.player.stats.flirt, 50);
        // this.oEnemyManager.requestEnemy(400, 400, new FireAtPlayerBehavior(this.player, this, this.slowerEnemies ? 50 : 100), this.weakEnemy=="purple" ? 300-this.player.stats.flirt : 600-this.player.stats.flirt, 50);

        // this.mEnemyManager.requestEnemy(250, 150, new FireAtPlayerBehavior(this.player, this), 120, 500, 50, this.player.stats.flirt);
        // this.mEnemyManager.requestEnemy(450, 250, new FireAtPlayerBehavior(this.player, this), 120, 500, 50, this.player.stats.flirt);
        // this.mEnemyManager.requestEnemy(350, 550, new FireAtPlayerBehavior(this.player, this), 120, 500, 50, this.player.stats.flirt);
        // this.mEnemyManager.requestEnemy(450, 450, new FireAtPlayerBehavior(this.player, this), 120, 500, 50, this.player.stats.flirt);
    }

    setUpLevel(day){
        let level;
        switch(day){
            case 0:
                level = level1;
                break;
            case 1:
                level = level2;
                break;
            case 3:
                level = level3
                break;
            default:
                level = leve1;
        }

        this.numEnemiesRemaining = 0;

        let numCols = 30;
        let cellSize = 32;
        let row;
        let col;
        let x;
        let y;
        let type;
        for(let i = 0; i < level1.length; i++){
            row = Math.floor(i/numCols);
            col = i%numCols;
            x = col*cellSize;
            y = row*cellSize;
            type = level1.charAt(i);
            switch(type){
                case 'W':
                    // Create wall
                    this.addWall(x, y);
                    break;
                case 'F':
                    // Create female enemy
                    this.fEnemyManager.requestEnemy(x, y, new ExplodeOnPlayerBehavior(this.player, this, this.slowerEnemies ? 50 : 100), this.weakEnemy=="pink" ? 300-this.player.stats.flirt : 600-this.player.stats.flirt, 50);
                    this.numEnemiesRemaining++;
                    break;
                case 'M':
                    // Create male enemy
                    this.mEnemyManager.requestEnemy(x, y, new FireAtPlayerBehavior(this.player, this, this.slowerEnemies ? 50 : 100), this.weakEnemy=="blue" ? 300-this.player.stats.flirt : 600-this.player.stats.flirt, 50);
                    this.numEnemiesRemaining++;
                    break;
                case 'O':
                    // Create other enemy
                    this.oEnemyManager.requestEnemy(x, y, new FireAtPlayerBehavior(this.player, this, this.slowerEnemies ? 50 : 100), this.weakEnemy=="purple" ? 300-this.player.stats.flirt : 600-this.player.stats.flirt, 50);
                    this.numEnemiesRemaining++;
                    break;
                case 'P':
                    // Move player
                    this.player.getSprite().setPosition(x, y);
                    break;
                default:
                    // Do nothing
            }
        }
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

    addWall(x, y){
        let wall = this.walls.create(x, y, "wall");
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
      if (this.doubleBullet){
        this.player.fireBullet(this.input.mousePointer.x + this.cameras.main.scrollX, this.input.mousePointer.y + this.cameras.main.scrollY, this.mouseDown, this.time.now, this.doubleBullet)
      }
      else{
        this.player.fireBullet(this.input.mousePointer.x + this.cameras.main.scrollX, this.input.mousePointer.y + this.cameras.main.scrollY, this.mouseDown, this.time.now);
      }
    }

    initPauseMenu(){
        this.initPauseButton();
        this.scene.launch("PauseMenu", {parent: this});
        this.scene.sleep("PauseMenu");
        this.scene.bringToTop("PauseMenu");
    }

    initPauseButton(){
        this.pauseButton = Button(this, 450, 10, "\u23F8");
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
                this.goToScene("MainMenu");
            },
            noCallback: () => {
                this.scene.stop("YesNoModal");
                this.scene.resume("PauseMenu");
            }
        });
        this.scene.bringToTop("YesNoModal");
    }

    goToScene(targetScene){
        this.scene.stop("PauseMenu")
        this.scene.start(targetScene);
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

    initPlayerSkills(){
      let skills = this.player.skills;
      console.log(skills[0]);
      if (skills[0] == "sf"){
        this.weakEnemy = "pink";
        if (skills[1] == "sf1"){
          this.player.speed += 100;
          if (skills[2] == "sf11"){
            this.player.speed += 100;
          }
          else if (skills[2] == "sf12"){
            //Active Invisibility
            //If player is invis. Have them stop shooting and wander randomly.
          }
        }
        else if (skills[1] == "sf2"){
          this.player.bulletSpeed += 250;
          if (skills[2] == "sf21"){
            this.player.bulletSpeed += 250;
          }
          else if (skills[2] == "sf22"){
            this.player.bulletStun = true;
          }
        }
      }
      else if (skills[0] == "sm"){
        this.weakEnemy = "blue";
        if (skills[1] == "sm1"){
          this.player.damage += 50;
          if (skills[2] == "sm11"){
            this.player.damage += 50;
          }
          else if (skills[2] == "sm12"){
            this.bulletHealth = 2;
          }
        }
        else if (skills[1] == "sm2"){
          this.bulletScale = 1.5;
          if (skills[2] == "sm21"){
            this.bulletScale = 2;
          }
          else if (skills[2] == "sm22"){
            this.doubleBullet = true;
          }
        }
      }
      else if (skills[0] == "sb"){
        this.weakEnemy = "purple";
        if (skills[1] == "sb1"){
          this.enemyScale = 1.5;
          if (skills[2] == "sb11"){ 
            this.slowerEnemies = true;
          }
          else if (skills[2] == "sb12"){
            this.activeFreeze = true;
          }
        }
        else if (skills[1] == "sb2"){
          this.enemyScale = 0.7;
          if (skills[2] == "sb21"){
            //Random Enemy Death

          }
          else if (skills[2] == "sb22"){
            this.activeAOEDamage = true;
            this.activeAOEDamageRadius = 100;
            this.activeAOEDamageAmount = 200;
          }
        }
      }
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
