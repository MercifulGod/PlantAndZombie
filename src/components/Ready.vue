<template>
  <div class="main_page">
    <div class="Panelchooser">
      <ul>
        <li
          v-for="(item,index) in selected_card"
          v-bind:key="index"
          @click="cancel_select(item,index)"
          :style="{backgroundImage:'url('+item.image+')',backgroundRepeat:'no-repeat',backgroundSize:'100% 100%' }"
          :class="{card:true}"
        ></li>
      </ul>
    </div>
    <!--  :style="{backgroundImage:'url('+card.image+')',backgroundRepeat:'no-repeat',backgroundSize:'100% 100%', card_selected: card.select?false:true}" -->
    <div class="panelBackground">
      <div>
        <ul>
          <li
            v-for="(card,index) in state.panel.card_list"
            @click="select_card(card)"
            :key="index"
            :style="card.style"
          ></li>
        </ul>
      </div>
      <div :style="{display:'block',clear:'both'}"></div>
      <div>
        <!-- <el-button @click="visible = true">Button</el-button> -->
        <img
          @click="start_game()"
          :class="{start_btn:true,start_btn_active:is_active_start}"
          src="../assets/graphics/Screen/StartButton.png"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { Controler } from "../source/main.js";
import { Level } from "../source/state/level";
import { Bullet } from "../source/component/plant";
export default {
  name: "Ready",
  data() {
    return {
      state: null,
      is_active_start: false,
      selected_card: []
    };
  },
  props: [],
  methods: {
    select_card(card) {
      console.log("select_card");
      if (this.selected_card.length == 8 || !card.select) {
        return;
      }
      this.selected_card.push(card);
      card.setSelect(false);
      if (this.selected_card.length == 8) {
        this.is_active_start = true;
      }
    },
    cancel_select(card, index) {
      card.setSelect(true);
      this.selected_card.splice(index, 1);
      this.is_active_start = false;
    },
    start_game(item, index) {
      let selected_card = [];
      for (let j = 0; j < this.selected_card.length; j++) {
        selected_card.push(this.selected_card[j].name_index);
      }
      localStorage.setItem("selected_card", JSON.stringify(selected_card));
      this.$router.push("firstLevel");
    }
  },
  mounted() {
    // let img = require("../assets/graphics/Cards/card_snowpea.png");
    // console.log(img.height);
  },
  created() {
    //初始化信息
    this.state = new Level(this, []);
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.main_page {
  position: absolute;
  margin-top: 10px;
  margin-left: 80px;
  height: 600px;
  width: 800px;
  background: url(../assets/graphics/Items/Background/Background_0.jpg)
    no-repeat;
  background-size: 100% 100%;
  z-index: 10;
}
.Panelchooser {
  height: 87px;
  width: 522px;
  padding: 10px 0px 0px 74px;
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
  height: 66px;
  width: 49px;
  margin-left: 5px;
}
.panelBackground {
  height: 513px;
  width: 465px;
  padding: 38px 1px 1px 20px;
  background: url(../assets/graphics/Screen/PanelBackground.png) no-repeat;
  background-size: 100% 100%;
  z-index: 11;
}
.panelBackground ul li {
  width: 50px;
  height: 70px;
  float: left;
  margin-left: 3px;
  margin-top: 3px;
}

.card_selected {
  opacity: 0.5;
}
/* .chooser {
  position: fixed;
  margin-left: 0px;
  margin-top: 0px;
} */

.start_btn {
  bottom: 13px;
  position: fixed;
  margin-left: 135px;
  display: none;
}
.start_btn_active {
  display: block;
}
</style>
