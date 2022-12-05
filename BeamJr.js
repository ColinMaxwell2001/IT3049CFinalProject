class BeamJr extends Phaser.GameObjects.Sprite {
    constructor(scene){

        var x = scene.enemy.x;
        var y = scene.enemy.y - 16;


        super(scene, x, y, "beam");
        scene.add.existing(this); 
 
        this.play("beam_anim");
        scene.physics.world.enableBody(this);
        this.body.velocity.y = - 250;
    
      
        scene.enemyProjectiles.add(this);   
    }


    update(){

        // 3.4 Frustum culling
        if(this.y < 650 ){
          this.destroy();
        }
      }

}