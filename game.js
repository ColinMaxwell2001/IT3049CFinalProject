var gameSettings = {
    playerSpeed: 200,
}

var config = {
    width: 900,
    height: 700,
    backgroundColor: 0x000000,
    scene: [Scene1, Scene2, Scene3],
    pixelArt : true,
    physics: {
        default: "arcade",
        arcade:{
            debug: false
        }
    }
}

window.onload = function() {
    var game = new Phaser.Game(config);
}