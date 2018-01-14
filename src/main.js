// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
//路由拦截器(导航守卫)，控制tarBar的显示隐藏
//router.beforeEach 注册一个全局前置守卫
router.beforeEach((to, from, next) => {
  /*to: Route: 即将要进入的目标 路由对象
    from: Route: 当前导航正要离开的路由 
    next: Function 执行效果依赖 next方法的调用参数。next()
  */
  //console.log(to,from)
  let path = to.path
  if (path === '/' || path === '/shop' || path === '/cart' || path === '/mine') {
    store.state.tabBarShow = true
  } else {
    store.state.tabBarShow = false
  }
  next()
})

// 引入更新rem的js
import '@/styles/reset.js'
// 引入通用css
import '@/styles/index.less'

//引入vuex
import store from './store'

//引入mint-ui 中的按需加载 轮播图
import {Swipe, SwipeItem, Lazyload,messageBox} from 'mint-ui'
Vue.component(Swipe.name, Swipe)
Vue.component(SwipeItem.name, SwipeItem)
Vue.prototype.$msg = messageBox
Vue.use(Lazyload)

//引入http库 axios
import axios from 'axios'
Vue.prototype.$http = axios

//依赖  使用promise,async等的依赖
import 'babel-polyfill'

// 引入fastclick
import fastclick from 'fastclick'
// 官方推荐将fastclick绑定到body下，这样在body下的元素都不会有300ms的延迟
fastclick.attach(document.body)

//引入自己写的动画插件
import animationOwn from '@/plugin/animationOwn'
Vue.use(animationOwn)

Vue.config.productionTip = false

/* eslint-disable no-new */
//把引入的插件插入到vue
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
