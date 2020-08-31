
export class State {
    constructor() {
        this.start_time = 0.0
        this.current_time = 0.0
        this.done = False
        this.next = None
        this.persist = {}
    }
    startup(current_time, persist) {

    }
    cleanup() {
        this.done = False
        return this.persist
    }
    update(surface, keys, current_time) {

    }

}

export class Control {
    constructor() {
        this.done = False
        this.fps = 60
        this.mouse_pos = None
        this.mouse_click = [False, False]
        this.current_time = 0.0
        this.state_dict = {}
        this.state_name = None
        this.state = None
        this.game_info = { c.CURRENT_TIME: 0.0, c.LEVEL_NUM: c.START_LEVEL_NUM }
    }
    setup_states(state_dict, start_state) {
        this.state_dict = state_dict
        this.state_name = start_state
        this.state = this.state_dict[this.state_name]
        this.state.startup(this.current_time, this.game_info)
    }
    update() {
        if (this.state.done) {
            this.flip_state()
        }
        this.state.update(this.current_time, this.mouse_pos, this.mouse_click)
        this.mouse_pos = None
        this.mouse_click[0] = False
        this.mouse_click[1] = False
    }
    flip_state() {
        previous, this.state_name = this.state_name, this.state.next
        persist = this.state.cleanup()
        this.state = this.state_dict[this.state_name]
        this.state.startup(this.current_time, persist)
    }
    event_loop() {
        // for event in pg.event.get():
        // if event.type == pg.QUIT:
        //     this.done = True
        // elif event.type == pg.KEYDOWN:
        //     this.keys = pg.key.get_pressed()
        // elif event.type == pg.KEYUP:
        //     this.keys = pg.key.get_pressed()
        // elif event.type == pg.MOUSEBUTTONDOWN:
        //     this.mouse_pos = pg.mouse.get_pos()
        //     this.mouse_click[0], _, this.mouse_click[1] = pg.mouse.get_pressed()
        //     print('pos:', this.mouse_pos, ' mouse:', this.mouse_click)
    }
    main() {
        while (this.done) {
            this.event_loop()
            this.update()
            pg.display.update()
            this.clock.tick(this.fps)
        }
    }
}





