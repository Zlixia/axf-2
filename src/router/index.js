import Vue from 'vue'
import Router from 'vue-router'

// 页面，按需动态加载
// 首页
const Home = resolve => require(['../pages/Home/Home.vue'], resolve)
// 闪送超市
const Shop = resolve => require(['../pages/Shop/Shop.vue'], resolve)
// 购物车页
const Cart = resolve => require(['../pages/Cart/Cart.vue'], resolve)
// 我的页
const Mine = resolve => require(['../pages/Mine/Mine'], resolve)
//登录页
const Login = resolve => require(['../pages/Login/Login'], resolve)
//商品详情页
const ProductItem = resolve => require(['../pages/Product-item/Product-item'], resolve)
//地址页
const Site = resolve => require(['../pages/Site/Site'], resolve)
//修改地址页
const Replan = resolve => require(['../pages/Replan/Replan'], resolve)
//新增地址页
const AddSite = resolve => require(['../pages/AddSite/AddSite'], resolve)
//选择地址页
const SelectSite = resolve => require(['../pages/Select-site/Select-site'], resolve)
//收藏页
const Favor = resolve => require(['../pages/Favor/Favor'], resolve)

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component:Home,
      meta: {
        notKeepAlive: false
      }
    },
    {
      path: '/shop',
      component: Shop,
      meta: {
        notKeepAlive: false
      }
    },
    {
      path: '/cart',
      component: Cart,
      meta: {
        notKeepAlive: true
      }
    },
    {
      path: '/mine',
      component: Mine,
      meta: {
        notKeepAlive: false
      }
    },
    {
      path: '/login',
      component: Login,
      meta: {
        notKeepAlive: false
      }
    },
    {
      //商品的id
      path: '/product-item/:id',
      component: ProductItem,
      meta: {
        notKeepAlive: false
      }
    },
    {
      path: '/site',
      component: Site,
      meta: {
        notKeepAlive: true
      }
    },
    {
      path: '/replan/:id',
      component: Replan,
      meta: {
        notKeepAlive: false
      }
    },
    {
      path: '/addSite',
      component: AddSite,
      meta: {
        notKeepAlive: false
      }
    },
    {
      path: '/select-site',
      component: SelectSite,
      meta: {
        notKeepAlive: false
      }
    },
    {
      path: '/favor',
      component: Favor,
      meta: {
        notKeepAlive: false
      }
    }
  ]
})
