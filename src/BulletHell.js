import Phaser from "phaser";
import BulletManager from "./controllers/BulletManager"
import EnemyManager from "./controllers/EnemyManager"
import Player from "../src/objects/Player";
import FireAtPlayerBehavior from "./behaviors/FireAtPlayerBehavior"
import ExplodeOnPlayerBehavior from "./behaviors/ExplodeOnPlayerBehavior"
import FireShotgunAtPlayerBehavior from "./behaviors/FireShotgunAtPlayerBehavior"
import Button from "./ui_elements/Button"
import { level1, level2, level3, boss, endless } from "./levels/levels"
import BossManager from "./controllers/BossManager"
import Phase2 from "./behaviors/boss/Phase2"

const Vector2 = Phaser.Math.Vector2;

let space; 
let esc;

export default class BulletHell extends Phaser.Scene {
    constructor() {
        super({
        key: "BulletHell"
        });
    }

    init(data){
        if(data.endless){
            this.endless = true;
        } else {
            this.endless = false;
        }

    }

    create() {
        // Set up keyboard controls
        this.keysPressed = {w: 0, a: 0, s: 0, d: 0};

        // Set up things specifically for endless mode
        if(this.endless){
            this.spawnLocations = [];
            this.spawnChance = 0.0005;
        }

        // Set up game world
        if(this.endless){
            // TODO - make this bigger maybe?
            this.physics.world.setBounds(0, 0, 2*480, 2*270);
            this.background = this.add.image(0, 0, "bullet-hell-background");
            this.background.setOrigin(0, 0);
        } else {
            this.physics.world.setBounds(0, 0, 2*480, 2*270);
            this.background = this.add.image(0, 0, "bullet-hell-background");
            this.background.setOrigin(0, 0);
        }

        // Set up Player
        this.player = this.game.player;
        if(this.player === null){
            this.player = new Player();
        }
        this.playerSpaceSprite = this.add.sprite(0, 0, "explosion");
        this.playerIsDead = false;
        this.killedPlayer = false;
        this.bossIsDead = false;
        this.startedBossEnd = false;
        this.bossIntoPhase2 = false;
        this.phase2StartTime = 0;
        this.bossTransition = false;

        // Initialize bullet piercing and enemy scale
        this.bulletHealth = 1;
        this.enemyScale = 1;

        this.createAnimations();

        this.createGroups();

        this.initPlayerSkills();

        this.setUpBulletManagers();

        if(this.endless){
            this.player.initEndlessBulletHell(this, this.playerBulletManager);
        } else {
            this.player.initBulletHell(this, this.playerBulletManager);
        }

        this.setUpCollisions();

        this.setUpEnemies();

        // Set up enemy counter
        if(this.endless){
            this.numEnemiesKilled = 0;
            this.setUpLevel(-1);
            this.numEnemiesKilledText = this.add.text(240, 20, "", {fontFamily: "NoPixel", fontSize: "16px", color: "white"});
            this.numEnemiesKilledText.setScrollFactor(0, 0);
        } else {
            this.numEnemiesRemaining;
            this.setUpLevel(this.player.day);
            this.numEnemiesRemainingText = this.add.text(240, 20, "", {fontFamily: "NoPixel", fontSize: "16px", color: "white"});
            this.numEnemiesRemainingText.setScrollFactor(0, 0);
            this.endTimer = null;
        }

        // Set up camera
        this.cameras.main.startFollow(this.player.getSprite());
        if(this.endless){
            // TODO - make this bigger maybe?
            this.cameras.main.setBounds(0, 0, 2*480, 2*270);
        } else {
            this.cameras.main.setBounds(0, 0, 2*480, 2*270);
        }

        this.setUpControls();

        this.initPauseMenu();

        this.initPlayerHealth();

        space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        esc = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

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
        if(this.playerIsDead){
            if(!this.killedPlayer){
                this.killPlayer()
                this.killedPlayer= true;
            }
            return;
        }
        if(this.bossIsDead){
            if(!this.startedBossEnd){
                this.game.music.stop();
                this.startedBossEnd = true;
                // Start end sequence
                this.cameras.main.shake(2000, 0.001, true);
                this.time.addEvent({
                    delay: 2000,
                    callback: () => {
                        this.cameras.main.shake(2000, 0.005, true);
                        },
                    loop: false
                });
                this.time.addEvent({
                    delay: 4000,
                    callback: () => {
                        this.cameras.main.shake(2000, 0.01, true);
                    },
                    loop: false
                });

                this.time.addEvent({
                    delay: 6000,
                    callback: () => {
                        let blackScreen = this.add.graphics();
                        blackScreen.fillStyle(0x000000);
                        blackScreen.fillRect(0, 0, 480, 270);
                        blackScreen.setScrollFactor(0, 0);
                        blackScreen.depth = 2000;
                    },
                    loop: false
                });

                this.time.addEvent({
                    delay: 10000,
                    callback: () => {
                        this.goToScene("GameWin")},
                    loop: false
                });
            }
        }

        if(this.bossIntoPhase2){
            this.bossIntoPhase2 = false;
            this.bossTransition = true;
            this.phase2StartTime = this.time.now + 3000;
            this.playerHealthBar.clear();
            this.playerHealthBox.clear();
            if(this.cooldownBar){
                this.cooldownBar.clear();
                this.cooldownBox.clear();
            }
            // Show phase 2 screen
            this.chadBackground = this.add.sprite(0, 0, 'fire').setOrigin(0,0);
            this.chadBackground.anims.play("fire", true);
            this.chadBackground.setScrollFactor(0, 0);
            this.chadSprite = this.add.sprite(0, 0, 'chad-art').setOrigin(0, 0);
            this.chadSprite.setScrollFactor(0, 0);
        }
        
        if(this.bossTransition){
            if(this.phase2StartTime < this.time.now){
                this.bossIntoPhase2 = false;
                this.chadBackground.destroy();
                this.chadSprite.destroy();
                this.bossTransition = false;
            }
            return;
        }

        if (Phaser.Input.Keyboard.JustDown(esc)){
            // Pause Game
            this.pauseGame(true);
        }
        if(!this.hasStarted){
            if(this.player.day === 3){
                if(this.countdownTimer === null){
                    this.anims.create({
                        key: "fire",
                        frames: this.anims.generateFrameNumbers("chad-background", {
                            start: 0,
                            end: 7
                        }),
                        frameRate: 10,
                        repeat: -1
                    });
                    this.chadBackground = this.add.sprite(0, 0, 'fire').setOrigin(0,0);
                    this.chadBackground.anims.play("fire", true);
                    this.chadBackground.setScrollFactor(0, 0);
                    this.chadSprite = this.add.sprite(0, 0, 'chad-art').setOrigin(0, 0);
                    this.chadSprite.setScrollFactor(0, 0);
                    this.countdownTimer = this.time.now + 3000;
                } else {
                    if(this.countdownTimer < this.time.now){
                        this.hasStarted = true;
                        this.chadBackground.destroy();
                        this.chadSprite.destroy();
                    }
                }
                return;
            }

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
            // Do UI
            if(this.endless){
                this.handleNumEnemiesKilled();
            } else {
                this.handleNumEnemiesRemaining();
            }

            // Do player stuff
            this.updatePlayer();
            this.handlePlayerActiveSkills();

            // Spawn enemies
            if(this.endless){
                this.spawnEnemies();
            }

            // Do enemy behaviors
            this.fEnemyManager.doBehaviors();
            this.mEnemyManager.doBehaviors();
            this.oEnemyManager.doBehaviors();
            this.bombManager.doBehaviors();
            this.bossManager.doBehaviors();
        }
    }

    spawnEnemies(){
        for(let i = 0; i < this.spawnLocations.length; i++){
            if(Math.random() < this.spawnChance){
                let enemyData = this.spawnLocations[i];
                let x = enemyData.x;
                let y = enemyData.y;
                switch(enemyData.enemy){
                    case 'F':
                        // Create female enemy
                        this.fEnemyManager.requestEnemy(x, y, new FireShotgunAtPlayerBehavior(this.player, this, this.slowerEnemies ? 50 : 100), this.weakEnemy=="pink" ? 300-this.player.stats.flirt : 600-this.player.stats.flirt, 50, this.enemyScale ? this.enemyScale : 1);
                        break;
                    case 'M':
                        // Create male enemy
                        this.mEnemyManager.requestEnemy(x, y, new FireAtPlayerBehavior(this.player, this, this.slowerEnemies ? 50 : 100), this.weakEnemy=="blue" ? 300-this.player.stats.flirt : 600-this.player.stats.flirt, 50, this.enemyScale ? this.enemyScale : 1);
                        break;
                    case 'O':
                        // Create other enemy
                        this.oEnemyManager.requestEnemy(x, y, new ExplodeOnPlayerBehavior(this.player, this, this.slowerEnemies ? 50 : 100), this.weakEnemy=="purple" ? 300-this.player.stats.flirt : 600-this.player.stats.flirt, 50, this.enemyScale ? this.enemyScale : 1);
                        break;
                    default:
                        break;
                }
            }
        }
    }

    handlePlayerActiveSkills(){
        // Check for special keyboard inputs
        if(this.activeAOEDamage || this.activeFreeze || this.invisiblePlayer){
            this.spacebarCooldown--;
            this.updateCooldownGraphic();
        }
        if (Phaser.Input.Keyboard.JustDown(space) && this.spacebarCooldown < 0){
            if(this.activeAOEDamage || this.activeFreeze || this.invisiblePlayer){
                // Play animation
                this.playerSpaceSprite.setPosition(this.player.getCenter().x, this.player.getCenter().y);
                this.playerSpaceSprite.anims.play("explode");
                this.playerSpaceSprite.on('animationcomplete', (animation, frame) => {
                    if(animation.key === "explode"){
                        this.playerSpaceSprite.anims.play("not_exploding");
                    } 
                });
            }
            if (this.activeFreeze){
                this.fEnemyGroup.children.iterate((enemy) => {if (enemy.isAlive){enemy.freezeDuration = 180;}});
                this.mEnemyGroup.children.iterate((enemy) => {if (enemy.isAlive){enemy.freezeDuration = 180;}});
                this.oEnemyGroup.children.iterate((enemy) => {if (enemy.isAlive){enemy.freezeDuration = 180;}});
                this.bossGroup.children.iterate((enemy) => {if (enemy.isAlive){enemy.freezeDuration = 180;}});
            }
            if (this.activeAOEDamage){
                this.fEnemyGroup.children.iterate((enemy) => {
                    if (enemy.isAlive){
                        if (Phaser.Math.Distance.Squared(enemy.getCenter().x,enemy.getCenter().y, this.player.getCenter().x, this.player.getCenter().y)<= this.activeAOEDamageRadius*this.activeAOEDamageRadius){
                            enemy.health-=this.activeAOEDamageAmount;
                            if(enemy.health <= 0){
                                this.fEnemyManager.killEnemy(enemy);
                                this.numEnemiesRemaining--;
                            }
                        }
                    }
                });
                this.mEnemyGroup.children.iterate((enemy) => {
                    if (enemy.isAlive){
                        if (Phaser.Math.Distance.Squared(enemy.getCenter().x,enemy.getCenter().y, this.player.getCenter().x, this.player.getCenter().y)<= this.activeAOEDamageRadius*this.activeAOEDamageRadius){
                            enemy.health-=this.activeAOEDamageAmount;
                            if(enemy.health <= 0){
                                this.mEnemyManager.killEnemy(enemy);
                                this.numEnemiesRemaining--;
                            }
                        }
                    }
                });
                this.oEnemyGroup.children.iterate((enemy) => {
                    if (enemy.isAlive){
                        if (Phaser.Math.Distance.Squared(enemy.getCenter().x,enemy.getCenter().y, this.player.getCenter().x, this.player.getCenter().y)<= this.activeAOEDamageRadius*this.activeAOEDamageRadius){
                            enemy.health-=this.activeAOEDamageAmount;
                            if(enemy.health <= 0){
                                this.oEnemyManager.killEnemy(enemy);
                                this.numEnemiesRemaining--;
                            }
                        }
                    }
                });
                this.bossGroup.children.iterate((enemy) => {
                    if (enemy.isAlive){
                        if (Phaser.Math.Distance.Squared(enemy.getCenter().x,enemy.getCenter().y, this.player.getCenter().x, this.player.getCenter().y)<= this.activeAOEDamageRadius*this.activeAOEDamageRadius){
                            enemy.health-=this.activeAOEDamageAmount;
                            if(enemy.health <= 0){
                                enemy.health = 1;
                            }
                        }
                    }
                });
            }
            if(this.invisiblePlayer){
                console.log("triggerInvis")
                this.player.isInvisible = true;
                this.player.invisibilityCountdownTimer = this.time.now + 5000;
                this.player.getSprite().alpha = 0.2;
            }
            this.spacebarCooldown = 1000;
        }

        // Check for random enemy death perk
        if(this.randomEnemyDeath){
            let chance = Math.random();
            let group;
            let em;
            if(chance < 0.33){
                group = this.fEnemyGroup;
                em = this.fEnemyManager;
            } else if(chance < 0.66){
                group = this.mEnemyGroup;
                em = this.mEnemyManager;
            } else {
                group = this.oEnemyGroup;
                em = this.oEnemyManager;
            }

            let killedEnemy = false;
            group.children.iterate((enemy) => {
                if(!killedEnemy && enemy.isAlive && Math.random() < 0.0005){
                    console.log("Killed Enemy");
                    em.killEnemy(enemy);
                    this.numEnemiesRemaining--;
                    killedEnemy = true;
                }
            });
        }
    }

    handleNumEnemiesKilled(){
        this.numEnemiesKilledText.text = "Enemies Killed: " + this.numEnemiesKilled;
        this.numEnemiesKilledText.setOrigin(0.5, 0.5);
    }

    handleNumEnemiesRemaining(){
        if(this.player.day !== 3){
            this.numEnemiesRemainingText.text = "Enemies Remaining: " + this.numEnemiesRemaining;
            this.numEnemiesRemainingText.setOrigin(0.5, 0.5);
        }
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
                if(this.player.day === 3){
                    // You've won (for now) TODO: finish this
                    this.goToScene("GameWin");
                } else {
                    this.goToScene("EndOfDay");
                }
            }    
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
            key: "heart",
            frames: this.anims.generateFrameNumbers("bullet", {
                start: 4,
                end: 7
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
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: "player_walk",
            frames: this.anims.generateFrameNumbers("bhPlayer", {
                start: 0,
                end: 6
            }),
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: "player_damage",
            frames: this.anims.generateFrameNumbers("bhPlayer", {
                start: 7,
                end: 12
            }),
            frameRate: 8,
            repeat: 0
        });
        this.anims.create({
            key: "player_death",
            frames: this.anims.generateFrameNumbers("bhPlayer", {
                start: 13,
                end: 19
            }),
            frameRate: 8,
            repeat: 0
        });
        this.anims.create({
            key: "player_dead",
            frames: this.anims.generateFrameNumbers("bhPlayer", {
                start: 19,
                end: 19
            }),
            frameRate: 1,
            repeat: -1
        });
        this.anims.create({
            key: "player_front_walk",
            frames: this.anims.generateFrameNumbers("bhPlayer", {
                start: 20,
                end: 27
            }),
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: "player_front_damage",
            frames: this.anims.generateFrameNumbers("bhPlayer", {
                start: 28,
                end: 31
            }),
            frameRate: 8,
            repeat: 0
        });
        this.anims.create({
            key: "player_back_walk",
            frames: this.anims.generateFrameNumbers("bhPlayer", {
                start: 32,
                end: 38
            }),
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: "player_back_damage",
            frames: this.anims.generateFrameNumbers("bhPlayer", {
                start: 39,
                end: 43
            }),
            frameRate: 8,
            repeat: 0
        });

        //

        this.anims.create({
            key: "fEnemy_idle",
            frames: this.anims.generateFrameNumbers("fEnemy", {
            start: 45,
            end: 61
            }),
            frameRate: 12,
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
            frameRate: 16,
            repeat: 0
        });
        this.anims.create({
            key: "fEnemy_death",
            frames: this.anims.generateFrameNumbers("fEnemy", {
                start: 18,
                end: 26
            }),
            frameRate: 8,
            repeat: 0
        });
        this.anims.create({
            key: "fEnemy_front_walk",
            frames: this.anims.generateFrameNumbers("fEnemy", {
                start: 27,
                end: 33
            }),
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: "fEnemy_front_damage",
            frames: this.anims.generateFrameNumbers("fEnemy", {
                start: 34,
                end: 37
            }),
            frameRate: 8,
            repeat: 0
        });
        this.anims.create({
            key: "fEnemy_back_walk",
            frames: this.anims.generateFrameNumbers("fEnemy", {
                start: 38,
                end: 44
            }),
            frameRate: 8,
            repeat: -1
        });

        //

        this.anims.create({
            key: "mEnemy_idle",
            frames: this.anims.generateFrameNumbers("mEnemy", {
                start: 47,
                end: 55
            }),
            frameRate: 8,
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
            frameRate: 16,
            repeat: 0
        });
        this.anims.create({
            key: "mEnemy_death",
            frames: this.anims.generateFrameNumbers("mEnemy", {
                start: 18,
                end: 26
            }),
            frameRate: 8,
            repeat: 0
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
        this.anims.create({
            key: "mEnemy_front_damage",
            frames: this.anims.generateFrameNumbers("mEnemy", {
                start: 35,
                end: 38
            }),
            frameRate: 8,
            repeat: 0
        });
        this.anims.create({
            key: "mEnemy_back_walk",
            frames: this.anims.generateFrameNumbers("mEnemy", {
                start: 39,
                end: 46
            }),
            frameRate: 8,
            repeat: -1
        });

        //

        this.anims.create({
            key: "oEnemy_idle",
            frames: this.anims.generateFrameNumbers("oEnemy", {
                start: 53,
                end: 69
            }),
            frameRate: 8,
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
            frameRate: 16,
            repeat: 0
        });
        this.anims.create({
            key: "oEnemy_death",
            frames: this.anims.generateFrameNumbers("oEnemy", {
                start: 18,
                end: 32
            }),
            frameRate: 8,
            repeat: 0
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
        this.anims.create({
            key: "oEnemy_front_damage",
            frames: this.anims.generateFrameNumbers("oEnemy", {
                start: 41,
                end: 44
            }),
            frameRate: 8,
            repeat: 0
        });
        this.anims.create({
            key: "oEnemy_back_walk",
            frames: this.anims.generateFrameNumbers("oEnemy", {
                start: 45,
                end: 52
            }),
            frameRate: 8,
            repeat: -1
        });

        // Boss
        this.anims.create({
            key: "boss_idle",
            frames: this.anims.generateFrameNumbers("boss", {
                start: 0,
                end: 0
            }),
            frameRate: 0,
            repeat: -1
        });
        this.anims.create({
            key: "boss_front",
            frames: this.anims.generateFrameNumbers("boss", {
                start: 0,
                end: 0
            }),
            frameRate: 0,
            repeat: -1
        });
        this.anims.create({
            key: "boss_front_walk",
            frames: this.anims.generateFrameNumbers("boss", {
                start: 0,
                end: 7
            }),
            frameRate: 0,
            repeat: -1
        });
        this.anims.create({
            key: "boss_front_damage",
            frames: this.anims.generateFrameNumbers("boss", {
                start: 8,
                end: 12
            }),
            frameRate: 8,
            repeat: 0
        });
        this.anims.create({
            key: "boss_death",
            frames: this.anims.generateFrameNumbers("boss", {
                start: 13,
                end: 23
            }),
            frameRate: 2,
            repeat: 0
        });
        this.anims.create({
            key: "boss_dead",
            frames: this.anims.generateFrameNumbers("boss", {
                start: 23,
                end: 23
            }),
            frameRate: 2,
            repeat: 0
        });
        this.anims.create({
            key: "boss_walk",
            frames: this.anims.generateFrameNumbers("boss", {
                start: 24,
                end: 29
            }),
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: "boss_damage",
            frames: this.anims.generateFrameNumbers("boss", {
                start: 30,
                end: 34
            }),
            frameRate: 8,
            repeat: 0
        });
        this.anims.create({
            key: "boss_back",
            frames: this.anims.generateFrameNumbers("boss", {
                start: 3,
                end: 3
            }),
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: "boss_back_walk",
            frames: this.anims.generateFrameNumbers("boss", {
                start: 44,
                end: 52
            }),
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: "boss_back_damage",
            frames: this.anims.generateFrameNumbers("boss", {
                start: 53,
                end: 57
            }),
            frameRate: 8,
            repeat: 0
        });

        this.anims.create({
            key: "bomb_normal",
            frames: this.anims.generateFrameNumbers("bomb", {
                start: 0,
                end: 1
            }),
            frameRate: 16,
            repeat: -1
        });
        this.anims.create({
            key: "bomb_detonating",
            frames: this.anims.generateFrameNumbers("bomb", {
                start: 2,
                end: 3
            }),
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: "bomb_death",
            frames: this.anims.generateFrameNumbers("bomb", {
                start: 2,
                end: 2
            }),
            frameRate: 8,
            repeat: 0
        });
        this.anims.create({
            key: "not_exploding",
            frames: this.anims.generateFrameNumbers("explosion", {
                start: 0,
                end: 0
            }),
            frameRate: 0,
            repeat: -1
        })
        this.anims.create({
            key: "explode",
            frames: this.anims.generateFrameNumbers("explosion", {
            start: 0,
            end: 5
            }),
            frameRate: 40,
            repeat: 0
        });
    }

    createGroups(){
        this.playerBullets = this.physics.add.group();
        this.enemyBullets = this.physics.add.group();
        this.fEnemyGroup = this.physics.add.group();
        this.mEnemyGroup = this.physics.add.group();
        this.oEnemyGroup = this.physics.add.group();
        this.bossGroup = this.physics.add.group();
        this.bombGroup = this.physics.add.group();
        this.walls = this.physics.add.staticGroup();
    }

    setUpCollisions(){
        this.physics.add.collider(this.fEnemyGroup, this.walls);
        this.physics.add.collider(this.mEnemyGroup, this.walls);
        this.physics.add.collider(this.oEnemyGroup, this.walls);
        this.physics.add.collider(this.player.getSprite(), this.walls);
        this.physics.add.collider(this.bossGroup, this.walls);

        this.playerBulletManager.setCollisionData([{
            otherGroup: this.fEnemyGroup,
            callback: (enemy, bullet) => {
                if(enemy.isDying){
                    return;
                }
                enemy.anims.play(enemy.spriteName + enemy.way + '_damage', true);
                enemy.on("animationcomplete", () => enemy.anims.play(enemy.spriteName + enemy.way + '_walk', true));
              enemy.health -= bullet.damage;
              this.sound.play("EnemyTakingDamageSFX");
              if (enemy.health <= 0){
                this.fEnemyManager.killEnemy(enemy);
                this.numEnemiesRemaining--;
              }
              if (this.player.bulletStun){
                let rand = Math.random();
                if (rand < 0.1){
                  enemy.stunDuration = 90;
                }
              }
            }
        },
        {
            otherGroup: this.mEnemyGroup,
            callback: (enemy, bullet) => {
                if(enemy.isDying){
                    return;
                }
                enemy.anims.play(enemy.spriteName + enemy.way + '_damage', true);
                enemy.on("animationcomplete", () => enemy.anims.play(enemy.spriteName + enemy.way + '_walk', true));
              enemy.health -= bullet.damage;
              this.sound.play("EnemyTakingDamageSFX");
              if (enemy.health <= 0){
                this.mEnemyManager.killEnemy(enemy);
                this.numEnemiesRemaining--;
              }
              if (this.player.bulletStun){
                let rand = Math.random();
                if (rand < 0.1){
                  enemy.stunDuration = 90;
                }
              }
            }
        },
        {
            otherGroup: this.oEnemyGroup,
            callback: (enemy, bullet) => {
                if(enemy.isDying){
                    return;
                }
                enemy.anims.play(enemy.spriteName + enemy.way + '_damage', true);
                enemy.on("animationcomplete", () => enemy.anims.play(enemy.spriteName + enemy.way + '_walk', true));
              enemy.health -= bullet.damage;
              this.sound.play("EnemyTakingDamageSFX");
              if (enemy.health <= 0){
                this.oEnemyManager.killEnemy(enemy);
                this.numEnemiesRemaining--;
              }
              if (this.player.bulletStun){
                let rand = Math.random();
                if (rand < 0.1){
                  enemy.stunDuration = 90;
                }
              }
            }
        },
        {
            otherGroup: this.bossGroup,
            callback: (enemy, bullet) => {
                if(enemy.isDying){
                    return;
                }
                // TODO: Figure out a better system than this
                if(enemy.anims.getCurrentKey() === "boss_idle"){
                    enemy.way = "_front"
                }
                enemy.anims.play("boss" + enemy.way + '_damage', true);
                enemy.on("animationcomplete", () => {
                    if(enemy.anims.getCurrentKey().includes("damage")){
                        enemy.anims.play("boss_idle", true)
                    }
                });
                enemy.health -= bullet.damage;
                this.sound.play("EnemyTakingDamageSFX");
                if (enemy.health <= 0){
                    this.bossManager.killBoss(enemy);
                    //this.numEnemiesRemaining--;
                    this.bossIsDead = true;
                } else if(enemy.health <= enemy.maxHealth/2 && !enemy.inPhase2){
                    this.bossIntoPhase2 = true;
                    enemy.behavior = new Phase2(this.player, this, 100);
                    enemy.behavior.setUpEnemy(enemy);
                    enemy.healthBox.clear();
                    enemy.healthBar.clear();
                    enemy.inPhase2 = true;
                    let songName = "BossPhase2"
                    if(this.game.music && this.game.music.isPlaying){
                        if(this.game.music.songName !== songName){
                            this.game.music.stop();
                            this.game.music = this.sound.add(songName, {loop: true});
                            this.game.music.play();
                            this.game.music.isPlaying = true;
                            this.game.music.songName = songName
                        }
                    } else {
                        this.game.music = this.sound.add(songName, {loop: true});
                        this.game.music.play();
                        this.game.music.isPlaying = true;
                        this.game.music.songName = songName
                    }
                }
                if (this.player.bulletStun){
                    let rand = Math.random();
                    if (rand < 0.05){
                        enemy.stunDuration = 50;
                    }
                }
            }
        },
        {
            otherGroup: this.walls,
            callback: (wall, bullet) => {}
        }]);

        this.fEnemyBulletManager.setCollisionData([{
            otherGroup: this.player.getSprite(),
            callback: (playerSprite, bullet) => {
                this.player.getSprite().anims.stop();
                this.player.getSprite().anims.play("player" + this.player.way + '_damage', true);
                this.player.getSprite().on("animationcomplete", () => {
                    if(this.player.getSprite().anims.getCurrentKey().includes("damage")){
                        this.player.getSprite().anims.play("player" + this.player.way + '_walk', true)
                    }
                });
                this.player.health -= bullet.damage;
                this.sound.play("PlayerTakingDamageSFX")
                if (this.player.health <= 0){
                    this.playerIsDead = true;
                }
            }
        },
        {
            otherGroup: this.walls,
            callback: (wall, bullet) => {}
        }]);

        this.mEnemyBulletManager.setCollisionData([{
            otherGroup: this.player.getSprite(),
            callback: (playerSprite, bullet) => {
                this.player.getSprite().anims.stop();
                this.player.getSprite().anims.play("player" + this.player.way + '_damage', true);
                this.player.getSprite().on("animationcomplete", () => {
                    if(this.player.getSprite().anims.getCurrentKey().includes("damage")){
                        this.player.getSprite().anims.play("player" + this.player.way + '_walk', true)
                    }
                });
                this.player.health -= bullet.damage,
                this.sound.play("PlayerTakingDamageSFX")
                if (this.player.health <= 0){
                    this.playerIsDead = true;
                }
            }
        },
        {
            otherGroup: this.walls,
            callback: (wall, bullet) => {}
        }]);

        this.oEnemyBulletManager.setCollisionData([{
            otherGroup: this.player.getSprite(),
            callback: (playerSprite, bullet) => {
                this.player.getSprite().anims.stop();
                this.player.getSprite().anims.play("player" + this.player.way + '_damage', true);
                this.player.getSprite().on("animationcomplete", () => {
                    if(this.player.getSprite().anims.getCurrentKey().includes("damage")){
                        this.player.getSprite().anims.play("player" + this.player.way + '_walk', true)
                    }
                });
                this.player.health -= bullet.damage;
                this.sound.play("PlayerTakingDamageSFX")
                if (this.player.health <= 0){
                    this.playerIsDead = true;
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
        console.log("bulletScale: ", this.bulletScale);
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
        this.fEnemyBulletManager = new BulletManager(
            300,
            this,
            "bullet",
            this.enemyBullets,
            [],
            500,
            0.7*this.enemyScale
        );

        // Enemy bullet manager
        this.mEnemyBulletManager = new BulletManager(
            300,
            this,
            "bullet",
            this.enemyBullets,
            [],
            1000,
            this.enemyScale
        );

        // Enemy bullet manager
        this.oEnemyBulletManager = new BulletManager(
            300,
            this,
            "bullet",
            this.enemyBullets,
            [],
            1000,
            this.enemyScale
        );

        this.bossBulletManager = new BulletManager(
            300,
            this,
            "bullet",
            this.enemyBullets,
            [],
            5000,
            1
        );

        this.bombBulletManager = new BulletManager(
            300,
            this,
            "bullet",
            this.enemyBullets,
            [],
            500,
            1
        );
    }

    setUpEnemies(){
        this.fEnemyManager = new EnemyManager(100, this, "fEnemy", this.fEnemyGroup, this.fEnemyBulletManager);
        this.mEnemyManager = new EnemyManager(100, this, "mEnemy", this.mEnemyGroup, this.mEnemyBulletManager);
        this.oEnemyManager = new EnemyManager(100, this, "oEnemy", this.oEnemyGroup, this.oEnemyBulletManager);
        this.bombManager = new EnemyManager(100, this, "bomb", this.bombGroup, this.bombBulletManager);
        this.bossManager = new BossManager(this, "boss", this.bossGroup, this.bossBulletManager, this.player, this.bombManager, [this.fEnemyManager, this.mEnemyManager, this.oEnemyManager]);
    }

    setUpLevel(day){
        let level;
        switch(day){
            case -1:
                // Endless level
                level = endless;
                break;
            case 0:
                level = level1;
                break;
            case 1:
                level = level2;
                break;
            case 2:
                level = level3;
                break;
            case 3:
                level = boss;
                break;
            default:
                level = level1;
        }

        this.numEnemiesRemaining = 0;

        let numCols = 30;
        let cellSize = 32;
        let row;
        let col;
        let x;
        let y;
        let type;
        for(let i = 0; i < level.length; i++){
            row = Math.floor(i/numCols);
            col = i%numCols;
            x = col*cellSize;
            y = row*cellSize;
            type = level.charAt(i);
            switch(type){
                case 'W':
                    this.addWall(x, y, "wall");
                    break;
                case 'L':
                    this.addWall(x, y, "left-wall");
                    break;
                case 'R':
                    this.addWall(x, y, "right-wall");
                    break;
                case 'V':
                    this.addWall(x, y, "vertical-wall");
                    break;
                case 'H':
                    this.addWall(x, y, "horizontal-wall");
                    break;
                case 'T':
                    this.addWall(x, y, "top-wall");
                    break;
                case 'B':
                    this.addWall(x, y, "bot-wall");
                    break;
                case '1':
                    this.addWall(x, y, "TL-wall");
                    break;
                case '2':
                    this.addWall(x, y, "TR-wall");
                    break;
                case '3':
                    this.addWall(x, y, "BL-wall");
                    break;
                case '4':
                    this.addWall(x, y, "BR-wall");
                    break;
                case 'F':
                    // Create female enemy
                    this.fEnemyManager.requestEnemy(x, y, new FireShotgunAtPlayerBehavior(this.player, this, this.slowerEnemies ? 50 : 100), this.weakEnemy=="pink" ? 300-this.player.stats.flirt : 600-this.player.stats.flirt, 50, this.enemyScale ? this.enemyScale : 1);
                    this.numEnemiesRemaining++;
                    break;
                case 'M':
                    // Create male enemy
                    this.mEnemyManager.requestEnemy(x, y, new FireAtPlayerBehavior(this.player, this, this.slowerEnemies ? 50 : 100), this.weakEnemy=="blue" ? 300-this.player.stats.flirt : 600-this.player.stats.flirt, 50, this.enemyScale ? this.enemyScale : 1);
                    this.numEnemiesRemaining++;
                    break;
                case 'O':
                    // Create other enemy
                    this.oEnemyManager.requestEnemy(x, y, new ExplodeOnPlayerBehavior(this.player, this, this.slowerEnemies ? 50 : 100), this.weakEnemy=="purple" ? 300-this.player.stats.flirt : 600-this.player.stats.flirt, 50, this.enemyScale ? this.enemyScale : 1);
                    this.numEnemiesRemaining++;
                    break;
                case 'P':
                    // Move player
                    this.player.getSprite().setPosition(x, y);
                    break;
                case 'f':
                    // Create female enemy spawner
                    this.spawnLocations.push({enemy: 'F', x: x, y: y});
                    break;
                case 'm':
                    // Create male enemy spawner
                    this.spawnLocations.push({enemy: 'M', x: x, y: y});
                    break;
                case 'o':
                    // Create other enemy spawner
                    this.spawnLocations.push({enemy: 'O', x: x, y: y});
                    break;
                case 'C':
                    // Spawn the final boss
                    this.bossManager.requestBoss(x, y);
                    this.numEnemiesRemaining++;
                default:
                    // Do nothing
            }
        }
    }

    setUpControls(){
        // Set up key controls
        this.input.keyboard.on("keydown", (event) => {
            if("wasd".includes(event.key)){
                this.player.dir = event.key;
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

    addWall(x, y, key){
        let wall = this.walls.create(x, y, key);
    }

    updatePlayer(){
        this.movePlayer();
        this.playerFireBullet();

        if(!this.player.getSprite().anims.getCurrentKey().includes("damage")){
            this.player.getSprite().anims.play('player' + this.player.way + '_walk', true);
        }

        if(this.player.isInvisible && this.time.now >= this.player.invisibilityCountdownTimer){
            this.player.isInvisible = false;
            this.player.getSprite().alpha = 1;
        }

        // Player Health
        this.playerHealthBox.clear()
        this.playerHealthBox.lineStyle(2, 0xFFFFFF);
        this.playerHealthBox.strokeRect(5, 5, 200, 10);
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

    killPlayer(){
        // Stop all enemies
        this.fEnemyGroup.children.iterate((enemy) => {enemy.behavior.setEnemyVelocity(enemy, 0, 0)})
        this.mEnemyGroup.children.iterate((enemy) => {enemy.behavior.setEnemyVelocity(enemy, 0, 0)})
        this.oEnemyGroup.children.iterate((enemy) => {enemy.behavior.setEnemyVelocity(enemy, 0, 0)})
        this.bossGroup.children.iterate(  (enemy) => {enemy.behavior.setEnemyVelocity(enemy, 0, 0)})

        // Player Health
        this.playerHealthBox.clear()
        this.playerHealthBox.lineStyle(2, 0xFFFFFF);
        this.playerHealthBox.strokeRect(5, 5, 200, 10);
        this.playerHealthBar.clear();
        this.playerHealthBar.fillStyle(0xFF0000);
        this.playerHealthBar.fillRect(5, 5, Math.ceil(200*this.player.getHealthPercent()), 10);
        this.player.setDirection(0, 0);
        this.player.getSprite().anims.play("player_death");
        this.player.getSprite().on("animationcomplete", () => {
            if(this.player.getSprite().anims.getCurrentKey() !== "player_dead"){
                this.player.getSprite().anims.play("player_dead", true);
            }
        });
        this.time.addEvent({
            delay: 4000,
            callback: () => {
                console.log("dead")
                this.goToScene("GameOver")},
            loop: false
        });
        let blackScreen = this.add.graphics();
        blackScreen.fillStyle(0x000000, 1);
        blackScreen.fillRect(0, 0, 480, 270);
        blackScreen.setScrollFactor(0, 0);
        blackScreen.alpha = 0;
        this.tweens.add({
            targets: blackScreen,
            alpha: {from: 0, to: 1},
            ease: "Quad",
            duration: 2000,
            delay: 2000,
            repeat: 0
        })
    }

    initPauseMenu(){
        this.initPauseButton();
        this.scene.launch("PauseMenu", {parent: this});
        this.scene.sleep("PauseMenu");
        this.scene.bringToTop("PauseMenu");
    }

    initPauseButton(){
        this.pauseButton = Button(this, 450, 10, "", "16px", "pause-symbol", 16, 16);
        this.pauseButton.setButtonColor("white");
        this.pauseButton.setButtonOnClick(() => this.pauseGame(true));
        this.pauseButton.buttonBackgroundImage.setScrollFactor(0, 0);
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

    goToHelp(){
        this.scene.sleep("PauseMenu");
        this.scene.launch("Help", {returnCallback: () => {
            this.scene.wake("PauseMenu");
            this.scene.stop("Help");
        }});
        this.scene.bringToTop("Help");
    }

    initPlayerHealth(){
        this.playerHealthBar = this.add.graphics();
        this.playerHealthBar.depth = 1000;
        this.playerHealthBar.setScrollFactor(0, 0);

        this.playerHealthBox = this.add.graphics();
        this.playerHealthBox.depth = 1000;
        this.playerHealthBox.setScrollFactor(0, 0);
    }

    initCooldownGraphic(){
        this.cooldownBar = this.add.graphics();
        this.cooldownBar.setScrollFactor(0, 0);
        this.cooldownBar.depth = 1000;

        this.cooldownBox = this.add.graphics();
        this.cooldownBox.setScrollFactor(0, 0);
        this.cooldownBox.depth = 1000;
    }

    updateCooldownGraphic(){
        this.cooldownBox.clear();
        this.cooldownBox.lineStyle(2, 0xFFFFFF);
        this.cooldownBox.strokeRect(5, 15, 100, 10);
        this.cooldownBar.clear();
        this.cooldownBar.fillStyle(0x0077FF);
        this.cooldownBar.fillRect(5, 15, Math.ceil((1000 - Phaser.Math.Clamp(this.spacebarCooldown, 0, 1000))/1000*100), 10);
    }

    initPlayerSkills(){
      let skills = this.player.skills;
      console.log(skills)
      this.spacebarCooldown = 0;
      if (skills[0] == "sf"){
        this.weakEnemy = "pink";
        if (skills[1] == "sf1"){
          this.player.speedBoost = 100;
          if (skills[2] == "sf11"){
            this.player.speedBoost = 200;
          }
          else if (skills[2] == "sf12"){
            //Active Invisibility
            //If player is invis. Have them stop shooting and wander randomly.
            this.invisiblePlayer = true;
            this.initCooldownGraphic();
          }
        }
        else if (skills[1] == "sf2"){
          this.player.bulletSpeedBoost = 250;
          if (skills[2] == "sf21"){
            this.player.bulletSpeedBoost = 500;
          }
          else if (skills[2] == "sf22"){
            this.player.bulletStun = true;
          }
        }
      }
      else if (skills[0] == "sm"){
        this.weakEnemy = "blue";
        if (skills[1] == "sm1"){
          this.player.damageBoost = 50;
          if (skills[2] == "sm11"){
            this.player.damageBoost = 100;
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
            this.initCooldownGraphic();
          }
        }
        else if (skills[1] == "sb2"){
          this.enemyScale = 0.7;
          if (skills[2] == "sb21"){
            //Random Enemy Death
            this.randomEnemyDeath = true;
            console.log("randomEnemyDeath");
          }
          else if (skills[2] == "sb22"){
            this.activeAOEDamage = true;
            this.activeAOEDamageRadius = 100;
            this.activeAOEDamageAmount = 200;
            this.initCooldownGraphic();
          }
        }
      }
    }

    startMusic(){
        let songName = "Battle";
        if(this.player.day === 3){
            songName = "BossPhase1";
        }

        if(this.game.music && this.game.music.isPlaying){
            if(this.game.music.songName !== songName){
                this.game.music.stop();
                this.game.music = this.sound.add(songName, {loop: true});
                this.game.music.play();
                this.game.music.isPlaying = true;
                this.game.music.songName = songName
            }
        } else {
            this.game.music = this.sound.add(songName, {loop: true});
            this.game.music.play();
            this.game.music.isPlaying = true;
            this.game.music.songName = songName
        }
    }
}
