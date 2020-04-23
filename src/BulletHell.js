import Phaser from "phaser";

export default class BulletHell extends Phaser.Scene {
  constructor() {
    super({
      key: "BulletHell"
    });
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
  }

  update(time, delta) {}
}
