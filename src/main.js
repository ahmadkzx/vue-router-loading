import VueRouterLoadingComponent from './VueRouterLoading.vue'

const VueRouterLoading = {
  install: (Vue, options) => {
    Vue.component('VueRouterLoading', VueRouterLoadingComponent)
  }
}

export default VueRouterLoading