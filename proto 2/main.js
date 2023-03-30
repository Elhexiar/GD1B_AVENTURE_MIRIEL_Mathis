var config = {
    type: Phaser.AUTO,
    width: 900, height: 900,
    physics: {
        default: 'arcade',
        arcade: {
        gravity: { y: 0 },
        debug: true
        }
    },
    input:{gamepad:true},

    scene: {preload: preload, create: create, update: update }

   

};

new Phaser.Game(config);
var light;

function preload(){
    this.load.spritesheet('perso','assets/perso.png',
    { frameWidth: 44, frameHeight: 56 });
    this.load.image('fond', 'assets/background.png')
    this.load.image("Phaser_tileset", "assets/Tileset.png");
    this.load.tilemapTiledJSON("carte", "assets/Map_Tiled.json");
    this.load.spritesheet('HP_Sprite','assets/PV_Sprite.png',
    {      frameWidth: 88, frameHeight: 113          });
    this.load.image('cactus','assets/cactus.png')
    this.load.image('checkpoint','assets/checkpoint.png')
    this.load.image('BigSaw','assets/Big_saw.png')
    this.load.image('Small_Saw','assets/Small_saw.png')
}



var playerStats = {
    // player horizontal speed
    playerSpeed: 300,

    // player force
    playerJump: 200,

    Global_HP : 3,

    iframe : 0,

    invincible : false,

    checkpoint_nb : 0,

    SpawnXcoord : 1750,
    SpawnYcoord : 5150,
    x : 1750,
    y: 5150,

    mouse_x : 0,
    mouse_y : 0,

    Torche_x : 0,
    Torche_y : 0,
    Torche_status :false,
    Torche_radius : 100,
    Torche_angle : 0,
}

var global_dic = {



}

var position = [

    is_in_room_00 = false,
    is_in_room_01 = false,
    is_in_room_02 = false,

]




var cursors;
var gameOver;

gameOver=false;

function create(){


    // permet de sauter avec la touche espace
    keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    //this.add.image(800, 800, 'fond'); 
    const carteDuNiveau = this.add.tilemap("carte");

    const tileset = carteDuNiveau.addTilesetImage(
        "temp tileset",
        "Phaser_tileset"
    );
    
    const calque_sol = carteDuNiveau.createLayer("sol",tileset);
    const calque_mur = carteDuNiveau.createLayer("mur",tileset);
    const room_01 = carteDuNiveau.createLayer("detection room/01",tileset);
    
    const calque_obstacle = carteDuNiveau.createLayer("sur sol",tileset)
    
    
    calque_mur.setCollisionByProperty({estSolide: true});
    

    this.player = this.physics.add.sprite(playerStats.SpawnXcoord, playerStats.SpawnYcoord, 'perso');

    this.player.setCollideWorldBounds(false);

    this.physics.add.collider(this.player, calque_mur);

    
    room_00_light = [];
    carteDuNiveau.getObjectLayer('room 00 light').objects.forEach((nl,i) => {
        
        room_00_light[i] = this.lights.addLight(nl.x+32,nl.y+32,300).setIntensity(1.0).setColor(0xFFF03B);
    });

    calque_sol.setPipeline('Light2D').setScrollFactor(1.0);
    calque_mur.setPipeline('Light2D');
    calque_obstacle.setPipeline('Light2D');
    room_01.setPipeline('Light2D');


    light = this.lights.addLight(0, 0, 400).setIntensity(1).setScrollFactor(1.0);

    this.lights.enable().setAmbientColor(0x000000);

    
    room_00_hitbox = this.add.rectangle(1756   , 5120, 350, 250);
    this.physics.add.existing(room_00_hitbox,false);

    this.physics.add.overlap(this.player,room_00_hitbox,function is_in_room_01(){position.is_in_room_01 =true;console.log("ye")},null,this)

    
    this.input.on('pointermove', function PointerMoved(pointer) {

        playerStats.Torche_angle = Phaser.Math.Angle.Between(playerStats.mouse_x,playerStats.mouse_y,playerStats.x,playerStats.y)


        playerStats.mouse_x = (pointer.x)+playerStats.x-450;
        playerStats.mouse_y = (pointer.y)+playerStats.y-450;

    
    });

    this.input.on('pointerdown', function PointerDown(pointer){

        console.log("x :",(pointer.x)+playerStats.x-450,"  y :",(pointer.y)+playerStats.y-450)

        if(playerStats.Torche_status){
            light.setIntensity(0);
            playerStats.Torche_status = false;
        }else{
            light.setIntensity(1)
            playerStats.Torche_status = true;
        }

    })



    //room_light_01_01 = this.lights.addLight(1550,5116,300).setIntensity(0.5).setColor(0xFFF03B)
    //room_light_01_02 = this.lights.addLight(1970,5116,300).setIntensity(0.5).setColor(0xFFF03B)

    

    //this.lights.addLight(playerStats.x, playerStats.y, 100).setColor(0xff0000).setIntensity(3.0);


    //this.lights.addLight(0, 100, 100).setColor(0xff0000).setIntensity(3.0);


    
    




    

    


    // redimentionnement du monde avec les dimensions calculées via tiled
    this.physics.world.setBounds(0, 0, 4096, 6144);
    //  ajout du champs de la caméra de taille identique à celle du monde
    this.cameras.main.setBounds(0, 0, 4096, 6144);
    // ancrage de la caméra sur le joueur
    this.cameras.main.startFollow(this.player); 
    this.cameras.main.zoom = 1;

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('perso', {start:0,end:3}),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'turn',
        frames: [ { key: 'perso', frame: 4 } ],
        frameRate: 20
    });
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('perso', {start:5,end:8}),
        frameRate: 10,
        repeat: -1
    });
    
    cursors = this.input.keyboard.createCursorKeys();


}







function update(){

    Update_Torch(light);


    playerStats.x = this.player.x;
    playerStats.y = this.player.y;

    var graphics = this.add.graphics({ lineStyle: { width: 4, color: 0xaa00aa } });

    graphics.strokeLineShape(playerStats.x,playerStats.y,playerStats.mouse_x,playerStats.mouse_y);

    

    if (cursors.right.isDown)                           
        {                               
            this.player.setVelocityX(playerStats.playerSpeed);                                                 
        } 
    else if (cursors.left.isDown)                           
        {                               
            this.player.setVelocityX(-playerStats.playerSpeed);                                                          
        }                                                   
    else {
        this.player.setVelocityX(0);
    }
    if (cursors.up.isDown)                           
        {                              
            this.player.setVelocityY(-playerStats.playerSpeed);                                               
        }
                                                       
    else if (cursors.down.isDown)                           
        {                               
            this.player.setVelocityY(playerStats.playerSpeed);                                                            
        } 

    else {
        this.player.setVelocityY(0);
    }

    if(position.is_in_room_01){
    room_00_light.forEach((l) => {
        l.setVisible(0);
    });}
    position.is_in_room_01 = false;

    position.forEach((l)=>{l=false});

}

function Update_Torch(light){

    

    playerStats.Torche_x = playerStats.x - Math.cos(playerStats.Torche_angle)*playerStats.Torche_radius;
    playerStats.Torche_y = playerStats.y - Math.sin(playerStats.Torche_angle)*playerStats.Torche_radius;

    light.x = playerStats.Torche_x
    light.y = playerStats.Torche_y


}

