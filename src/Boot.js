import Phaser, {} from "phaser";

export default class Boot extends Phaser.Scene{
    constructor(){
        super({
            key: "Boot"
        });
    }

    preload(){
        console.log("Boot");

        // Progress bar
        let background = this.add.graphics();
        background.fillStyle(0x000000);
        background.fillRect(0, 0, 480, 270);
        let progressBar = this.add.graphics();
        let progressBox = this.add.graphics();
        progressBox.lineStyle(4, 0xFFFFFF);
        progressBox.strokeRect(140, 110, 200, 20);

        let assetText = this.add.text(240, 160, "", {fontFamily: "NoPixel"});

        this.load.on('progress', function (value) {
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(140, 110, Math.round((192 * value)/2)*2, 20);
        });
        
        this.load.on('fileprogress', function (file) {
            assetText.setText('Loading asset: ' + file.key);
            assetText.setOrigin(0.5, 0.5);
        });

        this.load.on('complete', function () {
            progressBar.destroy();
            progressBox.destroy();
            assetText.destroy();
        });

        // Load all game files here
        // TODO: add progress bar
        // Load images
        this.load.image("splash-screen", "assets/splash-screen.png");
        this.load.image("main-menu", "assets/main-menu.png");
        this.load.image("btn-background", "assets/button.png");
        this.load.image("background", "assets/background.png");
        this.load.image("purple-background", "assets/purple-background.png");
        this.load.image("level-select", "assets/level-select.png");
        this.load.image("level-select-circle", 'assets/level-select-circle.png');
        this.load.image("level-select-x", "assets/level-select-x.png");
        this.load.image("home", "assets/tabs/home.png");
        this.load.image("matches", "assets/tabs/matches.png");
        this.load.image("gym", "assets/tabs/gym.png");
        this.load.image("haikus", "assets/tabs/haikus.png");
        this.load.image("jokes", "assets/tabs/jokes.png");
        this.load.image("math", "assets/tabs/math.png");
        this.load.image("invisibutton", "assets/invisibutton.png");
        this.load.image("pause-menu", "assets/pause-menu.png")

        // Load JSON Files
        this.load.json("questionnaire","text_data/questionnaire.json");

        for(let i = 1; i < 6; i++){
            this.load.image("body" + i, "assets/NPCAssets/bodies/" + i + ".png");
            this.load.image("feature" + i, "assets/NPCAssets/features/" + i + ".png");
        }
        for(let i = 1; i < 4; i++){
            this.load.image("background" + i, "assets/NPCAssets/backgrounds/" + i + ".png");
            for(let j = 1; j < 4; j++){
                this.load.image("clothes1" + j, "assets/NPCAssets/clothes/clothes1/" + j + ".png");
                this.load.image("clothes2" + j, "assets/NPCAssets/clothes/clothes2/" + j + ".png");
                this.load.image("clothes3" + j, "assets/NPCAssets/clothes/clothes3/" + j + ".png");

                this.load.image("eyes1" + j, "assets/NPCAssets/eyes/eyes1/" + j + ".png");
                this.load.image("eyes2" + j, "assets/NPCAssets/eyes/eyes2/" + j + ".png");
                this.load.image("eyes3" + j, "assets/NPCAssets/eyes/eyes3/" + j + ".png");

                this.load.image("hair1" + j, "assets/NPCAssets/hair/hair1/" + j + ".png");
                this.load.image("hair2" + j, "assets/NPCAssets/hair/hair2/" + j + ".png");
                this.load.image("hair3" + j, "assets/NPCAssets/hair/hair3/" + j + ".png");
            }
        }

        // Load Scenes
        // let scenes = [
        //     {name: "SplashScreen", path: "./SplashScreen.js"},
        //     {name: "MainMenu", path: "./MainMenu.js"},
        //     {name: "Backstory", path: "./Backstory.js"},
        //     {name: "Controls", path: "./Controls.js"},
        //     {name: "Login", path: "./Login.js"},
        //     {name: "Signup", path: "./Signup.js"},
        //     {name: "About", path: "./About.js"},
        //     {name: "LevelSelect", path: "./LevelsSelect.js"},
        //     {name: "DatingSim", path: "./DatingSim.js"},
        //     {name: "Home", path: "./tabs/Home.js"},
        //     {name: "Matches", path: "./tabs/Matches.js"},
        //     {name: "Gym", path: "./tabs/Gym.js"},
        //     {name: "Haikus", path: "./tabs/Haikus.js"},
        //     {name: "Jokes", path: "./tabs/Jokes.js"},
        //     {name: "Math", path: "./tabs/Math.js"},
        //     {name: "Ads", path: "./tabs/Ads.js"}
        //     ];

        // for(let i = 0; i < scenes.length; i++){
        //     this.load.sceneFile(scenes[i].name, scenes[i].path);
        // }
    }

    create(){
        this.scene.start("SplashScreen");
    }
}