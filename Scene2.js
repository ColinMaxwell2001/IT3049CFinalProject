class Scene2 extends Phaser.Scene{ //Here!!
    constructor(){
        super("playGame");
    }
    //initiliaztion
    create(){
        
        //this.background = this.add.image(0, 0,"background");
        this.background = this.add.tileSprite(0, 0, config.width, config.height, "background");
        this.background.setOrigin(0,0);
        this.velocity = .5
        this.playerDied = false;
        this.fullScreen = this.add.text(750, 20, 'Full Screen (F)', { fill: '#0f0'})
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

        this.enemies = this.physics.add.group();

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

        this.enemyFireRate = 2000;
        //enemy shooting
        clearInterval(this.shootInterval);
        this.shootInterval = setInterval(() => {

            try {
                this.enemyShoot();
            } catch (error) {
                setTimeout(() => {
                    
                }, 2000);
            }
        }, this.enemyFireRate);

        //power up spawner
        clearInterval(this.spawnPowerUp);
        this.spawnPowerUp = setInterval(() => {
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
        }, 20000);

        this.powerUpActivite = false;
        

        //adding ships to the enemy
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
        this.fireInterval = 700;
        
        this.powerUps = this.physics.add.group();

        var maxObjects = 0;

        //bonus ship spawner
        this.bonusShipActive = false;
        clearInterval(this.bonusShipSpawn);
        this.bonusShipSpawn = setInterval(() => {
            console.log("spawning bonus");
            this.bonusship = this.add.sprite(config.width-100,config.height-600,"bonusship");
            this.enemies.add(this.bonusship);
            this.bonusShipActive = true;
        }, Math.floor(Math.random() * 20000) + 30000);



            //power up spawner
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

        this.player = this.physics.add.sprite(config.width / 2 - 8, config.height - 64, "player");
        this.player.play("thrust");
        this.cursorKeys = this.input.keyboard.createCursorKeys();
        this.player.setCollideWorldBounds(true);

        this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.f = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        this.projectiles = this.add.group();


        this.enemyProjectiles = this.add.group();

        this.physics.add.collider(this.projectiles, function(projectile, powerUp) {
            projectile.destroy();
        });
        
        this.physics.add.overlap(this.player, this.powerUps, this.pickPowerUp, null, this);

        this.physics.add.overlap(this.player, this.enemies, this.hurtPlayer, null, this);

        this.physics.add.overlap(this.projectiles, this.enemies, this.hitEnemy, null, this);

        this.physics.add.overlap(this.enemyProjectiles,this.player,this.hitPlayer,null,this);


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
        this.bonusscore = 100;
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

    
    //power picker
    pickPowerUp(player, powerUp) {
        
        this.randNum = Math.random();
        //this.randNum = .56;
        console.log(this.randNum);
        /* Double Points */
        if (this.randNum <= .25 && !this.powerUpActivite) 
        {
            this.powerUpActivite = true;
            this.powerUpIdentifier = this.add.bitmapText(400, 500, 'pixelFont', 'Score Bonus!', 40);

            //Display Powerup for 1.5 seconds
            setTimeout(() => {
                this.powerUpIdentifier.text = "";
            }, 1500);
            //Sets new multiplier to 25
            this.scoreMultiplier = 25;

            //After 10 seconds, set this.scoreMultiplier back to 15
            setTimeout(() => {
                this.scoreMultiplier = 15;
                this.powerUpActivite = false
            }, 10000); // 10 seconds or 10,000 milliseconds
            
        }
        else if (this.randNum > .25 && this.randNum <= .5  && !this.powerUpActivite)
        {
            this.powerUpActivite = true;
            this.powerUpIdentifier = this.add.bitmapText(400, 500, 'pixelFont', 'Dual Laser!', 40);
            //Display Powerup for 1.5 seconds
            setTimeout(() => {
                this.powerUpIdentifier.text = "";
            }, 1500);

            //Double laser
            this.doubleshot = true;
            setTimeout(() => {
                this.doubleshot = false;
                this.powerUpActivite = false;
                this.fireInterval = 700;
            }, 5000);
            
            
        }
        else if (this.randNum > .5 && this.randNum <= .75  && !this.powerUpActivite)
        {
            this.powerUpActivite = true;
            this.powerUpIdentifier = this.add.bitmapText(350, 500, 'pixelFont', 'Shoot Through Ships!', 40);
            
            //Display Powerup for 1.5 seconds
            setTimeout(() => {
                this.powerUpIdentifier.text = "";
            }, 1500);

            this.projectilesShot = 0;

            this.enemiesHit = 0;

            this.doublePenLaser = true;

                        
            //laser shoots through another ship
        }
        else if (this.randNum > .75 && this.randNum <= 1  && !this.powerUpActivite)
        {
            //Rapid Fire
            this.powerUpActivite = true;
            this.powerUpIdentifier = this.add.bitmapText(400, 500, 'pixelFont', 'Rapid Fire!', 40);

            //Display Powerup for 1.5 seconds
            setTimeout(() => {
                this.powerUpIdentifier.text = ""; //Remove Display
            }, 1500);

            this.fireInterval = 200

            setTimeout(() => {
                this.fireInterval = 700;
                this.powerUpActivite = false;
            }, 5000);
        }

        powerUp.disableBody(true, true);
    }
    //enemy getting hit by ship
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
    //player getting hit my enemy projectile
    hitPlayer(proj,player){
        let explosion = new Explosion(this,player.x,player.y);
        this.playerDied = true;
        player.disableBody(true,true);
        proj.destroy();
    }
    //hitting the enemy with player projectile
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
         if(enemy===this.bonusship){
            this.score += 100;
            this.bonusShipActive = false
        }
         
         else{
            this.score+=this.scoreMultiplier;
        }
        
        this.resetShipPos(enemy, enemy.x);
        
      
        var scoreFormated = this.zeroPad(this.score, 6);
        this.scoreLabel.text = "SCORE " + scoreFormated;
    }
    //moves all the ships left to right
    moveAllShips(speed){
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
            this.velocity += .05;
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
                this.velocity += .05;
                this.shipDirection = true;
                
            }
        }
        
    }
    //respawns ships and makes them slightly faster each time all the ships are destroyed on the screen
   newLevel(){
    this.level++;
    this.levelLabel.text = "Level " + this.level;

    this.velocity = this.velocity + .1;

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
        this.enemyFireRate -=300;
        this.fireInterval -= 50;
        this.randNum = Math.random();
        var maxObjects = 0;
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


        this.input.on('gameobjectdown', this.destroyShip, this);

        this.physics.add.overlap(this.player, this.powerUps, this.pickPowerUp, null, this);

        this.physics.add.overlap(this.player, this.enemies, this.hurtPlayer, null, this);

        this.physics.add.overlap(this.projectiles, this.enemies, this.hitEnemy, null, this);

        
    }, 3000); //Waits 3 seconds before setting level lable back to "" and respawing all enemy ships
   }


   
   //main function that updates the game
    update() {
        if(document.hidden){
            this.scene.pause(this);
        }
        if(!document.hidden){
            this.scene.resume(this);
        }
        if(this.bonusShipActive)
            this.bonusship.x -= .75;
        if(this.shipGrave.length < 33 && !this.playerDied){
            this.moveAllShips(.3);
        }
        else if(this.shipGrave.length == 33 && !this.playerDied) {
            //increment level
           this.newLevel();


        } //end level if()
        else{
            setTimeout(() => {
                this.scene.stop();
                console.log(this.score);
            this.scene.start("endGame");
            }, 500);
            
            
        }
        this.movePlayerManager();
        if(Phaser.Input.Keyboard.JustDown(this.f)){
            if(document.fullscreenElement){
                document.exitFullscreen();
            }
            
        document.body.webkitRequestFullScreen();
        }
            
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
                },this.fireInterval) //100 for testing purposes, change back later **
                
            }
        }

        for(var i = 0; i < this.projectiles.getChildren().length; i++){
            var beam = this.projectiles.getChildren()[i];
            beam.update();
        }

    }
    //player beam
    shootBeam(){
        console.log(this.fireInterval);
       // var beam = this.physics.add.sprite(this.player.x, this.player.y, "beam");
       this.playerShootTime = false;
       if(this.doublePenLaser){
        this.projectilesShot += 1;
    }
       if(this.projectilesShot >= 3){
        this.powerUpActivite = false
        this.doublePenLaser = false;
    }
        var beam = new Beam(this);
    }

    //enemy beams 
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
    //player movement
    movePlayerManager(){
        if(this.cursorKeys.left.isDown){
            this.player.setVelocityX(-gameSettings.playerSpeed);
        } else if (this.cursorKeys.right.isDown){
            this.player.setVelocityX(gameSettings.playerSpeed);
        }
        else{
            this.player.setVelocity(0);
        }
    }


    //moves the enemy ships off the board
    resetShipPos(ship, shipX){
        if(!this.shipGrave.includes(ship))
            this.shipGrave.push(ship);
       
        //not the most optimized solution but makes it so that the ships know when to turn left or right
        ship.y = + 1000;
        ship.x = shipX;
        // console.log(ship.y);
        console.log("ship grave : " + this.shipGrave.length);
    }
    //explosion animation
    destroyShip(pointer, gameObject) {
        try{gameObject.setTexture("explosion");
            gameObject.play("explode");}
        catch{
        }
    }
}