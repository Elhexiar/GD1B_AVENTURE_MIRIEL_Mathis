class menu extends Phaser.Scene {
    constructor() {

        super("menu");
    }
    preload() {
        this.load.image('title_screen_text', 'assets/menu/title_card_text.png');
        this.load.image('title_screen_background', 'assets/menu/title_card_unlit_back.png');
        
    }
    create() {

        this.cursors = this.input.keyboard.createCursorKeys();

        const startSpace = Phaser.Input.Keyboard.JustDown(this.cursors.space);
        var background = this.add.image(800,450,'title_screen_background')
        var text = this.add.image(800,450,'title_screen_text');
 
        this.lights.enable().setAmbientColor(0x000000);
        this.new_light = this.lights.addLight(450,450,200).setIntensity(1.5)
        background.setPipeline('Light2D'); 
        //text.setPipeline('Light2D');
        this.time = 0;
        
    }


    update() {

        this.time = this.time+0.015;

        this.new_light.x = (Math.sin(this.time)*500)+800




        if(Phaser.Input.Keyboard.JustDown(this.cursors.space)){
            this.scene.start('station',{
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

                    has_Lampe : false,
                    has_Explosive : false,
                    has_ElecTonfa : false,
                    has_TungRode : false
            });
        }    
        
        
    }

   
    
};