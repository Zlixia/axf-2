export default {
    computedCategories: [{ cids: [], products: []}],
    //用户信息
    user: {
      //每个用户所选择的地址
      select_site: {}
    },
    //本地购物车
    carts: [],
    //控制tabBar的显示或隐藏
    tabBarShow: true,
    //存储该用户的地址信息
    sites: [],
    //所选的城市
    selectedCity: '',
    //所选的地址
    selectedSite: '',
    //所选的x
    selectedX: 0,
    //所选的y
    selectedY: 0,
    //购物车(cheNum类名)按钮的位置
    location: {},
    //收藏列表
    favorList: []

  }