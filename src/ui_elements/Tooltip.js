export default function Tooltip(scene){
    this.background = scene.add.graphics();
    this.text = scene.add.text(0, 0, "", {fontFamily: "NoPixel", fontSize: "8px", color: "#431c5c", align: "left", wordWrap: { width: 100, useAdvancedWrap: true }});
    this.background.depth = 1000;
    this.text.depth = 1001;
    this.padding = 2;

    this.showTooltip = (x, y, text, backgroundColor) => {
        this.text.visible = true;
        this.text.text = text;
        let w = this.text.displayWidth;
        let h = this.text.displayHeight;

        if(x + w + 2*this.padding > 480){
            this.text.x = x - this.padding - w;
            this.text.y = y + this.padding;
            this.background.fillStyle(backgroundColor);
            this.background.fillRect(x, y, -(w + 2*this.padding), h + 2*this.padding);
        } else {
            this.text.x = x + this.padding;
            this.text.y = y + this.padding;
            this.background.fillStyle(backgroundColor);
            this.background.fillRect(x, y, w + 2*this.padding, h + 2*this.padding);
        }
    }

    this.hideTooltip = () => {
        this.text.visible = false;
        this.background.clear();
    }
}