import Phaser from "phaser";
import Player from "../src/objects/Player";

var pointer;
var bulletSpeed = 180;

export default class BulletHell extends Phaser.Scene {
  constructor() {
    super({
      key: "BulletHell"
    });
    this.keysPressed = {w: 0, a: 0, s: 0, d: 0};
    this.player = new Player();
  }

  create() {
    this.anims.create("bullet", {
      key: "blue",
      frames: this.anims.generateFrameNumbers("bullet", {
        start: 0,
        end: 1
      }),
      frameRate: 20,
      repeat: -1
    });

    this.anims.create("bullet", {
      key: "red",
      frames: this.anims.generateFrameNumbers("bullet", {
        start: 2,
        end: 3
      }),
      frameRate: 20,
      repeat: -1
    });

    this.bullets = this.physics.add.group();

    this.playerSprite = this.physics.add.sprite(0, 0, "bhPlayer");
    this.playerSprite.setCollideWorldBounds(true);

    this.directionX = 0;
    this.directionY = 0;

    this.input.keyboard.on("keydown", (event) => {
      if (event.key == "w"){
        this.keysPressed.w = -1;
      }
      if (event.key == "a"){
        this.keysPressed.a = -1;
      }
      if (event.key == "s"){
        this.keysPressed.s = 1;
      }
      if (event.key == "d"){
        this.keysPressed.d = 1;
      }
    });

    this.input.keyboard.on("keyup", (event) => {
      if (event.key == "w"){
        this.keysPressed.w = 0;
      }
      if (event.key == "a"){
        this.keysPressed.a = 0;
      }
      if (event.key == "s"){
        this.keysPressed.s = 0;
      }
      if (event.key == "d"){
        this.keysPressed.d = 0;
      }
    });

    pointer = this.input.activePointer;

    //initial mouse click for first fire
    this.input.on("pointerdown", (event) => {
      let clickX = event.x;
      let clickY = event.y;
      let playerCenter = this.playerSprite.getCenter();

      //get normalized direction vecotr from player center to mouse click for bullet to travel
      let bulletDirection = new Phaser.Math.Vector2(clickX-playerCenter.x, clickY-playerCenter.y);

      bulletDirection.normalize();

      //bullet renders as a green square atm.
      let bullet = this.physics.add.sprite(playerCenter.x, playerCenter.y, "bullet");

      this.bullets.add(bullet);

      bullet.setVelocity(bulletDirection.x * bulletSpeed, bulletDirection.y * bulletSpeed);

    })

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


    //For rapid fire when mouse is held down
    /**if (pointer.isDown) {
      let clickX = pointer.x;
      let clickY = pointer.y;
    }*/
  }
}
