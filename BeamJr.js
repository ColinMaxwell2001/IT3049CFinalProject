class BeamJr extends Phaser.GameObjects.Sprite {
    constructor(scene, e){

        var x = scene.enemy.x;
        var y = scene.enemy.y + 16;


        super(scene, x, y, "enemybeam");
        scene.add.existing(this); 
 
        this.play("enemy_beam");
        scene.physics.world.enableBody(this);
        this.body.velocity.y = + 250;
    
      
        scene.enemyProjectiles.add(this);   
    }


    update(){

        // 3.4 Frustum culling
        if(this.y < 650 ){
          this.destroy();
        }
      }

}