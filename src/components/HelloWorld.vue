<template>
  <div class="main_page">
    <img class="adventure" @click="ready" src="../assets/graphics/Screen/Adventure_0.png">
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  data() {
    return {
      msg: "Welcome to Your Vue.js App"
    };
  },
  props: [],
  methods: {
    //点击下一题
    ready() {
      this.$router.push("ready");
    }
  },
  created() {
    //初始化信息
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

	.main_page{
		position: absolute;
    margin-top: 10px;
    margin-left:80px;
	  height:600px;
		width: 800px; 
		background: url(../assets/graphics/Screen/MainMenu.png) no-repeat;
		background-size: 100% 100%;
		z-index: 10;
	}


.adventure {
  position: fixed;
  margin-left: 480px;
  margin-top: 110px;
}
</style>
