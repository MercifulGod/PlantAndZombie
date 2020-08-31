<template>
  <div>
    <div
      :class="{ComicStrip:true,active: index==activeIndex}"
      v-for="(item,index) in data"
      :key="index"
    >
      <img v-bind:src="item" />
    </div>
  </div>
</template>

<script>

export default {
  name: "ComicStrip",

  props: {
    data: {
      type: Array,
      default: 0
    },
    autoplay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 150
    }
  },

  data() {
    return {
      activeIndex: 0,
      timer: null
    };
  },
  methods: {
    playSlides() {
      if (this.activeIndex < this.data.length - 1) {
        this.activeIndex++;
      } else {
        this.activeIndex = 0;
      }
    },

    pauseTimer() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    },

    startTimer() {
      if (this.interval <= 0 || !this.autoplay || this.timer) return;
      this.timer = setInterval(this.playSlides, this.interval);
    }
  },

  mounted() {
    this.startTimer();
  },

  beforeDestroy() {
    // if (this.$el) removeResizeListener(this.$el, this.resetItemPosition);
    this.pauseTimer();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.ComicStrip {
  position: fixed;
  display: none;
}
.active {
  display: block;
}
</style>
