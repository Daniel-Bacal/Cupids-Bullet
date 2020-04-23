import Phaser from "phaser";
import Player from "../src/objects/Player";

export default class BulletHell extends Phaser.Scene {
  constructor() {
    super({
      key: "BulletHell"
    });
    this.keysPressed = {w: 0, a: 0, s: 0, d: 0};
    this.player = new Player();
  }

  create() {

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
