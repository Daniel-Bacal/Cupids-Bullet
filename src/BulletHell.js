import Phaser from "phaser";
import BulletManager from "./controllers/BulletManager"

import Player from "../src/objects/Player";

const Vector2 = Phaser.Math.Vector2;

export default class BulletHell extends Phaser.Scene {
  constructor() {
    super({
      key: "BulletHell"
    });
    this.keysPressed = {w: 0, a: 0, s: 0, d: 0};
    this.player = new Player();
  }

  create() {
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

    let playerBullets = this.physics.add.group();

    this.playerBulletManager = new BulletManager(
      100, 
      this,
      "bullet",
      playerBullets,
      [],
      500,
      1000);

    this.playerSprite = this.physics.add.sprite(0, 0, "bhPlayer");
    this.playerSprite.setCollideWorldBounds(true);

    // TODO: put this in the player class
    this.player.lastBulletFired = -1000;
    this.player.bulletCoolDown = 200;

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

    //initial mouse click for first fire
    this.input.on("pointerdown", (event) => {
      this.mouseDown = true;
    })

    this.input.on("pointerup", (event) => {
      this.mouseDown = false;
    })
  }

  update(time, delta) {
    this.updatePlayer();
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

    this.playerSprite.setVelocity(directionX * this.player.speed, directionY * this.player.speed);
  }

  playerFireBullet(){
    if(this.mouseDown && this.time.now - this.player.lastBulletFired > this.player.bulletCoolDown){
      this.player.lastBulletFired = this.time.now

      let clickX = this.input.mousePointer.x;
      let clickY = this.input.mousePointer.y;
      
      let playerCenter = this.playerSprite.getCenter();

      //get normalized direction vecotr from player center to mouse click for bullet to travel
      let bulletDirection = new Vector2(clickX-playerCenter.x, clickY-playerCenter.y);

      bulletDirection.normalize();

      //bullet renders as a green square atm.
      this.playerBulletManager.requestBullet(playerCenter.x, playerCenter.y, bulletDirection.x, bulletDirection.y);
    }
  }
}
