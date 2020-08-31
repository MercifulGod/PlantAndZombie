import { c } from '../constants'
import data from '../data.json'

let plant_name_list = data.plant_name_list;
let card_name_list = data.card_name_list;
let plant_sun_list = data.plant_sun_list;
let plant_frozen_time_list = data.plant_frozen_time_list;

export function getCardPool(data) {
    let card_pool = [];
    for (let i = 0; i < data.length; i++) {
        let tmp = data[i]['name'];
        card_pool.push(plant_name_list.indexOf(tmp));
    }
    return card_pool
}


export class DragCard {
    constructor(context, name_index, left, top) {
        this.context = context;
        this.style = { left: left, top: top, position: "fixed" }
        this.image = null
        this.plant_name = plant_name_list[name_index]
        this.loadFrame(this.plant_name)

    }
    loadFrame(name) {
        let path = data[name][0];
        this.image = require("../../assets/" + path);
    }
    mouseMove(e) {
        //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
        let left = e.clientX - 30;
        let top = e.clientY - 30;
        //移动当前元素
        this.style.left = left + "px";
        this.style.top = top + "px";
    }
    update(e, event_type) {
        if (event_type == "mousemove") {
            this.mouseMove(e);
        }
    }

}

export class Card {
    constructor(context, name_index, scale = 0.78) {
        this.context = context;
        this.loadFrame(card_name_list[name_index], scale)
        this.style = { backgroundImage: 'url(' + this.image + ')', backgroundRepeat: 'no-repeat', backgroundSize: '100% 100%', opacity: 1 }
        this.name_index = name_index
        this.sun_cost = plant_sun_list[name_index]
        this.frozen_time = plant_frozen_time_list[name_index]
        this.frozen_timer = -this.frozen_time
        this.refresh_timer = 0
        this.select = true
    }

    update(sun_value, current_time) {
        if ((current_time - this.refresh_timer) >= 250) {
            // this.image = this.createShowImage(sun_value, current_time)
            this.createShowImage(sun_value, current_time)
            this.refresh_timer = current_time
        }
    }
    loadFrame(name, scale) {
        let path = data[name];
        // this.orig_image = require("../../assets/" + path);
        this.image = require("../../assets/" + path);
    }
    clickHandler(e, index) {
        // this.context.menubar.card_list = null;

        if (!this.canClick(this.context.menubar.sun_value, this.context.current_time)) {
            return;
        }
        let left = e.clientX + "px";
        let top = e.clientY + "px";
        let drag_card = new DragCard(this.context, this.name_index, left, top);
        return drag_card;
    }
    selectHandler(selected_card) {
        selected_card.push(this);
    }
    canClick(sun_value, current_time) {
        console.log("Card  canClick  clickHandler");
        if (this.sun_cost <= sun_value) {
            if ((current_time - this.frozen_timer) > this.frozen_time) {
                return true;
            }
        }
        return false;
    }
    canSelect() {
        return this.select
    }
    setSelect(can_select) {
        this.select = can_select
        if (can_select) {
            this.style.opacity = 1
        }
        else {
            this.style.opacity = 0.5
        }

    }
    setFrozenTime(current_time) {
        this.frozen_timer = current_time
    }
    createShowImage(sun_value, current_time) {
        // '''create a card image to show cool down status
        //    or disable status when have not enough sun value'''
        let time = current_time - this.frozen_timer
        if (time < this.frozen_time) {// cool down status
            // image = pg.Surface([this.rect.w, this.rect.h])
            // frozen_image = this.orig_image.copy()
            // frozen_image.set_alpha(128)
            // frozen_height = (this.frozen_time - time) / this.frozen_time * this.rect.h

            // image.blit(frozen_image, (0, 0), (0, 0, this.rect.w, frozen_height))
            // image.blit(this.orig_image, (0, frozen_height),
            //     (0, frozen_height, this.rect.w, this.rect.h - frozen_height))
        }
        else if (this.sun_cost > sun_value) {// disable status
            this.style.opacity = 0.7;
        }
        else {
            this.style.opacity = 1;
        }

    }
}


export class MenuBar {
    constructor(context, card_list, sun_value) {
        this.context = context;
        this.loadFrame(c.MENUBAR_BACKGROUND)
        // this.rect.x = 10
        // this.rect = this.image.get_rect()
        this.sun_value = sun_value
        // this.rect.y = 0
        this.card_offset_x = 32
        this.setupCards(card_list)
    }
    loadFrame(name) {
        // console.log(data[name]);
        // this.image = require(data[name]);
    }
    update(current_time) {
        this.current_time = current_time
        for (let i = 0; i < this.card_list.length; i++) {
            this.card_list[i].update(this.sun_value, this.current_time);
        }
    }
    setupCards(card_list) {
        // console.log(card_list);
        this.card_list = []
        for (let i = 0; i < card_list.length; i++) {
            this.card_list.push(new Card(this.context, card_list[i]));
        }
    }
    decreaseSunValue(value) {
        this.sun_value -= value;
    }
    increaseSunValue(value) {
        this.sun_value += value;
    }
    setCardFrozenTime(plant_name) {
        for (let i = 0; i < this.card_list.length; i++) {
            if (plant_name_list[card.name_index] == plant_name) {
                card.setFrozenTime(this.current_time);
            }
        }
    }

    drawSunValue() {
        // this.value_image = getSunValueImage(this.sun_value)
        // this.value_rect = this.value_image.get_rect()
        // this.value_rect.x = 21
        // this.value_rect.y = this.rect.bottom - 21
        // this.image.blit(this.value_image, this.value_rect)
    }


}


export class Panel {
    constructor(card_list, sun_value) {
        this.loadImages(sun_value)
        this.selected_cards = []
        this.selected_num = 0
        this.setupCards(card_list)
    }
    loadFrame(name) {
        let path = data[name];
        return require("../../assets/" + path);
    }
    loadImages(sun_value) {
        this.menu_image = this.loadFrame(c.MENUBAR_BACKGROUND)
        // this.menu_rect = this.menu_image.get_rect()
        // this.menu_rect.x = 0
        // this.menu_rect.y = 0

        this.panel_image = this.loadFrame(c.PANEL_BACKGROUND)
        // this.panel_rect = this.panel_image.get_rect()
        // this.panel_rect.x = 0
        // this.panel_rect.y = PANEL_Y_START

        // this.value_image = getSunValueImage(sun_value)
        // this.value_rect = this.value_image.get_rect()
        // this.value_rect.x = 21
        // this.value_rect.y = this.menu_rect.bottom - 21

        this.button_image = this.loadFrame(c.START_BUTTON)
        // this.button_rect = this.button_image.get_rect()
        // this.button_rect.x = 155
        // this.button_rect.y = 547
    }
    setupCards(card_list) {
        this.card_list = []
        for (let i = 0; i < card_list.length; i++) {
            this.card_list.push(new Card(this.context, card_list[i]));
        }
        // x = PANEL_X_START - PANEL_X_INTERNAL
        // y = PANEL_Y_START + 43 - PANEL_Y_INTERNAL
        // for i, index in enumerate(card_list):
        //     if i % 8 == 0:
        //         x = PANEL_X_START - PANEL_X_INTERNAL
        // y += PANEL_Y_INTERNAL
        // x += PANEL_X_INTERNAL
    }


    // checkCardClick(this, mouse_pos) {
    //     delete_card = None
    //     for card in this.selected_cards:
    //         if delete_card:  # when delete a card, move right cards to left
    //     card.rect.x -= 55
    //     elif card.checkMouseClick(mouse_pos):
    //     this.deleteCard(card.name_index)
    //     delete_card = card

    //     if delete_card:
    //         this.selected_cards.remove(delete_card)
    //     this.selected_num -= 1

    //     if this.selected_num == CARD_LIST_NUM:
    //         return

    //     for card in this.card_list:
    //         if card.checkMouseClick(mouse_pos):
    //             if card.canSelect():
    //                 this.addCard(card)
    //     break
    // }


    addCard(card) {
        card.setSelect(false)
        // y = 8
        // x = 78 + this.selected_num * 55
        this.selected_cards.append(Card(x, y, card.name_index))
        this.selected_num += 1
    }


    deleteCard(index) {
        this.card_list[index].setSelect(true)
    }


    // checkStartButtonClick(this, mouse_pos) {
    //     if (this.selected_num < CARD_LIST_NUM) {
    //         return false
    //     }
    //     x, y = mouse_pos
    //     if (x >= this.button_rect.x and x <= this.button_rect.right and
    //     y >= this.button_rect.y and y <= this.button_rect.bottom):
    //     return true
    //     return false
    // }


    getSelectedCards() {
        let card_index_list = [];
        for (let i = 0; this.selected_cards.length; i++) {
            card_index_list.push(card.name_index)
        }
        return card_index_list
    }
}


