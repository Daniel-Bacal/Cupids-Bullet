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
        this.load.image("pause-menu", "assets/pause-menu.png");
        this.load.image("player", "assets/player.png");
        this.load.image("bullet-hell-background", "assets/bullet-hell-background.png");

        // Load sprites
        this.load.spritesheet("bullet", "assets/bullet.png", {
            frameWidth: 16, frameHeight: 16
        });
        this.load.spritesheet("fEnemy", "assets/girl-sheet.png", {
            frameWidth: 32, frameHeight: 32
        });
        this.load.spritesheet("mEnemy", "assets/boy-sheet.png", {
            frameWidth: 32, frameHeight: 32
        });
        this.load.spritesheet("bhPlayer", "assets/cupid-sheet.png", {
            frameWidth: 32, frameHeight: 32
        });

        // Load JSON Files
        this.load.json("questionnaire","text_data/questionnaire.json");

        for(let i = 1; i < 6; i++){
            this.load.image("fBody" + i, "assets/NPCAssets/female/bodies/" + i + ".png");
            this.load.image("fFeature" + i, "assets/NPCAssets/female/features/" + i + ".png");
            this.load.image("mBody" + i, "assets/NPCAssets/male/bodies/" + i + ".png");
            this.load.image("mFeature" + i, "assets/NPCAssets/male/features/" + i + ".png");
            this.load.image("background" + i, "assets/NPCAssets/backgrounds/" + i + ".png");
        }
        for(let i = 1; i < 4; i++){
            for(let j = 1; j < 4; j++){
                this.load.image("fClothes" + i + j, "assets/NPCAssets/female/clothes/clothes" + i + "/" + j + ".png");
                this.load.image("fEyes" + i + j, "assets/NPCAssets/female/eyes/eyes" + i + "/" + j + ".png");
                this.load.image("fHair" + i + j, "assets/NPCAssets/female/hair/hair" + i + "/" + j + ".png");
                this.load.image("mClothes" + i + j, "assets/NPCAssets/male/clothes/clothes" + i + "/" + j + ".png");
                this.load.image("mEyes" + i + j, "assets/NPCAssets/male/eyes/eyes" + i + "/" + j + ".png");
                this.load.image("mHair" + i + j, "assets/NPCAssets/male/hair/hair" + i + "/" + j + ".png");
            }
        }

    }

    create(){
        this.scene.start("SplashScreen");
    }
}