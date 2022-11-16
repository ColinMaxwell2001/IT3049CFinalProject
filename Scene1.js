
class Scene1 extends Phaser.Scene {
    constructor() {
        super("bootGame");
    }

    create() {
        this.scene.start("playGame");

        this.add.text(20,20, "Loading Game...");
    }

}