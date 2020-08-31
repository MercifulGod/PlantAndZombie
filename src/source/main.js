
import { Level } from "./state/level";

export class Controler {
    constructor() {
        this.tick = 0
        this.interval = 100
        this.timer = null

        this.done = false
        this.mouse_pos = null
        this.mouse_click = [false, false]
        this.current_time = 0.0
        this.state_dict = {}
        this.state_name = null
        
        // this.game_info = { c.CURRENT_TIME: 0.0, c.LEVEL_NUM: c.START_LEVEL_NUM }
    }

    start(update) {
        if (this.interval <= 0 || this.timer) return;
        // this.timer = setInterval(this.update, this.interval);
        // this.timer = setInterval(()=>{this.update();}, this.interval);
        this.timer = setInterval(update, this.interval);
    }
    stop() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }
    update() {
        this.state.update();
        console.log(this.state);
        this.tick += 1;
        console.log(this.tick);
    }
}