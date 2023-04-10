var playerStats = {
    playerSpeed: 200,

    Global_HP : 4,

    iframe : 0,
    hurt : false,

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
var player_inventory = {

    has_Lampe : false,
    has_Explosive : false,
    has_ElecTonfa : false,
    has_TungRode : false

}

var still = false;
var dir_up = false;
var dir_down = false;
var dir_right = false;
var dir_left = false;

var four_sec_clock = 0;
// liste qui contiendra les booleens permettant de connaitre la position du joueur
var position = [];

// creation de la classe du premier ennemies movible l'evolved blob



class station extends Phaser.Scene {
    constructor() {

        super("station");
    }

    
    preload() {

        this.load.spritesheet('perso','assets/perso.png',
        { frameWidth: 44, frameHeight: 56 });
        this.load.spritesheet('main perso top','assets/main perso top.png',{frameWidth: 33, frameHeight: 64 });
        this.load.spritesheet('main perso top hurt','assets/main perso top hurt.png',{frameWidth: 33, frameHeight: 64 });
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
        for(var i = 0; i < 16 ; i++){
            this.load.image('blob '+i,'assets/blob '+i+'.png');
        }
        this.load.spritesheet('evolved_blob','assets/evolved_blob.png',{frameWidth:25, frameHeight:61});



        
        //dictionaire contenant les variables utiliser dans le programmes

        
    var cursors;
    var gameOver;

    gameOver=false;

    }
    create() {

        //prise en compte des touche

        this.keys = this.input.keyboard.addKeys('E');

        //creation des animations
        //  animation du joueur
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
            key: 'default',
            frames: [{key: 'main perso top', frame :0}],
            framerate: 20
    
        })
        this.anims.create({
            key: 'player hurt',
            frames: [{key: 'main perso top hurt', frame :0}],
            framerate: 20
        })


        //animation des evolved blobs
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

        
        //on crée la barre de vie
        //this.barre_de_vie = this.physics.add.sprite(playerStats.SpawnXcoord,playerStats.SpawnYcoord,'1HP_sheet')

        //this.barre_de_vie.setScrollFactor(0);


        //On importe la carte depuis tiled
        const carteDuNiveau = this.add.tilemap("carte");
        const tileset = carteDuNiveau.addTilesetImage(
            "temp tileset",
            "Phaser_tileset"
        );
        const calque_sol = carteDuNiveau.createLayer("sol",tileset);
        const calque_mur = carteDuNiveau.createLayer("mur",tileset);
        const calque_pits = carteDuNiveau.createLayer('sur sol',tileset);

        //on rend "solide" les murs
        calque_mur.setCollisionByProperty({estSolide: true});
    

        //Le joueur est contitué de 2 sprite supperposé legs qui pointra vers ou le joueur se dirige et legs qui pointra la ou le joueur vise
        this.legs = this.physics.add.sprite(playerStats.SpawnXcoord, playerStats.SpawnYcoord, 'leg_sprite')
        this.player = this.physics.add.sprite(playerStats.SpawnXcoord, playerStats.SpawnYcoord, 'main perso top');

        

        this.player.setCollideWorldBounds(false);
        //On rajoute un collider pour l'interaction entre le joueur et les murs
        this.physics.add.collider(this.player, calque_mur);

        // on retrefcit a 25x25 la hitbox du joueur
        this.player.setSize(25,25);
        this.legs.setSize(25,25);

        //Une list qui contiendra toute nos light
        this.room_list = [];
        this.room_test =[];
        //Une liste qui contiendra toute les hitboxs de nos salles respectives
        this.detect_hitbox_list = [];
        // Une liste qui contiendra les booleens permettant de connaitre la position du joueur 
        this.room_position =[];

        //On declare avec des variables les codes des couleurs en hexa des différents light
        this.yellow = 0xf2ed4b;
        this.red = 0xF93232;
        this.green = 0xa2ec30;
        this.blue = 0xB0EAE2;

        // on crée une liste qui affectera les couleurs au salle correspondant a leurs index
        this.room_colors_list = [this.yellow,this.yellow,this.yellow,this.yellow,this.red,this.yellow,this.green,this.green,this.red,this.red,this.red,this.red,this.blue,this.blue,this.blue,this.blue,this.blue,this.blue]
    
        this.test = this.player;

        for(let  room =0; room <18; room++){
            this.room_list[room] = [];
            this.room_test[room]= [];
            this.detect_hitbox_list[room]= [];
            this.room_position[room]=[];
            console.log(room);
            carteDuNiveau.getObjectLayer('room lights/room '+room+' light').objects.forEach((nl,i) => {
    
            
            
                this.room_list[room][i]=(this.lights.addLight(nl.x,nl.y,300).setIntensity(1).setColor(this.room_colors_list[room]));
    
            
            
        });
        carteDuNiveau.getObjectLayer('detection room/room detect '+room).objects.forEach((nl,i) => {
    
            this.detect_hitbox_list[room][i] = this.add.rectangle(nl.x+nl.width/2,nl.y+nl.height/2 , nl.width, nl.height);
            this.physics.add.existing(this.detect_hitbox_list[room][i],false);
            this.room_test[room][i]=i;
    
            this.room_position[room][i]= false;
    
            this.physics.add.overlap(this.player,this.detect_hitbox_list[room][i],function is_in_room(){this.room_position[room][i] =true},null,this)
    
            //console.log("nique",i,"x",nl.x+32,"y",nl.y+32,"w",nl.width,"h",nl.height);
        });
    
        
    
    }
    //this.inventory = [];

    // on crée l'items de la lampe torche depuis son layer tilled
    this.lampe_object = carteDuNiveau.getObjectLayer('items/lampe').objects[0]

    this.items = this.physics.add.group();
    this.items.create(this.lampe_object.x+32,this.lampe_object.y-32,'lampe').setPipeline('Light2D');

    // Les items étant obligatoirement récuperer dans un ordre précis on se permet
    // d'utiliser la meme fonction intechangablement sur chacun des items et en se basant sur l'ordre de récupération pour les identifier
    this.physics.add.overlap(this.player,this.items,picked_item_up,null,this);

    // on crée l'hitbox d'attaque de notre lampe torche
    this.torche_hitbox = this.add.rectangle(playerStats.SpawnXcoord,playerStats.SpawnYcoord, 80,80);
    this.physics.add.existing(this.torche_hitbox,false);
    //this.physics.add.overlap(torche_hitbox,room_00_hitbox,function torche_hit_blob(){position.is_in_room_01 =true},null,this)
    this.list_of_ennemies=[];
    this.evolved_blob_phy_group = this.physics.add.group();
    carteDuNiveau.getObjectLayer('ennemies/tier 1').objects.forEach((ev_blob,index) => {

        this.list_of_ennemies.push(new evolved_blob(index,ev_blob.x,ev_blob.y,ev_blob.width,ev_blob.height,'evolved_blob',this.evolved_blob_phy_group,this.physics,this,calque_mur,this.torche_hitbox))
            

    });

    //Les blobs sont les ennemies environementales pouvant etre nettoyer avec la lampe torche
    this.blobs = this.physics.add.group();
    this.catalogue_blob=[];

    for(var i = 0; i < 16 ; i++){

        this.physics.add.existing(this.torche_hitbox,false);this.catalogue_blob[i] = [];

    carteDuNiveau.getObjectLayer('blobs/blob '+i).objects.forEach((blob,index) => {


        this.blobs.create(blob.x+32,blob.y-32,'blob '+i).setPipeline('Light2D');
        
    });
}

    //On rajoute l'interaction permettant a la torche de supprimer les blob en appellant la fonction Torche_hit_blob
    this.physics.add.overlap(this.torche_hitbox,this.blobs,Torche_hit_blob,null,this);
    this.physics.add.overlap(this.player,this.blobs,Player_hit_blob,null,this);


    // On s'assure que les différents objects sont rendus avec le moteur de lumiere
    calque_sol.setPipeline('Light2D');
    this.player.setPipeline('Light2D');
    this.legs.setPipeline('Light2D');
    calque_pits.setPipeline('Light2D')
    //On empeche les mur de s'afficher pour etre sur qu'ils soit noir
    calque_mur.display = false


    // On rajoute l'effet de lumiere de lampe torche du joueur
    this.light = this.lights.addLight(0, 0, playerStats.Torche_in_radius).setIntensity(0).setScrollFactor(1.0);

    // on rajoute une lumiere personnelle qui s'alumera dans la salle 11 quand la lumiere de la salle s'éteins
    this.personal_light = this.lights.addLight(0,0,60).setIntensity(0.60).setColor(0xFFFFFF)

    // on active les lumiere et en profite pour mettre une lumiere ambiante noire pour simuler la pénombre
    this.lights.enable().setAmbientColor(0x000000);

    // On crée une fonction qui s'active quand le curseur est bouger pour actualiser la position de la lampe torche
    
    this.input.on('pointermove', function PointerMoved(pointer) {

        playerStats.Torche_angle = Phaser.Math.Angle.Between(playerStats.mouse_x,playerStats.mouse_y,playerStats.x,playerStats.y)
        playerStats.mouse_x = (pointer.x)+playerStats.x-800;
        playerStats.mouse_y = (pointer.y)+playerStats.y-450;

    
    });
    

    // On crée une fonction qui s'active quand le curseur est activé pour allumer ou éteindre la lampe torche
    this.input.on('pointerdown', function PointerDown(pointer,light){

        
            if(player_inventory.has_Lampe){

                //la lampe s'éteins si elle était allumé
                if(playerStats.Torche_status){
                playerStats.Torche_status = false;
                }else{// sinon elle s'allume
                playerStats.Torche_status = true;
                }
            }
        });
            

    this.cameras.main.startFollow(this.player); 
    this.cameras.main.zoom = 1.3;
    this.cursors = this.input.keyboard.createCursorKeys();



    }

    update() {

        if(this.keys.E.isDown){
            this.scene.launch('inventaire',{ playerStats
        })
        }
        if(playerStats.hurt==true){
            playerStats.iframe=playerStats.iframe+1;

            if(playerStats.iframe == 60){
                this.player.anims.play('default')
                playerStats.iframe = 0;
                playerStats.hurt = false;
            }
        }

        this.list_of_ennemies.forEach((e,i) => {
            e.Update_Behavior(this.player);
        });
    
        four_sec_clock = four_sec_clock+1
        if(four_sec_clock >= 240){
            four_sec_clock = 0;
        }
    
    
        Update_Torch(this.light,this.torche_hitbox,this.personal_light);
    
    
        playerStats.x = this.player.x;
        playerStats.y = this.player.y;
    
        var graphics = this.add.graphics({ lineStyle: { width: 4, color: 0xaa00aa } });
    
        graphics.strokeLineShape(playerStats.x,playerStats.y,playerStats.mouse_x,playerStats.mouse_y);
    
        
    
        if (this.cursors.right.isDown)                           
            {                               
                this.player.setVelocityX(playerStats.playerSpeed);
                this.legs.anims.play('walk',true); 
                still = false;
                dir_right = true
                                                    
            } 
    
        else if (this.cursors.left.isDown)                           
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
        if (this.cursors.up.isDown)                           
            {                              
                this.player.setVelocityY(-playerStats.playerSpeed);   
                this.legs.anims.play('walk',true);
                dir_up = true;
                dir_down = false;     
                still = false ; 
                this.legs.body.rotation  = 180;                                         
            }
                                                           
        else if (this.cursors.down.isDown)                           
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
        if(still){
            this.legs.anims.play('still',true);
        }
        
        
        
        position.is_in_room_01 = false;
    
        position.forEach((l)=>{l=false});
    
        
        for(let  room =0; room <18; room++){
    
            if(ConsolidateDetectionHitboxs(this.room_position[room])){
                this.room_list[room].forEach((l,log) => {
                    l.setVisible(1);
                    //console.log("visible",room,log)
    
                    // toute les 3.5s fait clignoter les lumiere de la salle 11 pour 0.5s
                    if(room == 11 && four_sec_clock >=130){
                    l.setVisible(0);
                    //console.log("lezgongue",room,log, four_sec_clock)
                    this.personal_light.setIntensity(0.6)
                    }else{
                        this.personal_light.setIntensity(0)
                    }
            });}else{
                this.room_list[room].forEach((l,log) => {
                l.setVisible(0);
                //console.log("non visible",room,log)
            })
            
            }
    
            
    
            this.room_position[room].forEach((r,i) => {
                this.room_position[room][i]= false;
                //console.log("detect",i,r);
            });
        }
    
        this.player.body.rotation = playerStats.Torche_angle * 57.22+90;
        this.legs.body.x = this.player.body.x;
        this.legs.body.y = this.player.body.y;
        
        
    }
}

   
    

function Update_Torch(light,torche_hitbox,personal_light){

    
    
    

    playerStats.Torche_x = playerStats.x - Math.cos(playerStats.Torche_angle)*playerStats.Torche_radius;
    playerStats.Torche_y = playerStats.y - Math.sin(playerStats.Torche_angle)*playerStats.Torche_radius;

    light.x = playerStats.Torche_x
    light.y = playerStats.Torche_y

    torche_hitbox.x = playerStats.x - Math.cos(playerStats.Torche_angle)*100;
    torche_hitbox.y = playerStats.y - Math.sin(playerStats.Torche_angle)*100;

    torche_hitbox.rotation = playerStats.Torche_angle;

    personal_light.x = playerStats.x
    personal_light.y = playerStats.y

    if(playerStats.Torche_status){
        light.setIntensity(1);
    }else{
        light.setIntensity(0);
    }

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

function picked_item_up(player,item,inventory){

    console.log(item);
    //inventory.push(item.name);
    item.setVisible(false);
    item.body.destroy();

    if(player_inventory.has_Lampe){

    }else{
        player_inventory.has_Lampe =true;
        playerStats.Torche_status = true;
        this.light.setIntensity(playerStats.Torche_intenstity)
    }

}

function aggro_evblob(hitbox,player,name){

    console.log(name)


}
function Player_hit_blob(player,blob){3

    if(playerStats.hurt == false){
        this.player.anims.play('player hurt',true)
        playerStats.Global_HP = playerStats.Global_HP-1
        console.log('aie');
    }
    playerStats.hurt = true;
    

}

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
            if(playerStats.Torche_status){
            this.blob.anims.play('evolved_blob hurt');
            if(this.invis_state){
                this.pv = this.pv -1
                this.invis_state = true
            }}
        },null,this)

        this.blob.anims.play('evolved_blob creep',true);
    
    }

    // Fonction permettant de mettre a jour le comportement de cet ennemie, a metre dans l'update
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

var global = {

        playerSpeed: 200,
    
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
    var player_inventory = {

        has_Lampe : false,
        has_Explosive : false,
        has_ElecTonfa : false,
        has_TungRode : false
    
    }

