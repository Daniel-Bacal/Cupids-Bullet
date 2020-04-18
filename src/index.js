import "./styles.css";
import Phaser from "phaser";
import SplashScreen from "./SplashScreen.js"
import MainMenu from "./MainMenu.js";
import Boot from "./Boot.js"
import Backstory from "./Backstory"
import Controls from "./Controls";
import Login from "./Login";

const config = {
  type: Phaser.AUTO,
  scale: {
    parent: "game-container",
    zoom: 2,
    width: 480,
    height: 270,
    autoCenter: Phaser.DOM.CENTER_BOTH,
    mode: Phaser.Scale.NONE
  },
  backgroundColor: 0x444444,
  pixelArt: true,
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
      gravity: { y: 200 }
    }
  },
  plugins: ['SceneManager'],
  scene: [Boot, SplashScreen, MainMenu, Backstory, Controls, Login]
};


// Automatically uses Boot I guess? I'm not really sure why
new Phaser.Game(config);
