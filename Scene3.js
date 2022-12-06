class Scene3 extends Phaser.Scene{ //Here!!
    constructor(){
        super("endGame");
    }
    create(){
        this.background = this.add.tileSprite(0, 0, config.width, config.height, "background");
        this.background.setOrigin(0,0);
        this.levelScreen = this.add.bitmapText(350, 300, 'pixelFont', 'Game Over', 64);
    }
}