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

    scene: {preload: preload, create: create, update: update }

   

};

new Phaser.Game(config);
var light;

function preload(){
    this.load.spritesheet('perso','assets/perso.png',
    { frameWidth: 44, frameHeight: 56 });
    this.load.image('main perso top','assets/main perso top.png');
    this.load.image('fond', 'assets/background.png')
    this.load.image("Phaser_tileset", "assets/Tileset.png");
    this.load.tilemapTiledJSON("carte", "assets/Map_Tiled.json");
    this.load.spritesheet('HP_Sprite','assets/PV_Sprite.png',
    {      frameWidth: 88, frameHeight: 113          });
    this.load.image('cactus','assets/cactus.png')
    this.load.image('checkpoint','assets/checkpoint.png')
    this.load.image('BigSaw','assets/Big_saw.png')
    this.load.image('Small_Saw','assets/Small_saw.png')
    this.load.spritesheet('leg_sprite','assets/leg sprite sheet.png',{frameWidth: 33, frameHeight: 40 })
    this.load.image('lampe','assets/flashlight.png');
    for(i = 0; i < 16 ; i++){
        this.load.image('blob '+i,'assets/blob '+i+'.png');
    }
    this.load.spritesheet('evolved_blob','assets/evolved_blob.png',{frameWidth:25, frameHeight:61});
}



var playerStats = {
    // player horizontal speed
    playerSpeed: 200,

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
    Torche_radius : 130,
    Torche_angle : 0,

    Torche_in_radius : 250,
    Torche_intenstity : 1,
}

var global_dic = {



}

var player_inventory = {

    has_Lampe : false,
    has_Explosive : false,
    has_ElecTonfa : false,
    has_TungRode : false

}

var position = [

    is_in_room_00 = false,
    is_in_room_01 = false,
    is_in_room_02 = false,

]

class evolved_blob {

    constructor(id,x,y,width,height,texture,group,physic_engine,parent,mur,torche){
        this.index = id;
        this.x = x;
        this.y =y;
        this.width = width;
        this.height = height;
        this.texture = texture;
        this.group = group;
        this.physics = physic_engine;
        this.parent = parent;
        this.agro = false;
        this.speed = 100;
        this.invis_counter = 0;
        this.invis_state = false;
        this.player_torch_hitbox = torche;
        this.pv = 3;

        this.blob = this.physics.add.sprite(this.x+this.width/2,this.y+this.height/2,'evolved_blob').setPipeline('Light2D');
        this.physics.add.collider(this.blob, mur);
        
        this.agro_hitbox = this.parent.add.rectangle(this.x+this.width/2,this.y+this.height/2 , 300, 300);
        this.physics.add.existing(this.agro_hitbox,false);
        this.physics.add.overlap(this.agro_hitbox,this.parent.player,function aggroes(){this.agro = true;this.blob.setVisible(false);},null,this)
        this.physics.add.overlap(this.blob,this.player_torch_hitbox, function torche_hits_blob(){
            this.blob.anims.play('evolved_blob hurt');
            if(this.invis_state == false){
                this.pv = this.pv -1
                this.invis_state = true
            }
        },null,this)

        this.blob.anims.play('evolved_blob creep',true);
        
    }

    Update_Behavior(player){

        if(this.pv <= 0){
            this.blob.anims.play('evolved_blob dead',true);
            this.blob.setVisible(false);
            this.blob.body.destroy();
            this.blob.setVisible(false);
        }

        if(this.invis_state = true){
            this.invis_counter = this.invis_counter+1;
            if(this.invis_counter>30){
                this.invis_state = false;
                this.invis_counter = 0;
                this.blob.anims.play('evolved_blob creep')
            }

        }

        if(this.agro == true){
            //console.log(this.agro);
            this.blob.setVisible(true)

            this.blob.body.rotation = Phaser.Math.Angle.Between(this.blob.x,this.blob.y,player.x,player.y)* 57.22-90;

            //console.log("x:",this.blob.x-player.x,'y:',this.blob.y-player.y)

            if(this.blob.x-player.x < -25){
            this.blob.setVelocityX(this.speed)
            }else if(this.blob.x-player.x > 25){
                this.blob.setVelocityX(-this.speed)
            }else{
                this.blob.setVelocityX(0);
            }

            if(this.blob.y-player.y < -25){
                this.blob.setVelocityY(this.speed)
                }else if (this.blob.y-player.y > 25){
                    this.blob.setVelocityY(-this.speed)
                }else{
                    this.blob.setVelocityY(0);
                }


        }

    }

    





}


var cursors;
var gameOver;

gameOver=false;

function create(){

    this.anims.create({
        key: 'walk',
        frames: this.anims.generateFrameNumbers('leg_sprite', {start:0,end:9}),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'still',
        frames: [{key: 'leg_sprite', frame :0}],
        framerate: 20

    })
    this.anims.create({
        key: 'evolved_blob creep',
        frames: this.anims.generateFrameNumbers('evolved_blob', {start:0,end:5}),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'evolved_blob hurt',
        frames: [{key: 'evolved_blob', frame :6}],
        framerate: 20,
        repeat: -1
    });
    this.anims.create({
        key: 'evolved_blob dead',
        frames: [{key: 'evolved_blob', frame :7}],
        framerate: 20,
        repeat: -1
    });


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
    //const room_01 = carteDuNiveau.createLayer("detection room/01",tileset);
    
    //const calque_obstacle = carteDuNiveau.createLayer("sur sol",tileset)
    
    
    calque_mur.setCollisionByProperty({estSolide: true});
    

    this.legs = this.physics.add.sprite(playerStats.SpawnXcoord, playerStats.SpawnYcoord, 'leg_sprite')

    this.player = this.physics.add.sprite(playerStats.SpawnXcoord, playerStats.SpawnYcoord, 'main perso top');

    

    this.player.setCollideWorldBounds(false);

    this.physics.add.collider(this.player, calque_mur);

    this.player.setSize(25,25);
    this.legs.setSize(25,25);
    
    room_list = [];
    room_test =[];
    detect_hitbox_list = [];

    yellow = 0xf2ed4b;
    red = 0xF93232;
    green = 0xa2ec30
    blue = 0xB0EAE2
    room_colors_list = [yellow,yellow,yellow,yellow,red,yellow,green,green,red,red,red,red,blue,blue,blue,blue,blue,blue]

    room_position =[];
 
    test = this.player

    //test2 = test.data;

    for(let  room =0; room <18; room++){
        room_list[room] = [];
        room_test[room]= [];
        detect_hitbox_list[room]= [];
        room_position[room]=[];
        console.log(room);
    carteDuNiveau.getObjectLayer('room lights/room '+room+' light').objects.forEach((nl,i) => {

        
        
        room_list[room][i]=(this.lights.addLight(nl.x,nl.y,300).setIntensity(1).setColor(room_colors_list[room]));

        
        
    });
    carteDuNiveau.getObjectLayer('detection room/room detect '+room).objects.forEach((nl,i) => {

        detect_hitbox_list[room][i] = this.add.rectangle(nl.x+nl.width/2,nl.y+nl.height/2 , nl.width, nl.height);
        this.physics.add.existing(detect_hitbox_list[room][i],false);
        room_test[room][i]=i;

        room_position[room][i]= false;

        this.physics.add.overlap(this.player,detect_hitbox_list[room][i],function is_in_room(){room_position[room][i] =true},null,this)

        //console.log("nique",i,"x",nl.x+32,"y",nl.y+32,"w",nl.width,"h",nl.height);
    });

    

}


inventory = [];

lampe_object = carteDuNiveau.getObjectLayer('items/lampe').objects[0]

items = this.physics.add.group();

items.create(lampe_object.x+32,lampe_object.y-32,'lampe').setPipeline('Light2D');

this.physics.add.overlap(this.player,items,picked_item_up,null,this);

torche_hitbox = this.add.rectangle(playerStats.SpawnXcoord,playerStats.SpawnYcoord, 80,80);

//this.physics.add.overlap(torche_hitbox,room_00_hitbox,function torche_hit_blob(){position.is_in_room_01 =true},null,this)
list_of_ennemies=[];
evolved_blob_phy_group = this.physics.add.group();
carteDuNiveau.getObjectLayer('ennemies/tier 1').objects.forEach((ev_blob,index) => {

    list_of_ennemies.push(new evolved_blob(index,ev_blob.x,ev_blob.y,ev_blob.width,ev_blob.height,'evolved_blob',evolved_blob_phy_group,this.physics,this,calque_mur,torche_hitbox))
        

});


this.physics.add.existing(torche_hitbox,false);

    blobs = this.physics.add.group();

    catalogue_blob=[];

    for(i = 0; i < 16 ; i++){

        catalogue_blob[i] = [];

    carteDuNiveau.getObjectLayer('blobs/blob '+i).objects.forEach((blob,index) => {


        blobs.create(blob.x+32,blob.y-32,'blob '+i).setPipeline('Light2D');;
        
    });
}

    this.physics.add.overlap(torche_hitbox,blobs,Torche_hit_blob,null,this);



    calque_sol.setPipeline('Light2D').setScrollFactor(1.0);
    //calque_mur.setPipeline('Light2D');
    //calque_obstacle.setPipeline('Light2D');
    //room_01.setPipeline('Light2D');
    calque_mur.display = false
    this.player.setPipeline('Light2D');
    this.legs.setPipeline('Light2D');


    light = this.lights.addLight(0, 0, playerStats.Torche_in_radius).setIntensity(0).setScrollFactor(1.0);

    personal_light = this.lights.addLight(0,0,60).setIntensity(0.60).setColor(0xFFFFFF)
    //torche_hitbox = this.add.circle(playerStats.SpawnXcoord, playerStats.SpawnYcoord, playerStats.Torche_in_radius);
    //this.physics.add.existing(torche_hitbox,false);

    this.lights.enable().setAmbientColor(0x000000);

    

    
    
    room_00_hitbox = this.add.rectangle(1756   , 5120, 350, 250);
    this.physics.add.existing(room_00_hitbox,false);

    /*
    room_list.forEach((hitbox) => {

        this.physics.add.overlap(this.)
    });
    */

    this.physics.add.overlap(this.player,room_00_hitbox,function is_in_room(){position.is_in_room_01 =true},null,this)

    
    this.input.on('pointermove', function PointerMoved(pointer) {

        playerStats.Torche_angle = Phaser.Math.Angle.Between(playerStats.mouse_x,playerStats.mouse_y,playerStats.x,playerStats.y)


        playerStats.mouse_x = (pointer.x)+playerStats.x-800;
        playerStats.mouse_y = (pointer.y)+playerStats.y-450;

    
    });

    this.input.on('pointerdown', function PointerDown(pointer){

        console.log("x :",(pointer.x)+playerStats.x-800,"  y :",(pointer.y)+playerStats.y-450)

            if(player_inventory.has_Lampe){

            if(playerStats.Torche_status){
                light.setIntensity(0);
                playerStats.Torche_status = false;
            }else{
                light.setIntensity(playerStats.Torche_intenstity)
                playerStats.Torche_status = true;
            }
    }

    })



    //room_light_01_01 = this.lights.addLight(1550,5116,300).setIntensity(0.5).setColor(0xFFF03B)
    //room_light_01_02 = this.lights.addLight(1970,5116,300).setIntensity(0.5).setColor(0xFFF03B)

    

    //this.lights.addLight(playerStats.x, playerStats.y, 100).setColor(0xff0000).setIntensity(3.0);


    //this.lights.addLight(0, 100, 100).setColor(0xff0000).setIntensity(3.0);


    
    




    

    


    // redimentionnement du monde avec les dimensions calculées via tiled
    //this.physics.world.setBounds(0, 0, 4096, 6144);
    //  ajout du champs de la caméra de taille identique à celle du monde
    //this.cameras.main.setBounds(0, 0, 8000, 8000);
    // ancrage de la caméra sur le joueur
    this.cameras.main.startFollow(this.player); 
    this.cameras.main.zoom = 1.3;


    /*
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
    */
    
    cursors = this.input.keyboard.createCursorKeys();


}


var still = false;
var dir_up = false;
var dir_down = false;
var dir_right = false;
var dir_left = false;

var four_sec_clock = 0;


function update(){

    list_of_ennemies.forEach((e,i) => {
        e.Update_Behavior(this.player);
    });

    four_sec_clock = four_sec_clock+1
    if(four_sec_clock >= 240){
        four_sec_clock = 0;
    }


    Update_Torch(light);


    playerStats.x = this.player.x;
    playerStats.y = this.player.y;

    var graphics = this.add.graphics({ lineStyle: { width: 4, color: 0xaa00aa } });

    graphics.strokeLineShape(playerStats.x,playerStats.y,playerStats.mouse_x,playerStats.mouse_y);

    

    if (cursors.right.isDown)                           
        {                               
            this.player.setVelocityX(playerStats.playerSpeed);
            this.legs.anims.play('walk',true); 
            still = false;
            dir_right = true
                                                
        } 

    else if (cursors.left.isDown)                           
        {                               
            this.player.setVelocityX(-playerStats.playerSpeed);   
            this.legs.anims.play('walk',true);   
            still = false   
            dir_right = false;
            dir_left = true;
            this.legs.body.rotation  = 270;                                           
        }                                                   
    else {
        dir_right = false;
        dir_left = false;
        this.player.setVelocityX(0);
        still = true
    }
    if (cursors.up.isDown)                           
        {                              
            this.player.setVelocityY(-playerStats.playerSpeed);   
            this.legs.anims.play('walk',true);
            dir_up = true;
            dir_down = false;     
            still = false ; 
            this.legs.body.rotation  = 180;                                         
        }
                                                       
    else if (cursors.down.isDown)                           
        {                               
            this.player.setVelocityY(playerStats.playerSpeed); 
            this.legs.anims.play('walk',true);
            dir_up = false;
            dir_down = true;  
            still = false   
                                                                     
        } 

    else {
        dir_up = false;
        dir_up = false;
        this.player.setVelocityY(0);  
    }

    if(dir_down){
        this.legs.body.rotation  = 0;
    }
    if(dir_right){
        this.legs.body.rotation  = 270;
    }
    if(dir_up){
        this.legs.body.rotation  = 180;
    }
    if(dir_left){
        this.legs.body.rotation  = 90;
    }
    if(dir_up && dir_right){
        this.legs.body.rotation  = 225;
    }
    if(dir_up && dir_left){
        this.legs.body.rotation  = 125;
    }
    if(dir_down && dir_right){
        this.legs.body.rotation  = 315;
    }
    if(dir_down && dir_left){
        this.legs.body.rotation  = 45;
    }

    //console.log('up',dir_up,'down',dir_down,'left',dir_left,'right',dir_right)
    









    if(still){
        this.legs.anims.play('still',true);
    }
    
    
    
    position.is_in_room_01 = false;

    position.forEach((l)=>{l=false});

    
    for(let  room =0; room <18; room++){

        if(ConsolidateDetectionHitboxs(room_position[room])){
            room_list[room].forEach((l,log) => {
                l.setVisible(1);
                //console.log("visible",room,log)

                // toute les 3.5s fait clignoter les lumiere de la salle 11 pour 0.5s
                if(room == 11 && four_sec_clock >=130){
                l.setVisible(0);
                //console.log("lezgongue",room,log, four_sec_clock)
                personal_light.setIntensity(0.6)
                }else{
                personal_light.setIntensity(0)
                }
        });}else{
            room_list[room].forEach((l,log) => {
            l.setVisible(0);
            //console.log("non visible",room,log)
        })
        
        }

        

        room_position[room].forEach((r,i) => {
            room_position[room][i]= false;
            //console.log("detect",i,r);
        });
    }

    this.player.body.rotation = playerStats.Torche_angle * 57.22+90;
    this.legs.body.x = this.player.body.x;
    this.legs.body.y = this.player.body.y;
    

}

function Update_Torch(light){

    
    
    

    playerStats.Torche_x = playerStats.x - Math.cos(playerStats.Torche_angle)*playerStats.Torche_radius;
    playerStats.Torche_y = playerStats.y - Math.sin(playerStats.Torche_angle)*playerStats.Torche_radius;

    light.x = playerStats.Torche_x
    light.y = playerStats.Torche_y

    torche_hitbox.x = playerStats.x - Math.cos(playerStats.Torche_angle)*100;
    torche_hitbox.y = playerStats.y - Math.sin(playerStats.Torche_angle)*100;

    torche_hitbox.rotation = playerStats.Torche_angle;

    personal_light.x = playerStats.x
    personal_light.y = playerStats.y

    //torche_hitbox.x = playerStats.Torche_x
    //torche_hitbox.x = playerStats.Torche_y


}

function ConsolidateDetectionHitboxs(hitbox_list){

    total = false;
    hitbox_list.forEach((h,i) => {
        if(h){
            total = true;
        }
    });
    return total;
}

function Torche_hit_blob(torche,blob){

    if(playerStats.Torche_status){

        blob.setVisible(false);
        blob.body.destroy();
        //console.log(blob)
}
}

function picked_item_up(player,item){

    console.log(item);
    inventory.push(item.name);
    item.setVisible(false);
    item.body.destroy();

    if(player_inventory.has_Lampe){

    }else{
        player_inventory.has_Lampe =true;
        playerStats.Torche_status = true;
        light.setIntensity(playerStats.Torche_intenstity)
    }

}

function aggro_evblob(hitbox,player,name){

    console.log(name)


}