import Phaser, {} from "phaser";

export default function TextField(scene, x, y, width, height, maxChars, style={}){
    var textFieldElement = document.createElement("INPUT");
    textFieldElement.setAttribute("type", "text");
    textFieldElement.setAttribute("maxLength", maxChars)
    document.body.appendChild(textFieldElement);
    textFieldElement.style.position = "absolute";

    // Set up x and y positions
    // Get canvas position
    let div = document.getElementById("game-container");
    let canvas = div.getElementsByTagName("CANVAS")[0];
    let rect = canvas.getBoundingClientRect();
    let cX = rect.left;
    let cY = rect.top;
    textFieldElement.style.top = (2*(y - height/2) + cY) + "px";
    textFieldElement.style.left = (2*(x - width/2) + cX)  + "px";

    // Width and height
    textFieldElement.style.width = 2*width + "px";
    textFieldElement.style.height = 2*height + "px";

    // Set up default styles
    textFieldElement.style.fontFamily = "NoPixel";
    textFieldElement.style.borderStyle = "none";
    textFieldElement.style.backgroundColor = "transparent";
    textFieldElement.style.color = "white";
    textFieldElement.style.fontSize = "32px";

    // Load styles
    for(let property in style){
        textFieldElement.style[property] = style[property];
    }
    
    textFieldElement.lastCaptures = [];
    textFieldElement.cameFromFocus = false;

    textFieldElement.onfocus = () => {
        textFieldElement.lastCaptures = scene.game.input.keyboard.captures.slice();
        for(let i = 0; i < textFieldElement.lastCaptures.length; i++){
            scene.game.input.keyboard.removeCapture(textFieldElement.lastCaptures[i]);
        }
        textFieldElement.cameFromFocus = true;
    }

    textFieldElement.onblur = () => {
        if(textFieldElement.cameFromFocus){
            for(let i = 0; i < textFieldElement.lastCaptures.length; i++){
                scene.game.input.keyboard.addCapture(textFieldElement.lastCaptures[i]);
            }
            textFieldElement.cameFromFocus = false;
        }
    }
    
    return textFieldElement;
}