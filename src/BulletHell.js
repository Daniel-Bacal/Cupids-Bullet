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
      200,
      1000);

    this.playerSprite = this.physics.add.sprite(0, 0, "bhPlayer");
    this.playerSprite.setCollideWorldBounds(true);

    this.directionX = 0;
    this.directionY = 0;

    this.input.keyboard.on("keydown", (event) => {
      if (event.key == "w"){
        console.log("asd");
        this.keysPressed.w = -1;
      }
      if (event.key == "a"){
        console.log("asd");
        this.keysPressed.a = -1;
      }
      if (event.key == "s"){
        console.log("asd");
        this.keysPressed.s = 1;
      }
      if (event.key == "d"){
        console.log("asd");
        this.keysPressed.d = 1;
      }
    });

    this.input.keyboard.on("keyup", (event) => {
      if (event.key == "w"){
        console.log("asdasd");
        this.keysPressed.w = 0;
      }
      if (event.key == "a"){
        console.log("asdasd");
        this.keysPressed.a = 0;
      }
      if (event.key == "s"){
        console.log("asdasd");
        this.keysPressed.s = 0;
      }
      if (event.key == "d"){
        console.log("asdasd");
        this.keysPressed.d = 0;
      }
    });

    this.input.on("pointerup", (pointer) => {
      let playerPos = this.playerSprite.getCenter();
      let dest = new Vector2(pointer.x, pointer.y);
      dest = dest.subtract(playerPos);
      dest = dest.normalize();
      this.playerBulletManager.requestBullet(playerPos.x, playerPos.y, dest.x, dest.y);
    });
  }

  update(time, delta) {

    this.directionX = this.keysPressed.a + this.keysPressed.d;
    this.directionY = this.keysPressed.w + this.keysPressed.s;

    if(this.directionX && this.directionY){
      this.directionX /= 1.414;
      this.directionY /= 1.414;
    }

    this.playerSprite.setVelocity(this.directionX * this.player.speed,
      this.directionY * this.player.speed);

  }
}
