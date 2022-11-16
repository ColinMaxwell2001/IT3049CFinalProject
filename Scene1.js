class Scene1 extends Phaser.Scene {
    constructor() {
      super("bootGame");
    }

    preload(){
        this.load.image("background", "assets/images/background.png");
        //this.load.image("ship", "assets/images/ship.png");
        //this.load.image("ship2", "assets/images/ship2.png");
        //this.load.image("ship3", "assets/images/ship3.png");
        //this.load.image("colors", "assets/colors.png");

        this.load.spritesheet("ship", "assets/images/spritesheets/ship.png", {
            frameWidth: 16,
            frameHeight: 16
        });

        this.load.spritesheet("ship2", "assets/images/spritesheets/ship2.png", {
            frameWidth: 32,
            frameHeight: 16
        });

        this.load.spritesheet("ship3", "assets/images/spritesheets/ship3.png", {
            frameWidth: 32,
            frameHeight: 32
        });

        this.load.spritesheet("explosion", "assets/images/spritesheets/explosion.png", {
            frameWidth: 16,
            frameHeight: 16
        });

        this.load.spritesheet("power-up", "assets/images/spritesheets/power-up.png", {
            frameWidth: 16,
            frameHeight: 16
        });

        this.load.spritesheet("player", "assets/images/spritesheets/player.png", {
            frameWidth: 16,
            frameHeight: 24
        });

        this.load.spritesheet("beam", "assets/images/spritesheets/beam.png", {
            frameWidth: 16,
            frameHeight: 16
        });

        this.load.bitmapFont("pixelFont", "assets/images/font/font.png", "assets/images/font/font.xml");
    


        
    }

    create() {
      this.add.text(20, 20, "Loading game...");
      this.scene.start("playGame");

      this.anims.create({
        key: "ship1_anim",
        frames: this.anims.generateFrameNumbers("ship"),
        frameRate: 20,
        repeat: -1
    });

    this.anims.create({
        key: "ship2_anim",
        frames: this.anims.generateFrameNumbers("ship2"),
        frameRate: 20,
        repeat: -1
    });

    this.anims.create({
        key: "ship3_anim",
        frames: this.anims.generateFrameNumbers("ship3"),
        frameRate: 20,
        repeat: -1
    });

    this.anims.create({
        key: "explode",
        frames: this.anims.generateFrameNumbers("explosion"),
        frameRate: 20,
        repeat: 0,
        hideOnComplete: true
    });

    this.anims.create({
        key: "red",
        frames: this.anims.generateFrameNumbers("power-up", {
            start: 0,
            end: 1
        }),
        frameRate: 20,
        repeat: -1
    });
    
    this.anims.create({
        key: "gray",
        frames: this.anims.generateFrameNumbers("power-up", {
            start: 2,
            end: 3
        }),
        frameRate: 20,
        repeat: -1
    });

    this.anims.create({
        key: "thrust",
        frames: this.anims.generateFrameNumbers("player"),
        frameRate: 20,
        repeat: -1
    });

    this.anims.create({
        key: "beam_anim",
        frames: this.anims.generateFrameNumbers("beam"),
        frameRate: 20,
        repeat: -1
    });

    this.scoreLabel = this.add.bitmapText(10, 5, "pixelFont", "SCORE ", 16);



    }
  }