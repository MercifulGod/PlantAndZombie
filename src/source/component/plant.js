import { c } from '../constants'
import data from '../data.json'

let plant_name_list = data.plant_name_list;
let card_name_list = data.card_name_list;
let plant_sun_list = data.plant_sun_list;
let plant_frozen_time_list = data.plant_frozen_time_list;


export class Bullet {
    constructor(left, top, dest_top, name, damage, ice) {
        this.name = name
        this.frames = []
        this.frame_index = 0
        this.load_images()
        this.frame_num = this.frames.length
        this.image = this.frames[this.frame_index]
        // this.rect = self.image.get_rect()
        // this.rect.centerx = x
        // this.rect.bottom = start_y
        // self.rect.y = start_y
        // self.dest_y = dest_y
        this.y_vel = (dest_top > top) ? 4 : -4
        this.x_vel = 4
        this.x = left
        this.y = top
        // this.style = { left: left, top: top, position: "fixed" }

        this.damage = damage
        this.ice = ice
        this.state = c.FLY
        this.current_time = 0
    }
    getStyle() {
        return { left: this.x + "px", top: this.y + "px", position: "fixed" }
    }
    loadFrames(frames, name, color = c.BLACK) {
        let frame_list = data[name];
        for (let i = 0; i < frame_list.length; i++) {
            frames.push(require("../../assets/" + frame_list[i]));
        }
    }
    load_images() {
        this.fly_frames = [];
        this.explode_frames = [];
        let fly_name = this.name;
        let explode_name = null;
        if (this.name == c.BULLET_MUSHROOM) {
            explode_name = 'BulletMushRoomExplode'
        }
        else {
            explode_name = 'PeaNormalExplode'
        }
        this.loadFrames(this.fly_frames, fly_name)
        this.loadFrames(this.explode_frames, explode_name)
        this.frames = this.fly_frames
    }
    update(game_info, i, j) {
        this.current_time = game_info[c.CURRENT_TIME]
        if (this.state == c.FLY) {

            // if this.rect.y != self.dest_y:
            //     this.rect.y += self.y_vel
            //     if self.y_vel * (self.dest_y - self.rect.y) < 0:
            //         self.rect.y = self.dest_y
            // console.log("plant bullet update", parseInt(this.style.left.replace(/px/g, "")));
            // console.log("plant bullet update", parseInt(this.style.left.replace(/px/g, "")));
            // let left = parseInt(this.style.left.replace(/px/g, "")) + this.x_vel
            this.x += this.x_vel;
            if (this.x > c.SCREEN_WIDTH) {
                this.kill();
            }
            // this.style.left = left + "px";
            // console.log("子弹更新update", i, j,this.style.left);
        }
        else if (this.state == c.EXPLODE) {
            if ((this.current_time - this.explode_timer) > 500) {
                this.kill()
            }
        }
    }
    kill() {
        this.state = c.DIE;
    }
    setExplode() {
        this.state = c.EXPLODE
        this.explode_timer = this.current_time
        this.frames = this.explode_frames
        this.image = this.frames[this.frame_index]
    }
}

export class Plant {
    constructor(context, x, y, name, health, bullet_group, scale = 1) {
        this.context = context
        this.opacity = 1
        // this.style = { left: x, top: y, position: "fixed", "z-index": 99 }
        this.frames = []
        this.frame_index = 0
        this.loadImages(name, scale)
        this.frame_num = this.frames.length
        this.image = this.frames[this.frame_index]
        // this.map_x = map_x
        // this.map_y = map_y
        // let [x, y] = this.context.map.getMapGridPos(map_x, map_y);
        this.x = x
        this.y = y
        // this.rect = self.image.get_rect()
        // this.rect.centerx = x
        // this.rect.bottom = y
        this.name = name
        this.health = health
        this.state = c.IDLE
        this.bullet_group = bullet_group
        this.can_sleep = false
        this.animate_timer = 0
        this.animate_interval = 100
        this.hit_timer = 0

    }
    getStyle() {
        return { left: this.x + "px", top: this.y + "px", position: "fixed", "z-index": 99, opacity: this.opacity }
    }
    loadFrames(frames, name, color = c.BLACK) {
        let paths = data[name];
        for (let i = 0; i < paths.length; i++) {
            frames.push(require("../../assets/" + paths[i]));
        }
    }
    loadImages(name, scale) {
        this.loadFrames(this.frames, name, scale)
    }
    changeFrames(frames) {
        //change image frames and modify rect position'''
        this.frames = frames
        this.frame_num = this.frames.length;
        this.frame_index = 0
        this.image = this.frames[this.frame_index]

    }

    update(game_info) {
        this.current_time = game_info[c.CURRENT_TIME]
        this.handleState()
        this.animation()
    }
    handleState() {
        if (this.state == c.IDLE) {
            this.idling();
        }
        else if (this.state == c.ATTACK) {
            this.attacking();
        }
        else if (this.state == c.DIGEST) {
            this.digest();
        }
    }
    idling() { }
    attacking() { }
    digest() { }
    animation() {
        if ((this.current_time - this.animate_timer) > this.animate_interval) {
            this.frame_index += 1;
            if (this.frame_index >= this.frame_num) {
                this.frame_index = 0;
            }
            this.animate_timer = this.current_time;
        }
        this.image = this.frames[this.frame_index];
        if ((this.current_time - this.hit_timer) >= 200) {
            this.opacity = 1
        } else {
            this.opacity = 0.7
        }
    }
    canAttack(zombie) {
        if (this.state != c.SLEEP && zombie.state != c.DIE && this.x <= zombie.x) {
            return true
        }
        return false
    }
    setAttack() {
        this.state = c.ATTACK;
    }
    setIdle() {
        this.state = c.IDLE;
        this.is_attacked = false;
    }
    setSleep() {
        this.state = c.SLEEP;
    }
    setDamage(damage, zombie) {
        this.health -= damage
        this.hit_timer = this.current_time
        if (this.health == 0) {
            this.kill_zombie = zombie
        }
    }
    kill() {
        this.state = c.DIE;
    }
}
export class Sun extends Plant {
    constructor(context, x, y, dest_x, dest_y, is_big = true) {
        let scale = is_big ? 0.9 : 0.6;
        super(context, x, y, c.SUN, 0, null, scale);
        this.sun_value = is_big ? c.SUN_VALUE : 12
        this.move_speed = 1
        this.dest_x = dest_x
        this.dest_y = dest_y
        this.die_timer = 0
    }
    handleState() {
        if (this.x != this.dest_x) {
            this.x += this.x < this.dest_x ? this.move_speed : -this.move_speed;
        }
        if (this.y != this.dest_y) {
            this.y += this.y < this.dest_y ? this.move_speed : -this.move_speed;
        }
        if (this.x == this.dest_x && this.y == this.dest_y) {
            if (this.die_timer == 0) {
                this.die_timer = this.current_time
            }
            else if ((this.current_time - this.die_timer) > c.SUN_LIVE_TIME) {
                this.state = c.DIE;
                this.kill();
            }
        }

    }
    clickHandler(menubar) {
        this.state = c.DIE
        this.kill()
        menubar.increaseSunValue(this.sun_value);
    }
}


export class SunFlower extends Plant {
    constructor(context, x, y, sun_group) {
        super(context, x, y, c.SUNFLOWER, c.PLANT_HEALTH, null);
        this.sun_timer = 0
        this.sun_group = sun_group
    }
    idling() {
        if (this.sun_timer == 0) {
            // this.sun_timer = this.current_time - (c.FLOWER_SUN_INTERVAL - 6000)
            this.sun_timer = this.current_time;
        } else if ((this.current_time - this.sun_timer) > c.FLOWER_SUN_INTERVAL) {
            this.sun_group.push(new Sun(this.context, this.x, this.y, this.x + 100, this.y + 100))
            this.sun_timer = this.current_time
        }
    }
}


export class WallNut extends Plant {
    constructor(context, x, y) {
        super(context, x, y, c.WALLNUT, c.WALLNUT_HEALTH, null);
        this.load_images()
        this.cracked1 = false
        this.cracked2 = false
    }
    load_images() {
        this.cracked1_frames = [];
        this.cracked2_frames = [];

        let cracked1_frames_name = this.name + '_cracked1';
        let cracked2_frames_name = this.name + '_cracked2';

        this.loadFrames(this.cracked1_frames, cracked1_frames_name, 1);
        this.loadFrames(this.cracked2_frames, cracked2_frames_name, 1);
    }
    idling() {
        if (!this.cracked1 && this.health <= c.WALLNUT_CRACKED1_HEALTH) {
            this.changeFrames(this.cracked1_frames)
            this.cracked1 = true
        } else if (!this.cracked2 && this.health <= c.WALLNUT_CRACKED2_HEALTH) {
            this.changeFrames(this.cracked2_frames)
            this.cracked2 = true
        }
    }
}


export class CherryBomb extends Plant {

    constructor(context, x, y) {
        super(context, x, y, c.CHERRYBOMB, c.WALLNUT_HEALTH, null);
        this.state = c.ATTACK
        this.start_boom = false
        this.bomb_timer = 0
        this.explode_y_range = 1
        this.explode_x_range = c.GRID_X_SIZE

    }
    setBoom() {
        let frame = data[c.CHERRY_BOOM_IMAGE];
        this.image = frame[0];
        this.start_boom = true;
    }
    animation() {
        if (this.start_boom) {
            if (this.bomb_timer == 0) {
                this.bomb_timer = this.current_time
            }
            else if ((this.current_time - this.bomb_timer) > 500) {
                this.health = 0;
            }
        }
        else {
            if ((this.current_time - this.animate_timer) > 100) {
                this.frame_index += 1;
                if (this.frame_index >= this.frame_num) {
                    this.setBoom();
                    return
                }
                this.animate_timer = this.current_time;
            }
            this.image = this.frames[this.frame_index];
        }
    }
}

export class PeaShooter extends Plant {
    constructor(context, x, y, bullet_group) {
        super(context, x, y, c.PEASHOOTER, c.PLANT_HEALTH, bullet_group);
        this.shoot_timer = 0
    }
    attacking() {
        if ((this.current_time - this.shoot_timer) > 2000) {
            let x = this.x + c.GRID_X_SIZE;
            let y = this.y + 30;
            this.bullet_group.push(new Bullet(x, y, 1, c.BULLET_PEA, c.BULLET_DAMAGE_NORMAL, true));
            this.shoot_timer = this.current_time;
        }
    }

}

export class SnowPeaShooter extends Plant {
    constructor(context, x, y, bullet_group) {
        super(context, x, y, c.SNOWPEASHOOTER, c.PLANT_HEALTH, bullet_group);
        this.shoot_timer = 0
    }
    attacking() {
        // console.log("plant SnowPeaShooter attacking", this.current_time,this.bullet_group.length);
        // console.log("plant SnowPeaShooter attacking", this.shoot_timer,this.context.bullet_groups[1].length);
        // let left = this.map_x * c.GRID_X_SIZE + 150 + "px";
        // let top = this.map_y * c.GRID_Y_SIZE + 100 + "px";
        let x = this.x + 150;
        let y = this.y + 30;
        if ((this.current_time - this.shoot_timer) > 2000) {
            this.bullet_group.push(new Bullet(x, y, 1, c.BULLET_PEA_ICE, c.BULLET_DAMAGE_NORMAL, true));
            // this.bullet_group.push(new Bullet(left, top, 1,
            //     c.BULLET_PEA_ICE, c.BULLET_DAMAGE_NORMAL, true))
            this.shoot_timer = this.current_time;
        }
    }
}




