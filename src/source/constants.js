class Constants {
    constructor() {
        this.__author__ = "marble_xu"

        this.START_LEVEL_NUM = 1
   
        this.ORIGINAL_CAPTION = "Plant VS Zombies Game"

        this.SCREEN_WIDTH = 800
        this.SCREEN_HEIGHT = 600
        this.SCREEN_SIZE = [this.SCREEN_WIDTH, this.SCREEN_HEIGHT]

        this.GRID_X_LEN = 9
        this.GRID_Y_LEN = 5
        this.GRID_X_SIZE = 80
        this.GRID_Y_SIZE = 100
 
        this.WHITE = (255, 255, 255)
        this.NAVYBLUE = (60, 60, 100)
        this.SKY_BLUE = (39, 145, 251)
        this.BLACK = (0, 0, 0)
        this.LIGHTYELLOW = (234, 233, 171)
        this.RED = (255, 0, 0)
        this.PURPLE = (255, 0, 255)
        this.GOLD = (255, 215, 0)
        this.GREEN = (0, 255, 0)

        this.SIZE_MULTIPLIER = 1.3

        //GAME INFO DICTIONARY KEYS
        this.CURRENT_TIME = "current time"
        this.LEVEL_NUM = "level num"

        // STATES FOR ENTIRE GAME
        this.MAIN_MENU = "main menu"
        this.LOAD_SCREEN = "load screen"
        this.GAME_LOSE = "game los"
        this.GAME_VICTORY = "game victory"
        this.LEVEL = "level"

        this.MAIN_MENU_IMAGE = "MainMenu"
        this.OPTION_ADVENTURE = "Adventure"
        this.GAME_LOOSE_IMAGE = "GameLoose"
        this.GAME_VICTORY_IMAGE = "GameVictory"

        // MAP COMPONENTS
        this.BACKGROUND_NAME = "Background"
        this.BACKGROUND_TYPE = "background_type"
        this.INIT_SUN_NAME = "init_sun_value"
        this.ZOMBIE_LIST = "zombie_list"

        this.MAP_EMPTY = 0
        this.MAP_EXIST = 1

        this.BACKGROUND_OFFSET_X = 220
        this.MAP_OFFSET_X = 35
        this.MAP_OFFSET_Y = 100

        // MENUBAR
        this.CHOOSEBAR_TYPE = "choosebar_type"
        this.CHOOSEBAR_STATIC = 0
        this.CHOOSEBAR_MOVE = 1
        this.CHOSSEBAR_BOWLING = 2
        this.MENUBAR_BACKGROUND = "ChooserBackground"
        this.MOVEBAR_BACKGROUND = "MoveBackground"
        this.PANEL_BACKGROUND = "PanelBackground"
        this.START_BUTTON = "StartButton"
        this.CARD_POOL = "card_pool"

        this.MOVEBAR_CARD_FRESH_TIME = 6000
        this.CARD_MOVE_TIME = 60

        // PLANT INFO
        this.PLANT_IMAGE_RECT = "plant_image_rect"
        this.CAR = "car"
        this.SUN = "Sun"
        this.SUNFLOWER = "SunFlower"
        this.PEASHOOTER = "Peashooter"
        this.SNOWPEASHOOTER = "SnowPea"
        this.WALLNUT = "WallNut"
        this.CHERRYBOMB = "CherryBomb"
        this.THREEPEASHOOTER = "Threepeater"
        this.REPEATERPEA = "RepeaterPea"
        this.CHOMPER = "Chomper"
        this.CHERRY_BOOM_IMAGE = "Boom"
        this.PUFFSHROOM = "PuffShroom"
        this.POTATOMINE = "PotatoMine"
        this.SQUASH = "Squash"
        this.SPIKEWEED = "Spikeweed"
        this.JALAPENO = "Jalapeno"
        this.SCAREDYSHROOM = "ScaredyShroom"
        this.SUNSHROOM = "SunShroom"
        this.ICESHROOM = "IceShroom"
        this.HYPNOSHROOM = "HypnoShroom"
        this.WALLNUTBOWLING = "WallNutBowling"
        this.REDWALLNUTBOWLING = "RedWallNutBowling"

        this.PLANT_HEALTH = 5
        this.WALLNUT_HEALTH = 30
        this.WALLNUT_CRACKED1_HEALTH = 20
        this.WALLNUT_CRACKED2_HEALTH = 10
        this.WALLNUT_BOWLING_DAMAGE = 10

        this.PRODUCE_SUN_INTERVAL = 7000
        this.FLOWER_SUN_INTERVAL = 22000
        this.SUN_LIVE_TIME = 7000
        this.SUN_VALUE = 25

        this.ICE_SLOW_TIME = 2000

        this.FREEZE_TIME = 7500
        this.ICETRAP = "IceTrap"

        // PLANT CARD INFO
        this.CARD_SUNFLOWER = "card_sunflower"
        this.CARD_PEASHOOTER = "card_peashooter"
        this.CARD_SNOWPEASHOOTER = "card_snowpea"
        this.CARD_WALLNUT = "card_wallnut"
        this.CARD_CHERRYBOMB = "card_cherrybomb"
        this.CARD_THREEPEASHOOTER = "card_threepeashooter"
        this.CARD_REPEATERPEA = "card_repeaterpea"
        this.CARD_CHOMPER = "card_chomper"
        this.CARD_PUFFSHROOM = "card_puffshroom"
        this.CARD_POTATOMINE = "card_potatomine"
        this.CARD_SQUASH = "card_squash"
        this.CARD_SPIKEWEED = "card_spikeweed"
        this.CARD_JALAPENO = "card_jalapeno"
        this.CARD_SCAREDYSHROOM = "card_scaredyshroom"
        this.CARD_SUNSHROOM = "card_sunshroom"
        this.CARD_ICESHROOM = "card_iceshroom"
        this.CARD_HYPNOSHROOM = "card_hypnoshroom"
        this.CARD_REDWALLNUT = "card_redwallnut"

        // BULLET INFO
        this.BULLET_PEA = "PeaNormal"
        this.BULLET_PEA_ICE = "PeaIce"
        this.BULLET_MUSHROOM = "BulletMushRoom"
        this.BULLET_DAMAGE_NORMAL = 1
 
        // ZOMBIE INFO
        this.ZOMBIE_IMAGE_RECT = "zombie_image_rect"
        this.ZOMBIE_HEAD = "ZombieHead"
        this.NORMAL_ZOMBIE = "Zombie"
        this.CONEHEAD_ZOMBIE = "ConeheadZombie"
        this.BUCKETHEAD_ZOMBIE = "BucketheadZombie"
        this.FLAG_ZOMBIE = "FlagZombie"
        this.NEWSPAPER_ZOMBIE = "NewspaperZombie"
        this.BOOMDIE = "BoomDie"

        this.LOSTHEAD_HEALTH = 5
        this.NORMAL_HEALTH = 10
        this.FLAG_HEALTH = 15
        this.CONEHEAD_HEALTH = 20
        this.BUCKETHEAD_HEALTH = 30
        this.NEWSPAPER_HEALTH = 15

        this.ATTACK_INTERVAL = 1000
        this.ZOMBIE_WALK_INTERVAL = 70

        // this.ZOMBIE_START_X = this.SCREEN_WIDTH + 50 +"px"
        this.ZOMBIE_START_X = this.SCREEN_WIDTH

        // STATE
        this.IDLE = "idle"
        this.FLY = "fly"
        this.EXPLODE = "explode"
        this.ATTACK = "attack"
        this.ATTACKED = "attacked"
        this.DIGEST = "digest"
        this.WALK = "walk"
        this.DIE = "die"
        this.CRY = "cry"
        this.FREEZE = "freeze"
        this.SLEEP = "sleep"

        // LEVEL STATE
        this.CHOOSE = "choose"
        this.PLAY = "play"

        // BACKGROUND
        this.BACKGROUND_DAY = 0
        this.BACKGROUND_NIGHT = 1
        
    }
}

export const c = new Constants()