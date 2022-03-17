<template>
  <div>
    <transition name="fade">
      <div
        v-if="isStarted"
        :style="progressBarStyle"
        :class="['progressbar', { 'isPaused': isPaused }, { 'isFinished': isFinished }, { 'rtl': rtl }, { 'showOverly': showOverly }]"
      >
        <span class="shadow" v-if="endLineMode == 'shadow'" :style="shadowStyle"></span>
        <span class="circle" v-else-if="endLineMode == 'circle'" :style="circleStyle"></span>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: "VueRouterLoading",

  props: {
    color: {
      default: '#41b883'
    },
    height: {
      default: 2
    },
    position: {
      default: 'top'
    },
    rtl: {
      default: false
    },
    endLineMode: {
      default: 'shadow'
    },
    shadowColor: {
      default: '#41b883'
    },
    shadowOpacity: {
      default: '0.9'
    },
    circleColor: {
      default: '#41b883'
    },
    showOverly: {
      default: true
    }
  },

  data: () => ({
    isPaused: false,
    isStarted: false,
    isFinished: false
  }),

  computed: {
    progressBarStyle() {
      return {
        [this.position]: 0,
        background: this.color,
        height: `${this.height}px`,
      }
    },

    shadowStyle() {
      let shadowColor = (this.isHex(this.shadowColor)) ?  this.hexToRgb(this.shadowColor) : this.shadowColor
      return {
        'box-shadow': `0 0 10px rgba(${shadowColor}, ${this.shadowOpacity})`
      }
    },

    circleStyle() {
      return {
        background: this.circleColor,
        width: `${+this.height * 3}px`,
        height: `${+this.height * 3}px`,
      }
    }
  },

  mounted() {
    this.$router.beforeEach((from, to, next) => {
      this.start()
      next()
    })
  },

  methods: {
    start() {
      if (this.isStarted) this.destroy();
      this.isStarted = true
      setTimeout(() => {
        if (this.isStarted && !this.isFinished) this.isPaused = true
      }, 8500)
    },

    finish() {
      this.isFinished = true
      this.isPaused = false
    },

    destroy() {
      this.isStarted = false
      this.isFinished = false
      this.isPaused = false
    },

    hexToRgb(hex) {
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : null;
    },

    isHex(str) {
      return str.match(/^#[a-f0-9]{6}$/i) !== null;
    }
  },

  watch: {
    isStarted(val) {
      if (val) setTimeout(() => {
        this.$el.addEventListener("animationend", this.destroy);
      }, 500)
    },

    $route() {
      setTimeout(() => this.finish(), 500)
    }
  }

};
</script>


<style lang="scss" scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

.progressbar {
  position: fixed;
  width: 0%;
  left: 0;
  z-index: 9999999;
  animation: start 10s linear forwards;

  .shadow {
    position: absolute;
    top: 0;
    right: 0;
    width: 30px;
    height: 2px;
  }

  .circle {
    position: absolute;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
    border-radius: 50%;
  }

  &.showOverly {
    &::after {
      display: none;
      content: '';
      position: absolute;
      top: 0;
      left: 0%;
      width: 30px;
      height: 2px;
      background: white;
      animation: overly 1s linear infinite;
      opacity: 0.6;
    }
  }

  &.paused {
    animation-play-state: paused;

    &::after {
      display: block;
    }
  }

  &.finished {
    animation-play-state: running;
    animation-duration: 1s;

    &::after {
      display: none;
    }
  }

  @keyframes start {
    from {
      width: 0%;
    }
    to {
      width: 100%;
    }
  }

  @keyframes overly {
    from {
      left: 0%;
    }
    to {
      left: 100%;
    }
  }
}

.progressbar.rtl {
  left: unset;
  right: 0;

  .shadow, .circle {
    right: unset;
    left: 0;
  }

  &::after {
    left: unset;
    right: 0%;
  }

  @keyframes overly {
    from {
      right: 0%;
    }
    to {
      right: 100%;
    }
  }
}
</style>