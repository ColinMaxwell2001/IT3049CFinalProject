class Scene2 extends Phaser.Scene{ //Here!!
    constructor(){
        super("playGame");
    }

    create(){
        
        //this.background = this.add.image(0, 0,"background");
        this.background = this.add.tileSprite(0, 0, config.width, config.height, "background");
        this.background.setOrigin(0,0);
        this.velocity = 1
        this.playerDied = false;
        this.fullScreen = this.add.text(780, 20, 'Full Screen', { fill: '#0f0'})
         .setInteractive()
        .on('pointerover', () => this.enterButtonHoverState() )
        .on('pointerout', () => this.enterButtonRestState() )
         .on('pointerdown', () => this.enterButtonActiveState() )
        .on('pointerup', () => {
            if(document.fullscreenElement){
                document.exitFullscreen();
            }
            
        document.body.webkitRequestFullScreen();
        this.enterButtonHoverState();
    });
        //this.ship1 = this.add.image(config.width/2 -50, config.height/2, "ship");
        //this.ship2 = this.add.image(config.width/2, config.height/2, "ship2");
        //this.ship3 = this.add.image(config.width/2 +50, config.height/2, "ship3");

        // this.ship1 = this.add.sprite(config.width / 2 - 50, config.height / 2, "ship");
        // this.ship2 = this.add.sprite(config.width / 2, config.height / 2, "ship2");
        // this.ship3 = this.add.sprite(config.width / 2 + 50, config.height / 2, "ship3");
/*
        this.anima.create({
            key:"ship1_anim",
            frames:this.anims.generateFrameNumbers("ship"),
            frameRate:20,
            repeat:-1
        });

        this.anima.create({
            key:"ship2_anim",
            frames:this.anims.generateFrameNumbers("ship2"),
            frameRate:20,
            repeat:-1
        });

        this.anima.create({
            key:"ship2_anim",
            frames:this.anims.generateFrameNumbers("ship3"),
            frameRate:20,
            repeat:-1
        });

        this.anima.create({
            key:"explode",
            frames:this.anims.generateFrameNumbers("explosion"),
            frameRate:20,
            repeat:0,
            hideOnComplete:true
        });
*/
        this.enemies = this.physics.add.group();
        // this.enemies.add(this.ship1);
        // this.enemies.add(this.ship2);
        // this.enemies.add(this.ship3);
        this.shipDirection = true;
        
        this.shipGrave = [];
        this.shipsArr1 = [];
        this.shipsArr2 = [];
        this.shipsArr3 = [];
        this.startingPosition = 0;
        this.shipGrave = [];
        //creating ships
        for(let i = 0; i < 11; i++){
            this.shipsArr1.push(this.add.sprite(config.width / 2 - this.startingPosition, config.height / 3.8, "ship"));
            this.shipsArr2.push(this.add.sprite(config.width / 2 - this.startingPosition, config.height / 3, "ship2"));
            this.shipsArr3.push(this.ship3 = this.add.sprite(config.width / 2 - this.startingPosition, config.height / 2.5, "ship3"));
            this.startingPosition += 40;
        }
        this.enemy = this.shipsArr1[0];
        this.chooseShip = Math.floor(Math.random() * 10);
        //setting their properties


        //enemy shooting
        this.shootInterval = setInterval(() => {

            try {
                this.enemyShoot();
            } catch (error) {
                setTimeout(() => {
                    
                }, 2000);
            }
        }, 2000);

        
        this.shipsArr1.forEach(element => {
            element.play("ship1_anim");
            this.enemies.add(element);
        });
        this.shipsArr2.forEach(element => {
            element.play("ship2_anim");
            this.enemies.add(element);
        })
        this.shipsArr3.forEach(element => {
            element.play("ship3_anim");
            this.enemies.add(element);
        })


        // this.ship1.play("ship1_anim");
        // this.ship2.play("ship2_anim");
        // this.ship3.play("ship3_anim");

        // this.ship1.setInteractive();
        // this.ship2.setInteractive();
        // this.ship3.setInteractive();

        this.input.on('gameobjectdown', this.destroyShip, this);

        
        
        this.powerUps = this.physics.add.group();

        var maxObjects = 3;
        for (var i = 0; i <= maxObjects; i++) {
          var powerUp = this.physics.add.sprite(16, 16, "power-up");
          this.powerUps.add(powerUp);
          powerUp.setRandomPosition(0, 0, config.width, config.height);     /* Had to take out the keyword "game" in game.config in order to make work */

            if (Math.random() > 0.5)
            {
                powerUp.play("red");
            } else {
                powerUp.play("gray");
            }

            powerUp.setVelocity(100, 100);
            powerUp.setCollideWorldBounds(true);
            powerUp.setBounce(1);
        }

        this.player = this.physics.add.sprite(config.width / 2 - 8, config.height - 64, "player");
        this.player.play("thrust");
        this.cursorKeys = this.input.keyboard.createCursorKeys();
        this.player.setCollideWorldBounds(true);

        this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.projectiles = this.add.group();


        this.enemyProjectiles = this.add.group();

        this.physics.add.collider(this.projectiles, this.powerUps, function(projectile, powerUp) {
            projectile.destroy();
        });
        
        this.physics.add.overlap(this.player, this.powerUps, this.pickPowerUp, null, this);

        this.physics.add.overlap(this.player, this.enemies, this.hurtPlayer, null, this);

        this.physics.add.overlap(this.projectiles, this.enemies, this.hitEnemy, null, this);

        this.physics.add.overlap(this.enemyProjectiles,this.player,this.hitPlayer,null,this);
        //Tutorial #9

        var graphics = this.add.graphics();
        graphics.fillStyle(0x000000, 1);
        graphics.beginPath();
        graphics.moveTo(0, 0);
        graphics.lineTo(config.width, 0);
        graphics.lineTo(config.width, 20);
        graphics.lineTo(0, 20);
        graphics.lineTo(0, 0);
        graphics.closePath();
        graphics.fillPath();


        this.score = 0;
        this.scoreMultiplier = 15;
        this.level = 0;
        this.scoreLabel = this.add.bitmapText(10, 5, "pixelFont", "SCORE ", 16);

        var leelFormatted = this.zeroPad(this.level, 2);
        this.levelLabel = this.add.bitmapText(300, 5, "pixelFont", "Level ", 16);
        this.levelLabel.text = "Level " + this.level;


    }
    enterButtonHoverState() {
        this.fullScreen.setStyle({ fill: '#ff0'});
      }
    
      enterButtonRestState() {
        this.fullScreen.setStyle({ fill: '#0f0' });
      }
    
      enterButtonActiveState() {
        this.fullScreen.setStyle({ fill: '#0ff' });
      }

    zeroPad(number, size){
        var stringNumber = String(number);
        while(stringNumber.length < (size || 2)){
            stringNumber = "0" + stringNumber;
        }
        return stringNumber;
    }

    

    pickPowerUp(player, powerUp) {
        
        //var randNum = Math.random();
        this.randNum = .2;

        /* Double Points */
        if (this.randNum < .166)
        {
            //Sets new multiplier to 25
            this.scoreMultiplier = 25;

            //After 10 seconds, set this.scoreMultiplier back to 15
            setTimeout(() => {
                this.scoreMultiplier = 15;
            }, 10000); // 10 seconds or 10,000 milliseconds
            
        }
        else if (this.randNum > .166 && this.randNum < .332)
        {
            //Double laser
            this.doubleshot = true;
            setTimeout(() => {
                this.doubleshot = false;
            }, 5000);
            
            
        }
        else if (this.randNum > .332 && this.randNum < .498)
        {
            this.projectilesShot = 0;

            this.enemiesHit = 0;

            this.doublePenLaser = true;

                        
            //laser shoots through another ship
        }
        else if (this.randNum > .498 && this.randNum < .664)
        {
            //Rapid Fire
        }
        else if (this.randNum > .664 && this.randNum < .830)
        {
            // Temporary Shield
        }
        else{
            //Bigger Laser
        } 

        powerUp.disableBody(true, true);
    }

    hurtPlayer(player, enemy) {
        this.resetShipPos(enemy);
        this.playerDied = true;
        if(this.player.alpha < 1) {
            return;
        }
        var explosion = new Explosion(this, player.x, player.y);

        player.disableBody(true, true);

        //this.resetPlayer();
        this.time.addEvent({
            delay:1000,
            callback: this.resetPlayer,
            callbackScope: this,
            loop: false
        })


    }

    resetPlayer() {
        var x = config.width / 2 - 8;
        var y = config.height + 64;
        this.player.enableBody(true, x, y, true, true);
        this.player.alpha = 0.5;

        var tween = this.tweens.add({
            targets: this.player,
            y: config.height - 64, 
            ease: 'Power1',
            duration: 1500, 
            repeat: 0,
            onComplete: function() {
                this.player.alpha = 1;
            },
            callbackScope: this
        });
    }

    hitPlayer(proj,player){
        let explosion = new Explosion(this,player.x,player.y);
        this.playerDied = true;
        player.disableBody(true,true);
        proj.destroy();
    }

    hitEnemy(projectile, enemy) {
        // console.log("enemies hit : " + this.enemiesHit);
        var explosion = new Explosion(this, enemy.x, enemy.y);
        if(this.doublePenLaser){
            this.enemiesHit +=1;
        }
        if(this.enemiesHit >=2 ){
            projectile.destroy();
            this.enemiesHit = 0;
        }
        if(!this.doublePenLaser){
            projectile.destroy();
        }
        
        this.resetShipPos(enemy, enemy.x);
        
        this.score += this.scoreMultiplier;
        var scoreFormated = this.zeroPad(this.score, 6);
        this.scoreLabel.text = "SCORE " + scoreFormated;
    }
    // moveShip(ship, speed) {
    //     if(this.shipDirection){
    //         ship.x += speed;
    //     }
    //     else{
    //         ship.x -= speed;
    //     }


    //     if ((ship.x > (config.width - 100)) && this.shipDirection)
    //     {
    //         //this.resetShipPos(ship);
    //         this.reverseShipMovement();
    //         this.shipDirection = false; 
    //     }
    //     else if(ship.x < (100) && !this.shipDirection){
    //         this.shipDirection = true;
    //     }

    // }


    

    // reverseShipMovement(){
    //     this.shipsArr1.forEach(element => {
    //         this.moveShip(element,-.5);
    //     });
    //     this.shipsArr2.forEach(element=>{
    //         this.moveShip(element,-.5);
    //     })
    //     this.shipsArr3.forEach(element=>{
    //         this.moveShip(element,-.5);
    //     });
    // }




    moveAllShips(speed){
        // console.log(this.shipsArr1[0].x)
        // console.log(this.shipsArr1[0].y);
        if(this.shipDirection){
        
        for(let i = 0; i < this.shipsArr1.length; i++){
            this.shipsArr1[i].x += (speed * this.velocity);
            this.shipsArr2[i].x += (speed * this.velocity);
            this.shipsArr3[i].x += (speed * this.velocity);
        }
       
        if(this.shipsArr1[0].x >= 890){
            for(let i = 0; i < this.shipsArr1.length; i++){
                this.shipsArr1[i].y += 10;
                this.shipsArr2[i].y += 10;
                this.shipsArr3[i].y += 10;

            }
            this.velocity += .2;
            this.shipDirection = false;
            
        }
        }
        else{
            for(let i = 0; i < this.shipsArr1.length; i++){
                this.shipsArr1[i].x -= speed * this.velocity;
                this.shipsArr2[i].x -= speed * this.velocity;
                this.shipsArr3[i].x -= speed * this.velocity;
            }
            if(this.shipsArr1[10].x <= 15){
                for(let i = 0; i < this.shipsArr1.length; i++){
                    this.shipsArr1[i].y += 10;
                    this.shipsArr2[i].y += 10;
                    this.shipsArr3[i].y += 10;
    
                }
                this.velocity += .2
                this.shipDirection = true;
                
            }
        }
        
        // console.log(this.shipsArr1[0] >= config.width)
        // console.log(this.shipDirection)
       
        // if(shipArr[0] < 100){
        //     shipArr.forEach(ship => {
        //         ship.x += speed;
        //     })
        // }
    }

   newLevel(){
    this.level++;
    this.levelLabel.text = "Level " + this.level;


    /*this.levelScreen = this.add.bitmapText(100, 300, 'pixelfont', 'Level ' + this.level, 16);
    this.levelScreen.text = "Level " + this.level;*/
    
    //increase enemy fire rate
    //increase enemy speed
    this.velocity = this.velocity + 1.2;

    //reset deadShipCount
    this.shipGrave = []
    
    this.levelScreen = this.add.bitmapText(400, 300, 'pixelFont', 'Level ' + this.level, 64);

    setTimeout(() => { //After 3 seconds have passed

        //Remove label from screen
        this.levelScreen.text = "";

        //Set enemy properties
        this.enemies = this.physics.add.group();
        this.shipDirection = true;
        this.shipsArr1 = [];
        this.shipsArr2 = [];
        this.shipsArr3 = [];
        this.startingPosition = 0;
    
        //creating ships
        for(let i = 0; i < 11; i++){
            this.shipsArr1.push(this.add.sprite(config.width / 2 - this.startingPosition, config.height / 3.8, "ship"));
            this.shipsArr2.push(this.add.sprite(config.width / 2 - this.startingPosition, config.height / 3, "ship2"));
            this.shipsArr3.push(this.ship3 = this.add.sprite(config.width / 2 - this.startingPosition, config.height / 2.5, "ship3"));
            this.startingPosition += 40;
        }
        console.log(this.shipsArr1);
        //setting their animations
        this.shipsArr1.forEach(element => {
            element.play("ship1_anim");
            this.enemies.add(element);
        });
        this.shipsArr2.forEach(element => {
            element.play("ship2_anim");
            this.enemies.add(element);
        })
        this.shipsArr3.forEach(element => {
            element.play("ship3_anim");
            this.enemies.add(element);
        })

        this.input.on('gameobjectdown', this.destroyShip, this);

        this.physics.add.overlap(this.player, this.powerUps, this.pickPowerUp, null, this);

        this.physics.add.overlap(this.player, this.enemies, this.hurtPlayer, null, this);

        this.physics.add.overlap(this.projectiles, this.enemies, this.hitEnemy, null, this);

        
    }, 3000); //Waits 3 seconds before setting level lable back to "" and respawing all enemy ships
   }


   

    update() {
        if(this.shipGrave.length < 33 && !this.playerDied){
            this.moveAllShips(.3);
        }
        else if(this.shipGrave.length == 33 && !this.playerDied) {
            //increment level
           this.newLevel();


        } //end level if()
        else{
            clearInterval(this.shootInterval);
            setTimeout(() => {
                this.scene.stop();
            this.scene.start("endGame");
            }, 500);
            
            
        }
        this.movePlayerManager();
        if (Phaser.Input.Keyboard.JustDown(this.spacebar)){
            if(this.player.active && !this.playerShootTime){
                if(this.doubleshot){
                    this.shootBeam();
                    setTimeout(() => {
                        this.shootBeam();
                    }, 200);
                    
                }
                this.shootBeam();
                this.playerShootTime = true;
                setTimeout(()=>{
                    this.playerShootTime = false;
                },100) //100 for testing purposes, change back later **
                
            }
        }

        for(var i = 0; i < this.projectiles.getChildren().length; i++){
            var beam = this.projectiles.getChildren()[i];
            beam.update();
        }

    }
    shootBeam(){
       // var beam = this.physics.add.sprite(this.player.x, this.player.y, "beam");
       this.playerShootTime = false;
       if(this.projectilesShot >= 3){
        this.doublePenLaser = false;
    }
        if(this.doublePenLaser){
            this.projectilesShot += 1;
        }
        // console.log("projectiles shot : " + this.projectilesShot);
        // console.log("double pen status : " + this.doublePenLaser);

        var beam = new Beam(this);
       
        //var beam = new Beam(this);
    }


    enemyShoot(){
        //checks for ships that are on the screen
        this.availableShip = [];
        for(let i = 0; i < this.shipsArr1.length; i++){
            if(this.shipsArr1[i].y >= 1000){
                continue;
            }
            else{
                this.availableShip.push(this.shipsArr1[i]);
            }
        }
        
        this.enemy = this.availableShip[Math.floor(Math.random()*this.availableShip.length)];
        let newBeam = new BeamJr(this);
    }

    movePlayerManager(){
        if(this.cursorKeys.left.isDown){
            this.player.setVelocityX(-gameSettings.playerSpeed);
        } else if (this.cursorKeys.right.isDown){
            this.player.setVelocityX(gameSettings.playerSpeed);
        }
        else{
            this.player.setVelocity(0);
        }
        /*
        if(this.cursorKeys.up.isDown){
            this.player.setVelocityY(-gameSettings.playerSpeed);
        } else if (this.cursorKeys.down.isDown){
            this.player.setVelocityY(gameSettings.playerSpeed);
        } */

    }



    resetShipPos(ship, shipX){
        if(!this.shipGrave.includes(ship))
            this.shipGrave.push(ship);
       
        //not the most optimized solution but makes it so that the ships know when to turn left or right
        ship.y = + 1000;
        ship.x = shipX;
        // console.log(ship.y);
        console.log("ship grave : " + this.shipGrave.length);
    }

    destroyShip(pointer, gameObject) {
        gameObject.setTexture("explosion");
        gameObject.play("explode");
    }
}