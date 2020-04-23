import "./styles.css";
import Phaser from "phaser";
import SplashScreen from "./SplashScreen.js";
import MainMenu from "./MainMenu.js";
import Boot from "./Boot.js"
import Backstory from "./Backstory"
import Controls from "./Controls";
import Login from "./Login";
import Signup from "./Signup";
import About from "./About";
import LevelSelect from "./LevelSelect";
import DatingSim from "./DatingSim";
import Home from "./tabs/Home"
import Matches from "./tabs/Matches"
import Gym from "./tabs/Gym"
import Haikus from "./tabs/Haikus"
import Jokes from "./tabs/Jokes"
import Math from "./tabs/Math"
import Ads from "./tabs/Ads"
import PauseMenu from "./tabs/PauseMenu"

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
      debug: false,
      gravity: { y: 200 }
    }
  },
  plugins: ['SceneManager', 'Clock'],
  scene: [Boot, SplashScreen, MainMenu, Backstory, Controls, Login, Signup, About, LevelSelect, DatingSim, Home, Matches, Gym, Haikus, Jokes, Math, Ads, PauseMenu]
};


// Automatically uses Boot I guess? I'm not really sure why
let game = new Phaser.Game(config);

console.log(game);
