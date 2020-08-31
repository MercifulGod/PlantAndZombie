import { c } from '../constants'


export class Map {
    constructor(context, width, height) {
        this.context = context;
        this.width = width;
        this.height = height;
        this.map = []
        for (let i = 0; i < height; i++) {
            this.map.push(Array(width).fill(null));
        }
        this.isMouseEnter = false
        this.map_x = null
        this.map_y = null
    }
    isValid(map_x, map_y) {
        // 是否在地图范围内
        // map_x : 地图索引
        if (map_x < 0 || map_x >= self.width || map_y < 0 || map_y >= self.height) {
            return false
        }
        return true
    }
    setMouseEnter(is_enter) {
        // 鼠标是否进入地图
        this.isMouseEnter = is_enter;
        // console.log(Object.is(this.context.map,this));
    }
    setMousePos(x_index, y_index) {
        this.map_x = x_index
        this.map_y = y_index
    }
    canSeedPlant() {
        return this.map[this.map_y][this.map_x] == null;
    }
    addPlant(plant) {
        if (this.canSeedPlant()) {
            this.map[this.map_y][this.map_x] = plant;
            return true;
        }
    }
    getMapIndex(x, y) {
        // x -= c.MAP_OFFSET_X;
        // y -= c.MAP_OFFSET_Y;
        return [parseInt(x / c.GRID_X_SIZE), parseInt(y / c.GRID_Y_SIZE)];

    }
    getMapGridPos(map_x, map_y) {
        return [map_x * c.GRID_X_SIZE +  c.MAP_OFFSET_X, map_y * c.GRID_Y_SIZE + c.GRID_Y_SIZE / 5 * 2];
        // return [map_x * c.GRID_X_SIZE + "px", map_y * c.GRID_Y_SIZE + c.GRID_Y_SIZE / 5 * 2 + "px"];
    }
    setMapGridType(map_x, map_y, type) {
        // this.map[map_y][map_x].pop();
        this.map[map_y][map_x] = null;
    }
    getRandomMapIndex() {
        let map_x = Math.ceil(Math.random() * (this.width - 1));
        let map_y = Math.ceil(Math.random() * (this.height - 1));
        return [map_x, map_y];
    }
}


