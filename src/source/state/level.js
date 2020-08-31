import { c } from '../constants'
import * as menubar from '../component/menubar'
import { Map } from '../component/map'
import * as plant from '../component/plant'
import * as zombie from '../component/zombie'
import * as common from '../component/common'
import data from '../data.json'

export class Level {
    constructor(context, card_list) {
        this.context = context;
        // import map_data from '../map/level_0.json'
        this.map_data = require("../map/level_0.json");
        this.map = new Map(this, c.GRID_X_LEN, c.GRID_Y_LEN);
        this.map_y_len = c.GRID_Y_LEN;
        this.current_time = 0;
        this.game_info = {};
        this.game_info[c.CURRENT_TIME] = 0;
        this.game_info[c.LEVEL_NUM] = c.START_LEVEL_NUM;
        // this.style = { left: "100px", top: "200px", position: "fixed" }
        this.setupBackground();
        this.setupGroups();
        this.setupZombies();
        this.initState();
        this.initPlay(card_list);
    }

    setupBackground() {
        let img_index = this.map_data[c.BACKGROUND_TYPE]
        this.background_type = img_index
        this.background = data[c.BACKGROUND_NAME][img_index]
        // this.bg_rect = self.background.get_rect()

        // this.level = pg.Surface((self.bg_rect.w, self.bg_rect.h)).convert()
        // this.viewport = tool.SCREEN.get_rect(bottom=self.bg_rect.bottom)
        // this.viewport.x += c.BACKGROUND_OFFSET_X
    }

    setupGroups() {
        this.sun_group = []
        this.head_group = []
        this.plant_groups = []
        this.zombie_groups = []
        this.hypno_zombie_groups = []  // zombies who are hypno after eating hypnoshroom
        this.bullet_groups = []
        for (let i = 0; i < this.map_y_len; i++) {
            this.plant_groups.push([])
            this.zombie_groups.push([])
            this.hypno_zombie_groups.push([])
            this.bullet_groups.push([])
        }
    }
    setupZombies() {
        this.zombie_list = []
        let data = null;
        for (let i = 0; i < this.map_data[c.ZOMBIE_LIST].length; i++) {
            data = this.map_data[c.ZOMBIE_LIST][i];
            this.zombie_list.push([data['time'], data['name'], data['map_y']])
        }
        // console.log("level setupZombies",this.zombie_list);
        this.zombie_start_time = 0
        this.zombie_list.sort(function (item) { return item[0] });
        // console.log("level setupZombies",this.zombie_list);
    }

    update() {
        // console.log("level update");
        this.current_time = this.game_info[c.CURRENT_TIME] = this.current_time + 100;
        this.play();
        // this.current_time = this.game_info[c.CURRENT_TIME] = current_time;
        // if (this.state == c.CHOOSE) {
        //     this.choose(mouse_pos, mouse_click);
        // }
        // else if (this.state == c.PLAY) {
        //     this.play(mouse_pos, mouse_click);
        // }
    }
    initState() {
        if (c.CHOOSEBAR_TYPE in this.map_data) {
            this.bar_type = this.map_data[c.CHOOSEBAR_TYPE]
        } else {
            this.bar_type = c.CHOOSEBAR_STATIC
        }
        if (this.bar_type == c.CHOOSEBAR_STATIC) {
            this.initChoose()
        } else {
            let card_pool = menubar.getCardPool(this.map_data[c.CARD_POOL])
            this.initPlay(card_pool)
            if (this.bar_type == c.CHOSSEBAR_BOWLING) {
                this.initBowlingMap()
            }
        }
    }
    initChoose() {
        this.state = c.CHOOSE
        this.panel = new menubar.Panel(data.all_card_list, this.map_data[c.INIT_SUN_NAME])
    }
    initPlay(card_list) {
        this.state = c.PLAY;
        this.menubar = new menubar.MenuBar(this, card_list, this.map_data[c.INIT_SUN_NAME]);
        // this.setupGroups()
        // this.setupZombies()
        if (this.background_type == c.BACKGROUND_DAY && this.bar_type == c.CHOOSEBAR_STATIC) {
            this.produce_sun = true
        } else {
            this.produce_sun = false
        }
        this.sun_timer = this.current_time
    }

    play() {
        if (this.zombie_start_time == 0) {
            this.zombie_start_time = this.current_time
        }
        else if (this.zombie_list.length > 0) {
            let data = this.zombie_list[0];
            if (data[0] <= (this.current_time - this.zombie_start_time)) {
                this.createZombie(data[1], data[2]);
                this.zombie_list.shift();
            }
        }
        for (let i = 0; i < this.map_y_len; i++) {
            // 移除死掉的子弹
            if (this.bullet_groups[i].length > 0) {
                // this.context.$set(this.bullet_groups, i, this.bullet_groups[i].filter((item) => {
                //     return item.state != c.DIE
                // }));
                let die_bullets = [];
                // 更新剩下的子弹
                for (let j = 0; j < this.bullet_groups[i].length; j++) {
                    if (this.bullet_groups[i][j].state == c.DIE) {
                        die_bullets.push(j);
                    }
                    this.bullet_groups[i][j].update(this.game_info, i, j);
                }
                common.removeByIndexes(this.bullet_groups[i], die_bullets);
            }
            if (this.plant_groups[i].length > 0) {
                this.context.$set(this.plant_groups, i, this.plant_groups[i].filter((item) => {
                    return item.state != c.DIE
                }));
                for (let j = 0; j < this.plant_groups[i].length; j++) {
                    this.plant_groups[i][j].update(this.game_info, i, j);
                }
            }
            if (this.zombie_groups[i].length > 0) {
                this.context.$set(this.zombie_groups, i, this.zombie_groups[i].filter((item) => {
                    return item.state != c.DIE
                }));
                for (let j = 0; j < this.zombie_groups[i].length; j++) {
                    this.zombie_groups[i][j].update(this.game_info, i, j);
                }
            }
        }
        let die_suns = [];
        // 更新剩下的子弹
        for (let i = 0; i < this.sun_group.length; i++) {
            if (this.sun_group[i].state == c.DIE) {
                die_suns.push(i);
            }
            this.sun_group[i].update(this.game_info);
        }
        common.removeByIndexes(this.sun_group, die_suns);

        let die_heads = [];
        // 更新剩下的子弹
        for (let i = 0; i < this.head_group.length; i++) {
            if (this.head_group[i].state == c.DIE) {
                die_heads.push(i);
            }
            this.head_group[i].update(this.game_info);
        }
        common.removeByIndexes(this.head_group, die_heads);

        if (this.produce_sun) {
            if ((this.current_time - this.sun_timer) > c.PRODUCE_SUN_INTERVAL) {
                this.sun_timer = this.current_time;
                let [map_x, map_y] = this.map.getRandomMapIndex();
                let [x, y] = this.map.getMapGridPos(map_x, map_y);
                this.sun_group.push(new plant.Sun(this, x, 110, x, y));
            }
        }
        this.menubar.update(this.current_time)
        this.checkPlants();
        this.checkBulletCollisions();
        this.checkZombieCollisions()
    }
    createZombie(name, map_y) {
        let [left, top] = this.map.getMapGridPos(0, map_y);
        if (name == c.NORMAL_ZOMBIE) {
            this.zombie_groups[map_y].push(new zombie.NormalZombie(this, c.ZOMBIE_START_X, top, this.head_group));
        }
        // else if (name == c.CONEHEAD_ZOMBIE) {
        //     this.zombie_groups[map_y].push(new zombie.ConeHeadZombie(c.ZOMBIE_START_X, y, self.head_group))
        // }
        // else if (name == c.BUCKETHEAD_ZOMBIE) {
        //     this.zombie_groups[map_y].push(new zombie.BucketHeadZombie(c.ZOMBIE_START_X, y, self.head_group))
        // }
        // else if (name == c.FLAG_ZOMBIE) {
        //     this.zombie_groups[map_y].push(new zombie.FlagZombie(c.ZOMBIE_START_X, y, self.head_group))
        // }
        // else if (name == c.NEWSPAPER_ZOMBIE) {
        //     this.zombie_groups[map_y].push(new zombie.NewspaperZombie(c.ZOMBIE_START_X, y, self.head_group))
        // }
    }
    addPlant(plant_name) {
        // 在地图上添加植物
        // console.log(plant_name);
        if (!this.map.canSeedPlant()) {
            return;
        }
        let new_plant = null;
        let [x, y] = this.map.getMapGridPos(this.map.map_x, this.map.map_y);
        if (plant_name == c.SUNFLOWER) {
            new_plant = new plant.SunFlower(this, x, y, this.sun_group);
        }
        else if (plant_name == c.PEASHOOTER) {
            new_plant = new plant.PeaShooter(this, x, y, this.bullet_groups[this.map.map_y])
        }
        else if (plant_name == c.SNOWPEASHOOTER) {
            new_plant = new plant.SnowPeaShooter(this, x, y, this.bullet_groups[this.map.map_y])
            // new_plant = new plant.SnowPeaShooter(this, this.map.map_x, this.map.map_y, this.bullet_groups[this.map.map_y])
            // new_plant = new plant.SnowPeaShooter(x, y, self.bullet_groups[map_y])
        }
        else if (plant_name == c.WALLNUT) {
            new_plant = new plant.WallNut(this, x, y);
        }
        else if (plant_name == c.CHERRYBOMB) {
            new_plant = new plant.CherryBomb(this, x, y);
        }

        // else if (plant_name == c.THREEPEASHOOTER) {
        //     new_plant = new plant.ThreePeaShooter(x, y, self.bullet_groups[map_y])
        // }

        // else if (plant_name == c.REPEATERPEA) {
        //     new_plant = new plant.RepeaterPea(x, y, self.sun_group);
        // }
        // else if (plant_name == c.CHOMPER) {
        //     new_plant = new plant.Chomper(x, y, self.bullet_groups[map_y])
        // }

        // else if (plant_name == c.PuffShroom) {
        //     new_plant = new plant.PuffShroom(x, y, self.bullet_groups[map_y])
        // }

        // else if (plant_name == c.POTATOMINE) {
        //     new_plant = new plant.PotatoMine(x, y, self.sun_group);
        // }
        // else if (plant_name == c.SQUASH) {
        //     new_plant = new plant.Squash(x, y, self.bullet_groups[map_y])
        // }

        // else if (plant_name == c.SPIKEWEED) {
        //     new_plant = new plant.Spikeweed(x, y, self.bullet_groups[map_y])
        // }

        // else if (plant_name == c.JALAPENO) {
        //     new_plant = new plant.Jalapeno(x, y, self.sun_group);
        // }
        // else if (plant_name == c.SCAREDYSHROOM) {
        //     new_plant = new plant.ScaredyShroom(x, y, self.bullet_groups[map_y])
        // }

        // else if (plant_name == c.SUNSHROOM) {
        //     new_plant = new plant.SunShroom(x, y, self.bullet_groups[map_y])
        // }

        // else if (plant_name == c.ICESHROOM) {
        //     new_plant = new plant.IceShroom(x, y, self.sun_group);
        // }
        // else if (plant_name == c.HYPNOSHROOM) {
        //     new_plant = new plant.HypnoShroom(x, y, self.bullet_groups[map_y])
        // }

        // else if (plant_name == c.WALLNUTBOWLING) {
        //     new_plant = new plant.WallNutBowling(x, y, self.bullet_groups[map_y])
        // }

        // else if (plant_name == c.REDWALLNUTBOWLING) {
        //     new_plant = new plant.RedWallNutBowling(x, y)
        // }
        if (this.map.addPlant(new_plant)) {
            this.plant_groups[this.map.map_y].push(new_plant);
        }
        // console.log("level addPlant ",this.bullets_groups[this.map.map_y]);
        // console.log("level addPlant ",this.map.map_y);
        // console.log("level addPlant ",this.bullets_groups);



        // if new_plant.can_sleep and self.background_type == c.BACKGROUND_DAY:
        //     new_plant.setSleep()
        // self.plant_groups[map_y].add(new_plant)
        // if self.bar_type == c.CHOOSEBAR_STATIC:
        //     self.menubar.decreaseSunValue(self.select_plant.sun_cost)
        //     self.menubar.setCardFrozenTime(self.plant_name)
        // else:
        //     self.menubar.deleateCard(self.select_plant)

        // if self.bar_type != c.CHOSSEBAR_BOWLING:
        //     self.map.setMapGridType(map_x, map_y, c.MAP_EXIST)
        // self.removeMouseImage()

    }

    killPlant(plant) {
        let [map_x, map_y] = this.map.getMapIndex(plant.x, plant.y, c.MAP_EMPTY);
        if (this.bar_type != c.CHOSSEBAR_BOWLING) {
            this.map.setMapGridType(map_x, map_y, c.MAP_EMPTY);
        }
        if (plant.name == c.CHERRYBOMB || plant.name == c.JALAPENO ||
            (plant.name == c.POTATOMINE && !plant.is_init) ||
            plant.name == c.REDWALLNUTBOWLING) {
            this.boomZombies(plant.x, map_y, plant.explode_y_range,plant.explode_x_range)
        }
        else if (plant.name == c.ICESHROOM && plant.state != c.SLEEP) {
            this.freezeZombies(plant)
        }
        else if (plant.name == c.HYPNOSHROOM && plant.state != c.SLEEP) {
            let zombie = plant.kill_zombie
            zombie.setHypno()
            let _, map_y = this.map.getMapIndex(zombie.rect.centerx, zombie.rect.bottom)
            this.zombie_groups[map_y].remove(zombie)
            this.hypno_zombie_groups[map_y].add(zombie)
        }
        plant.kill();
    }

    checkPlants() {
        // console.log("level checkPlants");
        for (let i = 0; i < this.plant_groups.length; i++) {
            // console.log(i);
            for (let j = 0; j < this.plant_groups[i].length; j++) {
                let plant = this.plant_groups[i][j];
                // console.log(i,j);
                if (this.plant_groups[i][j].state != c.SLEEP) {
                    // console.log("level checkPlants");
                    this.checkPlant(plant, i)
                }
                if (this.plant_groups[i][j].health <= 0) {
                    this.killPlant(this.plant_groups[i][j]);
                }
            }
        }
    }
    checkPlant(plant, i) {
        // console.log("level checkplant");
        let zombie_len = this.zombie_groups[i].length;
        let can_attack = false;
        if (plant.name == c.THREEPEASHOOTER) {
            if (plant.state == c.IDLE) {
                if (zombie_len > 0) {
                    plant.setAttack()
                }
                else if ((i - 1) >= 0 && this.zombie_groups[i - 1].length > 0) {
                    plant.setAttack()
                }
                else if ((i + 1) < this.map_y_len && this.zombie_groups[i + 1].length > 0) {
                    plant.setAttack()
                }
            }
            else if (plant.state == c.ATTACK) {
                if (zombie_len > 0) {

                }
                else if ((i - 1) >= 0 && self.zombie_groups[i - 1].length > 0) {

                }
                else if ((i + 1) < self.map_y_len && self.zombie_groups[i + 1].length > 0) {

                }
                else {
                    plant.setIdle()
                }
            }
        }
        else if (plant.name == c.CHOMPER) {
            for (let i = 0; i < this.zombie_groups[i].length; i++) {
                if (plant.canAttack(zombie)) {
                    plant.setAttack(zombie, self.zombie_groups[i])
                    break
                }
            }
        }
        else if (plant.name == c.POTATOMINE) {
            for (let i = 0; i < this.zombie_groups[i].length; i++) {
                if (plant.canAttack(zombie)) {
                    plant.setAttack()
                    break
                }
            }
        }
        else if (plant.name == c.SQUASH) {
            for (let i = 0; i < this.zombie_groups[i].length; i++) {
                if (plant.canAttack(zombie)) {
                    plant.setAttack(zombie, this.zombie_groups[i])
                    break
                }
            }
        }
        else if (plant.name == c.SPIKEWEED) {
            for (let i = 0; i < this.zombie_groups[i].length; i++) {
                if (plant.canAttack(zombie)) {
                    can_attack = true;
                    break
                }
            }
            if (plant.state == c.IDLE && can_attack) {
                plant.setAttack(self.zombie_groups[i])
            }
            else if (plant.state == c.ATTACK && !can_attack) {
                plant.setIdle()
            }
        }
        else if (plant.name == c.SCAREDYSHROOM) {
            let need_cry = false;
            for (let i = 0; i < this.zombie_groups[i].length; i++) {
                if (plant.needCry(zombie)) {
                    need_cry = true;
                    break
                }
                else if (plant.canAttack(zombie)) {
                    can_attack = true;
                }
            }
            if (need_cry) {
                if (plant.state != c.CRY) {
                    plant.setCry()
                }
            }
            else if (can_attack) {
                if (plant.state != c.ATTACK) {
                    plant.setAttack()
                }
            }
            else if (plant.state != c.IDLE) {
                plant.setIdle()
            }

        }
        else if (plant.name == c.WALLNUTBOWLING || plant.name == c.REDWALLNUTBOWLING) {

        }
        else {
            if (plant.state == c.IDLE && zombie_len > 0) {
                for (let j = 0; j < this.zombie_groups[i].length; j++) {
                    if (plant.canAttack(this.zombie_groups[i][j])) {
                        can_attack = true;
                        break
                    }
                }
            }
            if (plant.state == c.IDLE && can_attack) {
                plant.setAttack(this.zombie_groups[i])
            }
            else if (plant.state == c.ATTACK && !can_attack) {
                plant.setIdle()
            }
        }
    }
    checkCollision(x_min, x_max, comment = "") {
        // let a_left = parseInt(a.style.left.replace(/px/g, ""));
        // let b_left = parseInt(b.style.left.replace(/px/g, ""));
        // console.log(comment, "level checkCollision", x_min, x_max, x_max - x_min);
        if (x_max - x_min < 0) {
            return true;
        }
        return false;

    }
    checkBulletCollisions() {
        for (let i = 0; i < this.map_y_len; i++) {
            for (let j = 0; j < this.bullet_groups[i].length; j++) {
                if (this.bullet_groups[i][j].state == c.FLY) {
                    for (let k = 0; k < this.zombie_groups[i].length; k++) {
                        if (this.zombie_groups[i][k].state != c.DIE &&
                            this.checkCollision(this.bullet_groups[i][j].x, this.zombie_groups[i][k].x, "checkBulletCollisions")
                        ) {
                            this.zombie_groups[i][k].setDamage(this.bullet_groups[i][j].damage, this.bullet_groups[i][j].ice)
                            this.bullet_groups[i][j].setExplode()
                        }
                    }
                }
            }
        }
    }
    checkZombieCollisions() {
        for (let i = 0; i < this.map_y_len; i++) {
            for (let j = 0; j < this.zombie_groups[i].length; j++) {
                if (this.zombie_groups[i][j].state != c.WALK) {
                    continue;
                }
                for (let k = 0; k < this.plant_groups[i].length; k++) {
                    if (!this.checkCollision(this.plant_groups[i][k].x + 120, this.zombie_groups[i][j].x, "checkZombieCollisions")) {
                        continue;
                    }
                    if (this.plant_groups[i][k].name == c.WALLNUTBOWLING &&
                        this.plant_groups[i][k].canHit(i)
                    ) {
                        this.zombie_groups[i][j].setDamage(c.WALLNUT_BOWLING_DAMAGE)
                        this.plant_groups[i][k].changeDirection(i);
                    }
                    else if (this.plant_groups[i][k].name == c.REDWALLNUTBOWLING &&
                        this.plant_groups[i][k].state == c.IDLE
                    ) {
                        this.plant_groups[i][j].setAttack();
                    }
                    else if (this.plant_groups[i][k].name != c.SPIKEWEED) {
                        this.zombie_groups[i][j].setAttack(this.plant_groups[i][k]);
                    }
                }
            }
        }
    }

    boomZombies(x, map_y, y_range, x_range){
        for(let i=0;i<this.map_y_len;i++){
           if(Math.abs(i - map_y) > y_range) {
               continue;
           }
           for(let j=0;j<this.zombie_groups[i].length;i++){
                if(Math.abs(this.zombie_groups[i][j].x - x) <=x_range) {
                    this.zombie_groups[i][j].setBoomDie();
                }
           }
        }
    }
}