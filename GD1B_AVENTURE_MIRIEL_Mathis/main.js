var config = {
    type: Phaser.AUTO,
    width: 1600, height: 900,
    physics: {
        default: 'arcade',
        arcade: {
        gravity: { y: 0 },
        debug: false
        }
    },
    input:{gamepad:true},
    maxLights : 20, 

    scene: [menu,station,inventaire]

   

};

var game = new Phaser.Game(config);
