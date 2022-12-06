
class Scene3 extends Phaser.Scene{ //Here!!

    constructor(){
        super("endGame");
        
    }


    create(){
        this.score = this.scene.get("playGame").score
        this.background = this.add.tileSprite(0, 0, config.width, config.height, "background");
        this.background.setOrigin(0,0);
        this.levelScreen = this.add.bitmapText(350, 300, 'pixelFont', 'Game Over', 64);
        this.levelScreen = this.add.bitmapText(370, 150, 'pixelFont', 'Score ' + this.score , 64);
        this.clickButton = this.add.text(425, 400, 'Play Again!', { fill: '#0f0' })
         .setInteractive()
        .on('pointerover', () => this.enterButtonHoverState() )
        .on('pointerout', () => this.enterButtonRestState() )
         .on('pointerdown', () => this.enterButtonActiveState() )
        .on('pointerup', () => {
        this.scene.start("playGame");
        this.enterButtonHoverState();
    });

    
  }
  enterButtonHoverState() {
    this.clickButton.setStyle({ fill: '#ff0'});
  }

  enterButtonRestState() {
    this.clickButton.setStyle({ fill: '#0f0' });
  }

  enterButtonActiveState() {
    this.clickButton.setStyle({ fill: '#0ff' });
  }
}
