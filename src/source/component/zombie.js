
import { c } from '../constants'
import data from '../data.json'

export class Zombie {
    constructor(context, x, y, name, health, head_group = null, damage = 1) {
        this.context = context
        this.name = name
        this.frames = []
        this.frame_index = 0
        this.loadImages()
        this.x = x
        this.y = y
        this.opacity = 1
        // this.style = { left: left, top: top, position: "fixed" }
        this.frame_num = this.frames.length
        this.image = this.frames[this.frame_index]
        // this.rect = this.image.get_rect()
        // this.rect.centerx = x
        // this.rect.bottom = y
        this.health = health
        this.damage = damage
        this.dead = false
        this.losHead = false
        this.helmet = false
        this.head_group = head_group
        this.walk_timer = 0
        this.animate_timer = 0
        this.attack_timer = 0
        this.state = c.WALK
        this.animate_interval = 150
        this.ice_slow_ratio = 1
        this.ice_slow_timer = 0
        this.hit_timer = 0
        this.speed = 1
        this.freeze_timer = 0
        this.is_hypno = false  // the zombie is hypo && attack other zombies when it ate a HypnoShroom
    }
    getStyle() {
        return { left: this.x + "px", top: this.y + "px", position: "fixed", opacity: this.opacity }
    }
    loadFrames(frames, name, colorkey = c.BLACK) {
        let frame_list = data[name];
        for (let i = 0; i < frame_list.length; i++) {
            frames.push(require("../../assets/" + frame_list[i]));
        }
    }
    update(game_info) {
        this.current_time = game_info[c.CURRENT_TIME]
        this.handleState()
        this.updateIceSlow()
        this.animation()

    }
    animation() {
        if (this.state == c.FREEZE) {
            this.image.set_alpha(192)
            return
        }
        if ((this.current_time - this.animate_timer) > (this.animate_interval * this.getTimeRatio())) {
            this.frame_index += 1
            if (this.frame_index >= this.frame_num) {
                if (this.state == c.DIE) {
                    this.kill()
                    return
                }
                this.frame_index = 0
            }
            this.animate_timer = this.current_time
        }
        this.image = this.frames[this.frame_index]
        if (this.is_hypno) {
            this.image = pg.transform.flip(this.image, true, false)
        }
        if ((this.current_time - this.hit_timer) >= 200) {
            this.opacity = 1
            // this.image.set_alpha(255)
        }
        else {
            this.opacity = 0.7
            // this.image.set_alpha(192)
        }
    }
    handleState() {
        if (this.state == c.WALK) {
            this.walking()
        }
        else if ((this.state == c.ATTACK)) {
            this.attacking()
        }
        else if (this.state == c.DIE) {
            this.dying()
        }
        else if (this.state == c.FREEZE) {
            this.freezing()
        }

    }

    walking() {
        if (this.health <= 0) {
            this.setDie();
        }

        else if (this.health <= c.LOSTHEAD_HEALTH && !this.losHead) {
            this.changeFrames(this.losthead_walk_frames);
            this.setLostHead();
        }
        else if (this.health <= c.NORMAL_HEALTH && this.helmet) {
            this.changeFrames(this.walk_frames)
            this.helmet = False
            if (this.name == c.NEWSPAPER_ZOMBIE) {
                this.speed = 2
            }

        }
        if ((this.current_time - this.walk_timer) > (c.ZOMBIE_WALK_INTERVAL * this.getTimeRatio())) {
            this.walk_timer = this.current_time
            if (this.is_hypno) {
                this.x += this.speed;
                // this.style.left = parseInt(this.style.left.replace(/px/g, "")) + this.speed + "px";
            }
            else {

                this.x -= this.speed;
            }
        }
    }
    attacking() {
        if (this.health <= 0) { this.setDie() }
        else if (this.health <= c.LOSTHEAD_HEALTH && !this.losHead) {
            this.changeFrames(this.losthead_attack_frames);
            this.setLostHead();
        }
        else if (this.health <= c.NORMAL_HEALTH && this.helmet) {
            this.changeFrames(this.attack_frames);
            this.helmet = false;
        }
        if ((this.current_time - this.attack_timer) > (c.ATTACK_INTERVAL * this.getTimeRatio())) {
            if (this.prey.health > 0) {
                if (this.prey_is_plant) {
                    this.prey.setDamage(this.damage, this)
                }
                else {
                    this.prey.setDamage(this.damage)
                };
            }
            this.attack_timer = this.current_time;
        }

        if (this.prey.health <= 0) {
            this.prey = null;
            this.setWalk();
        }
    }
    dying() { }
    freezing() {
        if (this.health <= 0) { this.setDie() }
        else if (this.health <= c.LOSTHEAD_HEALTH && !this.losHead) {
            if (this.old_state == c.WALK) {
                this.changeFrames(this.losthead_walk_frames)
            }
            else {
                this.changeFrames(this.losthead_attack_frames)
            }

            this.setLostHead()
        }
        if ((this.current_time - this.freeze_timer) > c.FREEZE_TIME) { this.setWalk() }
    }
    setLostHead() {
        this.losHead = true
        if (this.head_group != null) {
            this.head_group.push(new ZombieHead(this.context, this.x, this.y + 100));
        }
    }
    changeFrames(frames) {
        //'''change image frames and modify rect position'''
        this.frames = frames;
        this.frame_num = this.frames.length;
        this.frame_index = 0;
        this.image = this.frames[this.frame_index]
    }

    getTimeRatio() {
        return this.ice_slow_ratio
    }

    setIceSlow() {    //when get a ice bullet damage, slow the attack or walk speed of the zombie'''
        this.ice_slow_timer = this.current_time
        this.ice_slow_ratio = 2
    }
    updateIceSlow() {
        if (this.ice_slow_ratio > 1) {
            if ((this.current_time - this.ice_slow_timer) > c.ICE_SLOW_TIME) {
                this.ice_slow_ratio = 1
            }
        }
    }
    setDamage(damage, ice = false) {
        this.health -= damage
        this.hit_timer = this.current_time
        if (ice) {
            this.setIceSlow()
        }
    }
    setWalk() {
        this.state = c.WALK
        this.animate_interval = 150

        if (this.helmet) {
            this.changeFrames(this.helmet_walk_frames)
        }
        else if (this.losHead) {
            this.changeFrames(this.losthead_walk_frames)
        }
        else {
            this.changeFrames(
                this.walk_frames)
        }
    }
    setAttack(prey, is_plant = true) {
        this.prey = prey  // prey can be plant || other zombies
        this.prey_is_plant = is_plant
        this.state = c.ATTACK
        this.attack_timer = this.current_time
        this.animate_interval = 100

        if (this.helmet) {
            this.changeFrames(this.helmet_attack_frames)
        }
        else if (this.losHead) {
            this.changeFrames(this.losthead_attack_frames)
        }
        else {
            this.changeFrames(this.attack_frames)
        }
    }
    setDie() {
        this.state = c.DIE
        this.animate_interval = 200
        this.changeFrames(this.die_frames)
    }
    setBoomDie() {
        this.state = c.DIE
        this.animate_interval = 200
        this.changeFrames(this.boomdie_frames)
    }
    setFreeze(ice_trap_image) {
        this.old_state = this.state
        this.state = c.FREEZE
        this.freeze_timer = this.current_time
        this.ice_trap_image = ice_trap_image
        this.ice_trap_rect = ice_trap_image.get_rect()
        this.ice_trap_rect.centerx = this.rect.centerx
        this.ice_trap_rect.bottom = this.rect.bottom
    }
    drawFreezeTrap(surface) {
        if (this.state == c.FREEZE) {
            surface.blit(this.ice_trap_image, this.ice_trap_rect)
        }
    }
    setHypno() {
        this.is_hypno = true
        this.setWalk()
    }


}


export class ZombieHead extends Zombie {
    constructor(context, x, y) {
        super(context, x, y, c.ZOMBIE_HEAD, 0);
        this.state = c.DIE
    }
    loadImages() {
        this.die_frames = [];
        this.loadFrames(this.die_frames, this.name, 0);
        this.frames = this.die_frames;
    }
    setWalk() {
        this.animate_interval = 100;
    }

}


export class NormalZombie extends Zombie {
    constructor(context, x, y, head_group) {
        super(context, x, y, c.NORMAL_ZOMBIE, c.NORMAL_HEALTH, head_group);
    }
    loadImages() {
        this.walk_frames = []
        this.attack_frames = []
        this.losthead_walk_frames = []
        this.losthead_attack_frames = []
        this.die_frames = []
        this.boomdie_frames = []

        let walk_name = this.name
        let attack_name = this.name + 'Attack'
        let losthead_walk_name = this.name + 'LostHead'
        let losthead_attack_name = this.name + 'LostHeadAttack'
        let die_name = this.name + 'Die'
        let boomdie_name = c.BOOMDIE

        let frame_list = [
            this.walk_frames, this.attack_frames, this.losthead_walk_frames,
            this.losthead_attack_frames, this.die_frames, this.boomdie_frames
        ]
        let name_list = [
            walk_name, attack_name, losthead_walk_name,
            losthead_attack_name, die_name, boomdie_name
        ]

        for (let i = 0; i < name_list.length; i++) {
            this.loadFrames(frame_list[i], name_list[i])
        }
        this.frames = this.walk_frames
    }
}






















