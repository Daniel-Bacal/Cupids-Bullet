import Phaser, {} from "phaser";
import Player from "./objects/Player"

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
        this.load.image("swipe", "assets/swipe.png");
        this.load.image("heart-button", "assets/heart-button.png");
        this.load.image("x-button", "assets/x-button.png");
        this.load.image("player", "assets/player.png");
        this.load.image("bullet-hell-background", "assets/bullet-hell-background.png");
        this.load.image("modal", "assets/modal.png");
        this.load.image("skill-tree", "assets/skill-tree.png")
        this.load.image("person-message", "assets/person-message.png");
        this.load.image("player-message", "assets/player-message.png");
        this.load.image("end-of-day", "assets/end-of-day.png");
        this.load.image("heart-box", "assets/heart-box.png");
        this.load.image("status-heart", "assets/status-heart.png");
        this.load.image("game-win", "assets/game-win.png");
        this.load.image("game-over", "assets/game-over.png");
        this.load.image("choice-background", "assets/choice-background.png");
        this.load.image("end-of-day-banner", "assets/end-of-day-banner.png");
        this.load.image("da-1", "assets/das/da1.png");
        this.load.image("da-2", "assets/das/da2.png");
        this.load.image("accept-btn", "assets/accept-button.png");
        this.load.image("reject-btn", "assets/reject-button.png");
        this.load.image("haiku-background", "assets/haiku-background.png");

        this.load.image("wall", "assets/walls/wall.png");
        this.load.image("left-wall", "assets/walls/left-wall.png");
        this.load.image("horizontal-wall", "assets/walls/horizontal-wall.png");
        this.load.image("right-wall", "assets/walls/right-wall.png");
        this.load.image("top-wall", "assets/walls/top-wall.png");
        this.load.image("vertical-wall", "assets/walls/vertical-wall.png");
        this.load.image("bot-wall", "assets/walls/bot-wall.png");
        this.load.image("TL-wall", "assets/walls/TL-wall.png");
        this.load.image("TR-wall", "assets/walls/TR-wall.png");
        this.load.image("BL-wall", "assets/walls/BL-wall.png");
        this.load.image("BR-wall", "assets/walls/BR-wall.png");
        this.load.image("empty-wall", "assets/walls/empty-wall.png");

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
        this.load.spritesheet("oEnemy", "assets/other-sheet.png", {
            frameWidth: 32, frameHeight: 32
        });
        this.load.spritesheet("bhPlayer", "assets/cupid-sheet.png", {
            frameWidth: 32, frameHeight: 32
        });
        this.load.spritesheet("arm", "assets/arm.png", {
            frameWidth: 186, frameHeight: 157
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

        // Load skills
        let pref = ['f', 'm', 'b'];
        for(let i = 0; i < pref.length; i++){
            let skillGender = 's' + pref[i]
            this.load.image(skillGender, "assets/skill-icons/" + skillGender + ".png");
            for(let j = 1; j < 3; j++){
                let key = skillGender + j;
                this.load.image(key, "assets/skill-icons/" + key + ".png");
                for(let k = 1; k < 3; k++){
                    let key = skillGender + j + "" + k
                    this.load.image(key, "assets/skill-icons/" + key + ".png");
                }
            }
        }

        // Load Music
        this.load.audio("MainMenu", "assets/music/MenuMusic.mp3");
        this.load.audio("Battle", "assets/music/BattleMusic.mp3");
        this.load.audio("Day1", "assets/music/DatingDay1.mp3")
        this.load.audio("level-select", "assets/music/level-select.mp3");
        this.load.audio("victory-music", "assets/music/victory-music.mp3");
        this.load.audio("game-over", "assets/music/game-over.mp3");

        this.load.audio("CannedLaughterSFX", "assets/SFX/CannedLaughterSFX.mp3");
        this.load.audio("ChalkSFX", "assets/SFX/ChalkSFX.mp3");
        this.load.audio("CorrectSFX", "assets/SFX/CorrectSFX.mp3");
        this.load.audio("EnemyShootSFX", "assets/SFX/EnemyShootSFX.mp3");
        this.load.audio("EnemyTakingDamageSFX", "assets/SFX/EnemyTakingDamageSFX.mp3");
        this.load.audio("HaikuSFX", "assets/SFX/HaikuSFX.mp3");
        this.load.audio("IncorrectSFX", "assets/SFX/IncorrectSFX.mp3");
        this.load.audio("MessageReceivedSFX", "assets/SFX/MessageReceivedSFX.mp3");
        this.load.audio("MessageSentSFX", "assets/SFX/MessageSentSFX.mp3");
        this.load.audio("MouseClickSFX", "assets/SFX/MouseClickSFX.mp3");
        this.load.audio("PlayerShootSFX", "assets/SFX/PlayerShootSFX.mp3");
        this.load.audio("PlayerTakingDamageSFX", "assets/SFX/PlayerTakingDamageSFX.mp3");
        this.load.audio("SkillPointSpentSFX", "assets/SFX/SkillPointSpentSFX.mp3");
        this.load.audio("SwipeLeftSFX", "assets/SFX/SwipeLeftSFX.mp3");
        this.load.audio("SwipeRightSFX", "assets/SFX/SwipeRightSFX.mp3");

        // Create cheat code player profiles
        let mcKilla = new Player();
        mcKilla.setName("TheMcKillaGorilla");
        mcKilla.setBio("When I'm not teaching, programming, or gaming, I enjoy spending time with family and friends as well as playing the guitar and piano.");
        mcKilla.setPlayerStats(300, 300, 300, 300, 300);
        mcKilla.setDay(3);
        mcKilla.skillPoints = 3;
        mcKilla.saveToLocalStorage();

        let test = new Player();
        test.setName("test");
        test.setBio("This is a test profile.");
        test.setPlayerStats(10, 10, 10, 10, 10);
        test.setDay(0);
        test.saveToLocalStorage();

        // Wipe session player
        window.sessionStorage.removeItem("current_player");
    }

    create(){
        this.scene.start("SplashScreen");
    }
}