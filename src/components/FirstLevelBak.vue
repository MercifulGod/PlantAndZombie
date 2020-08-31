<template>
  <div class="main_page">
    <div class="Panelchooser">
      <ul>
        <li
          v-for="(item,index) in selected_card"
          :style="{backgroundImage:'url('+item.image+')',backgroundRepeat:'no-repeat',backgroundSize:'100% 100%' }"
          v-bind:key="index"
          @mousedown="move($event,index)"
          :disabled="item.is_selected?true:false"
          :class="{card:true}"
        ></li>
      </ul>
    </div>
    <div v-if="drag_card.display" :style="drag_card.style">
      <ComicStrip v-bind:data="drag_card.images"></ComicStrip>
    </div>
    <!-- :style="{color:'blue',width:'10px',height:'10px'}" -->
    <div v-for="(group,index) in groups" :key="index">
      <!-- :style="bullet.pos" -->
      <div v-for="(bullet,b_index) in group.bullets" :key="b_index" :style="bullet.pos">hahah</div>
    </div>
    <div style="height: 400px;width: 800px;padding: 0px 0px 0px 140px;">
      <el-row :gutter="3" v-for="(y_item,y_index) in map" :key="y_index">
        <el-col class="card-col" v-for="(x_item,x_index) in y_item" :key="x_index">
          <div class="grid-content" @mouseenter="mapEnter(x_index,y_index)">
            <ComicStrip v-bind:data="x_item?x_item.images:[]"></ComicStrip>
          </div>
        </el-col>
      </el-row>
      <!-- <ComicStrip v-bind:data="data.WallNut"></ComicStrip> -->
    </div>
  </div>
</template>

<script>
import ComicStrip from "./ComicStrip.vue";
import { Plant, Bullet } from "../assets/js/components/plant";
//定义类

export default {
  name: "FirstLevel",
  data() {
    return {
      interval: 30,
      timer: null,
      groups: [
        { bullets: [], plants: [], zombies: [] },
        { bullets: [], plants: [], zombies: [] },
        { bullets: [], plants: [], zombies: [] },
        { bullets: [], plants: [], zombies: [] },
        { bullets: [], plants: [], zombies: [] }
      ],
      drag_card: {
        display: false,
        images: [],
        style: { left: 0, top: 0, position: "fixed" }
      },
      pos: { x: 0, y: 0 },
      data: null,
      map: [
        [null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null]
        // [[], [], [], [], [], [], [], [], []]
      ],
      selected_card: []
    };
  },
  components: {
    ComicStrip
  },
  props: [],

  // watch: {
  //   items(val) {
  //     if (val.length > 0) this.setActiveItem(this.initialIndex);
  //   }
  // },
  methods: {
    init() {
      let selected = [1, 2, 3, 4, 5, 6, 7, 8];
      this.data = require("../source/data.json");
      let card_name = null;
      let card_path = null;
      for (let i = 0; i < selected.length; i++) {
        card_name = this.data.card_name_list[selected[i]];
        card_path = this.data[card_name];
        this.selected_card.push({
          name_index: selected[i],
          image: require("../assets/" + card_path)
        });
      }
    },
    getFramesByIndex(index) {
      let plant_name = this.data.plant_name_list[index];
      let data = this.data[plant_name];
      frames = [];
      for (let i = 0; i < data.length; i++) {
        frames.push(require("../assets/" + data[i]));
      }
      return frames;
    },
    move(e, index) {
      //移动当前元素

      this.drag_card.style.left = e.clientX + "px";
      this.drag_card.style.top = e.clientY + "px";
      this.drag_card.images = this.getFramesByIndex(index);
      this.drag_card.display = true;
      document.onmousedown = e => {};
      document.onmousemove = e => {
        //鼠标按下并移动的事件
        //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
        let left = e.clientX - 30;
        let top = e.clientY - 30;

        //移动当前元素
        this.drag_card.style.left = left + "px";
        this.drag_card.style.top = top + "px";
      };
      document.onmouseup = e => {
        document.onmousemove = null;
        document.onmouseup = null;
        this.drag_card.display = false;
        let plant = new Plant(this.pos.y, this.pos.x, this.drag_card.images);
        this.groups[this.pos.y].plants.push(plant);
        this.map[this.pos.y][this.pos.x] = plant;
      };
    },
    mapEnter(x_index, y_index) {
      console.log(x_index, y_index);
      // this.map[y_index][x_index] = this.drag_card.images;
      this.pos.x = x_index;
      this.pos.y = y_index;
    },
    mapClick(y_index, x_index) {
      // console.log(x_index,y_index);
      // console.log("mapClick");
      // this.map[y_index][x_index] = this.drag_card.images;
    },
    play() {
      for (let i = 0; i < this.groups.length; i++) {
        for (let j = 0; j < this.groups[i].bullets.length; j++) {
          this.groups[i].bullets[j].update();
        }
      }
    },

    pauseTimer() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    },

    startTimer() {
      if (this.interval <= 0 || this.timer) return;
      this.timer = setInterval(this.play, this.interval);
    }
  },
  created() {
    //初始化信息
    // this.selected_card = localStorage.getItem("selected_card").split(",");
  },
  mounted() {
    this.init();
    let tmp = null;
    if (tmp) {
      console.log(tmp);
    }
    // this.startTimer();
  },
  beforeDestroy() {
    // if (this.$el) removeResizeListener(this.$el, this.resetItemPosition);
    this.pauseTimer();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.main_page {
  position: absolute;
  margin-top: 10px;
  margin-left: 80px;
  height: 500px;
  width: 800px;
  background: url(../assets/graphics/Items/Background/Background_0.jpg)
    no-repeat;
  background-size: 100% 100%;
  z-index: 10;
}
.Panelchooser {
  height: 80px;
  width: 520px;
  padding: 10px 0px 0px 72px;
  background: url(../assets/graphics/Screen/ChooserBackground.png) no-repeat;
  background-size: 100% 100%;
  z-index: 11;
}
.Panelchooser ul {
  list-style: none;
  font-style: normal;
  text-decoration: none;
}
.Panelchooser ul li {
  float: left;
  height: 70px;
  width: 48px;
  margin-left: 6px;
}
.card-col {
  width: 47px;
}
.el-row {
  margin-bottom: 3px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 75px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>
