<template>
  <div class="main_page">
    <div class="Panelchooser">
      <span class="sun_value">{{state.menubar.sun_value}}</span>
      <ul>
        <li
          v-for="(card,index) in state.menubar.card_list"
          :style="card.style"
          v-bind:key="index"
          @mousedown="(e) =>{drag_card=card.clickHandler(e,index);}"
          :class="{card:true}"
        ></li>
      </ul>
    </div>
    <div v-if="drag_card" :style="drag_card.style">
      <img :src="drag_card.image" />
    </div>
    <div
      v-for="(sun,index) in state.sun_group"
      :key="index"
      :style="sun.getStyle()"
      @click="sun.clickHandler(state.menubar)"
    >
      <img :src="sun.image" />
    </div>

    <div v-for="(head,index) in state.head_group" :key="'head'+index" :style="head.getStyle()">
      <img :src="head.image" />
    </div>

    <div v-for="(group,index) in state.bullet_groups" :key="index+'b'">
      <div v-for="(bullet,b_index) in group" :key="b_index" :style="bullet.getStyle()">
        <img :src="bullet.image" />
      </div>
    </div>

    <div v-for="(group,index) in state.zombie_groups" :key="index+'z'">
      <div v-for="(zombie,z_index) in group" :key="z_index" :style="zombie.getStyle()">
        <img :src="zombie.image" />
      </div>
    </div>
    <div
      class="map"
      @mousemove="dispatch($event,'drag_card','mousemove')"
      @mouseenter="()=>{state.map.setMouseEnter(true);}"
      @mouseleave="()=>{state.map.setMouseEnter(false);}"
      @click.left="dispatch($event,'','click_left')"
      @contextmenu.prevent="dispatch($event,'','click_right')"
    >
      <el-row :gutter="3" v-for="(y_item,y_index) in state.map.map" :key="y_index">
        <el-col class="card-col" v-for="(x_item,x_index) in y_item" :key="x_index">
          <div class="grid-content" @mouseenter="state.map.setMousePos(x_index,y_index)">
            <ComicStrip v-bind:data="x_item?x_item.frames:[]"></ComicStrip>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import ComicStrip from "./ComicStrip.vue";
import { Controler } from "../source/main.js";
import { Level } from "../source/state/level";
import { Bullet } from "../source/component/plant";
//定义类

export default {
  name: "FirstLevel",
  data() {
    return {
      controller: null,
      state: null,
      drag_card: null,
      pos: { x: 0, y: 0 },
      data: null,
      selected_card: []
    };
  },
  components: {
    ComicStrip
  },
  props: [],
  methods: {
    mapEnter(x_index, y_index) {
      this.pos.x = x_index;
      this.pos.y = y_index;
    },
    dispatch(e, target, event_type) {
      if (
        target == "drag_card" &&
        this.drag_card != null &&
        this.state.map.isMouseEnter
      ) {
        this.drag_card.update(e, event_type);
        // 取消添加植物
      } else if (this.drag_card != null && event_type == "click_right") {
        this.drag_card = null;
        // 添加植物
      } else if (this.drag_card != null && event_type == "click_left") {
        this.state.addPlant(this.drag_card.plant_name);
        this.drag_card = null;
      }
    },
    update() {
      this.state.update();
    }
  },
  created() {
    let card_list = localStorage.getItem("selected_card");
    this.state = new Level(this, JSON.parse(card_list));
  },
  mounted() {
    let x = 1;
    let y = 2;
    let z = 3;
    z += x > y ? x : -x;
    console.log(z);
    this.controller = new Controler();
    // 启动定时任务
    this.controller.start(() => {
      this.update();
    });
  },
  beforeDestroy() {
    this.controller.stop();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.main_page {
  /* position: absolute; */
  /* margin-top: 10px; */
  margin-left: 35px;
  height: 600px;
  width: 800px;
  background: url(../assets/graphics/Items/Background/Background_0.jpg)
    no-repeat;
  /* background-size: 100% 100%; */
  background-position: -220px;
  overflow: hidden;
}
.Panelchooser {
  position: fixed;
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
.map {
  height: 600px;
  width: 800px;
  margin-top: 70px;
  margin-left: 36px;
}
.sun_value {
  position: fixed;
  margin-top: 47px;
  margin-left: -60px;
  background-color: #ffffcc;
  width: 52px;
  line-height: 20px;
  text-align: center;
}
.card-col {
  width: 80px;
}
.el-row {
  /* margin-bottom: 3px; */
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
  min-height: 100px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>
