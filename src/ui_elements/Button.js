export default function Button(scene, x, y, text, fontSize="16px", backgroundImage=null, width=0, height=0, backgroundOffsetX=0, backgroundOffsetY=0){
    // Background Image
    let background = null;
    if(backgroundImage !== null){
        background = scene.add.image(x, y, backgroundImage);
        background.displayWidth = width;
        background.displayHeight = height;
        background.setOrigin(0.5, 0.5);
    }
    
    // Button
    let color = "#0f0";
    let hoverColor = "#ff0"
    let button = scene.add.text(x, y, text, {fill: color, fontFamily: "NoPixel", fontSize: fontSize});
    // Reset the origin now that the button has 
    button.setOrigin(0.5, 0.5);

    // Button colors
    button.color = color;
    button.setButtonColor = (initColor) => {
        button.color = initColor;
        button.setStyle({fill: button.color});
    }
    button.hoverColor = hoverColor;
    button.setButtonHoverColor = (initColor) => {button.hoverColor = initColor;}

    // Button events
    button.setInteractive({useHandCursor: true});

    // Background
    if(background !== null){
        button.buttonBackgroundImage = background;
        button.on('pointerover', () => startButtonHoverState(button));
        button.on('pointerout', () => endButtonHoverState(button));
        button.buttonOnClick = () => {console.log("click");}
        button.on('pointerdown', () => {scene.sound.play("MouseClickSFX"); button.buttonOnClick()});
        button.setButtonOnClick = (callback) => {button.buttonOnClick = callback;}

        background.setInteractive({useHandCursor: true});
        background.on('pointerover', () => startButtonHoverState(button));
        background.on('pointerout', () => endButtonHoverState(button));
        background.on('pointerdown', () => {scene.sound.play("MouseClickSFX"); button.buttonOnClick();});
    } else {
        button.buttonBackgroundImage = null;
        button.on('pointerover', () => startButtonHoverState(button));
        button.on('pointerout', () => endButtonHoverState(button));
        button.buttonOnClick = () => {console.log("click");}
        button.on('pointerdown', () => {scene.sound.play("MouseClickSFX"); button.buttonOnClick();});
        button.setButtonOnClick = (callback) => {button.buttonOnClick = callback;}
    }

    //TODO: Vertical align text in button

    // Button visibility custom function
    button.setButtonVisible = (flag) => setButtonVisible(button, flag);

    return button;
}

function startButtonHoverState(button){
    button.setStyle({fill: button.hoverColor});
    if(button.buttonBackgroundImage !== null){
        button.buttonBackgroundImage.tint = 0xeeeeee;
    }
}

function endButtonHoverState(button){
    button.setStyle({fill: button.color});
    if(button.buttonBackgroundImage !== null){
        button.buttonBackgroundImage.clearTint();
    }
}

function setButtonVisible(button, flag){
    button.visible = flag;
    if(button.buttonBackgroundImage !== null){
        button.buttonBackgroundImage.visible = flag;
    }
}