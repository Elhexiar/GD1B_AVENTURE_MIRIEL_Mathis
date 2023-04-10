class inventaire extends Phaser.Scene {
    constructor() {

        super("inventaire");
    }

    preload() {
        this.load.image('inventaire background', 'assets/interface.png');
        this.load.spritesheet('0HP_sheet','assets/HealthBar_Sheet_0HP.png',{frameWidth:99, frameHeight:24});
        this.load.spritesheet('1HP_sheet','assets/HealthBar_Sheet_1HP.png',{frameWidth:99, frameHeight:24});
        this.load.spritesheet('2HP_sheet','assets/HealthBar_Sheet_2HP.png',{frameWidth:99, frameHeight:24});
        this.load.spritesheet('3HP_sheet','assets/HealthBar_Sheet_3HP.png',{frameWidth:99, frameHeight:24});
        this.load.spritesheet('4HP_sheet','assets/HealthBar_Sheet_4HP.png',{frameWidth:99, frameHeight:24});
    }
    create() {

        this.keys = this.input.keyboard.addKeys('A');
        var text = this.add.image(800,450,'inventaire background');
        text.setScale(2.0);
        //Animation de la barre de vie
        this.anims.create({
            key: '0HP',
            frames: this.anims.generateFrameNumbers('0HP_sheet', {start:0,end:5}),
            frameRate: 1.5,
            repeat: -1
        });
        this.anims.create({
            key: '1HP',
            frames: this.anims.generateFrameNumbers('1HP_sheet', {start:0,end:5}),
            frameRate: 1.5,
            repeat: -1
        });
        this.anims.create({
            key: '2HP',
            frames: this.anims.generateFrameNumbers('2HP_sheet', {start:0,end:5}),
            frameRate: 1.5,
            repeat: -1
        });
        this.anims.create({
            key: '3HP',
            frames: this.anims.generateFrameNumbers('3HP_sheet', {start:0,end:5}),
            frameRate: 1.5,
            repeat: -1
        });
        this.anims.create({
            key: '4HP',
            frames: this.anims.generateFrameNumbers('4HP_sheet', {start:0,end:5}),
            frameRate: 1.5,
            repeat: -1
        });

        this._0HP = this.add.sprite(1020,150,'0HP_sheet').setScale(2.0);
        this._0HP.anims.play('0HP');
        this._0HP.setVisible(0);

        this._1HP = this.add.sprite(1020,150,'1HP_sheet').setScale(2.0);
        this._1HP.anims.play('1HP');
        this._1HP.setVisible(0);

        this._2HP = this.add.sprite(1020,150,'2HP_sheet').setScale(2.0);
        this._2HP.anims.play('2HP');
        this._2HP.setVisible(0);

        this._3HP = this.add.sprite(1020,150,'3HP_sheet').setScale(2.0);
        this._3HP.anims.play('3HP');
        this._3HP.setVisible(0);
        
        this._4HP = this.add.sprite(1020,150,'4HP_sheet').setScale(2.0);
        this._4HP.anims.play('4HP');
        this._4HP.setVisible(0);

        this.lampe = this.add.sprite(975,525, 'lampe').setScale(2.0);
        
        
    }

    update() {


        if(this.keys.A.isDown){
            this.scene.setVisible(0);
        }
        if(playerStats.Global_HP <= 0){
            this._0HP.setVisible(1);
        }else{
            this._0HP.setVisible(0);
        }
        if(playerStats.Global_HP == 1){
            this._1HP.setVisible(1);
        }else{
            this._1HP.setVisible(0);
        }
        if(playerStats.Global_HP == 2){
            this._2HP.setVisible(1);
        }else{
            this._2HP.setVisible(0);
        }
        if(playerStats.Global_HP == 3){
            this._3HP.setVisible(1);
        }else{
            this._3HP.setVisible(0);
        }
        if(playerStats.Global_HP >= 4){
            this._4HP.setVisible(1);
        }else{
            this._4HP.setVisible(0);
        }
        if(player_inventory.has_Lampe){
            this.lampe.setVisible(1);
        }else{
            this.lampe.setVisible(0);
        }

}

   
    
};

var test = this.scene ;