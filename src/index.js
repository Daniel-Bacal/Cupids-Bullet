import "./styles.css";
import Phaser from "phaser";
import SplashScreen from "./main_menu/SplashScreen.js";
import MainMenu from "./main_menu/MainMenu.js";
import Boot from "./Boot.js"
import Backstory from "./main_menu/Backstory"
import Controls from "./main_menu/Controls";
import Login from "./main_menu/Login";
import Signup from "./main_menu/Signup";
import About from "./main_menu/About";
import LevelSelect from "./main_menu/LevelSelect";
import DatingSim from "./DatingSim";
import Home from "./tabs/Home"
import Matches from "./tabs/Matches"
import Gym from "./tabs/Gym"
import Haikus from "./tabs/Haikus"
import Jokes from "./tabs/Jokes"
import Math from "./tabs/Math"
import Ads from "./tabs/Ads"
import PauseMenu from "./tabs/PauseMenu"
import BulletHell from "./BulletHell";

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
  resolution: 3,
  pixelArt: true,
  physics: {
    default: "arcade",
    arcade: {
      debug: false
    }
  },
  plugins: ['SceneManager', 'Clock'],
  scene: [Boot, SplashScreen, MainMenu, Backstory, Controls, Login, Signup, About, LevelSelect, DatingSim, Home, Matches, Gym, Haikus, Jokes, Math, Ads, PauseMenu, BulletHell]
};


// Automatically uses Boot I guess? I'm not really sure why
let game = new Phaser.Game(config);

console.log(game);
