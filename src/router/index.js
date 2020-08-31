import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Ready from '@/components/Ready'
import FirstLevel from '@/components/FirstLevel'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/ready',
      name: 'Ready',
      component: Ready
    },
    {
      path: '/firstLevel',
      name: 'FirstLevel',
      component: FirstLevel
    }
  ]
})
