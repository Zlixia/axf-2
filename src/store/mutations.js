//import { Store } from "_vuex@3.0.1@vuex";

export default {
    SAVE_COMPUTED_CATEGORIES (state, data) {
      state.computedCategories = data
    },
    //注册
    LOGIN (state,data) {
      state.user = data
    },
    //本地购物车中没有这个商品时的处理
    ADD_CART (state, data) {
      state.carts.push(data)
    },
    //更新本地购物车中商品的num值 数量增加
    UPDATA_NUM (state,id) {
      for (let i = 0; i < state.carts.length; i++) {
        //判断商品在购物车表中的id 和传入的id
        if (state.carts[i].id === id) {
          state.carts[i].num++
          break
        }
      }
    },
    //更新本地购物车中的商品的num值， 数量减少
    SUB_CART (state, id) {
      for (let i = 0; i < state.carts.length; i++) {
        //判断商品在购物车表中的id 和传入的id
        if (state.carts[i].id === id) {
          state.carts[i].num--
          break
        }
      }
    },
    //在vuex中保存从数据库中获取的购物车数据
    SAVE_CARTS (state,data) {
      //将数据库中的购物车数据添加到本地购物车中
      state.carts = data
      //更新本地的原始数据中的num值
      let computedCategories = state.computedCategories
      for (let i = 0; i < computedCategories.length; i++) {
        //拿到所有分类所对应的商品数据
        let products = computedCategories[i].products
        //遍历所有分类对应的商品
        for (let j = 0; j < products.length; j++) {
          for (let z = 0; z < data.length; z++) {
            //判断所有分类对应的商品的id和数据库中购物车表中商品的id
            if (products[j].id === data[z].product_id) {
              products[j].num = data[z].num
              break
            }
          }
        }
      }
    },
    //重置carts页面中的num
    RESET_CARTS (state, product) {
      //更新本地的原始数据
      let computedCategories = state.computedCategories
      label:
      for (let i = 0; i < computedCategories.length; i++) {
        //拿到每个分类的所有商品数据
        let products = computedCategories[i].products
        for (let j = 0; j < products.length; j++){
          //判断本地购物车中的每个商品id 和 传入的商品的id
          if (products[j].id === product.product_id) {
            products[j].num = product.num
            break label
          }
        }
      }
    },
    //把本地购物车中的该商品删除
    DEL_CART (state, id) {
      for (let i = 0; i < state.carts.length; i++) {
        //判断商品在购物车表中的id 和传入的id
        if (state.carts[i].id === id) {
          state.carts.splice(i, 1)
          break
        }
      }
    },
    //更新商品的选中状态
    CHANGE_CHECKED (state, product) {
      //找到每个商品在购物车中的下标
      let index = state.carts.indexOf(product)
      state.carts[index].checked = !state.carts[index].checked  
    },
    //本地购物车中更改全部按钮的选中状态为false
    CHECKED_ALL_FALSE (state) {
      let carts = state.carts
      for (let i = 0; i < carts.length; i++) {
        carts[i].checked = false
      }
    },
    //本地购物车中更改全部按钮的选中状态为true
    CHECKED_ALL_TRUE (state) {
      let carts = state.carts
      for (let i = 0; i < carts.length; i++) [
        carts[i].checked = true
      ]
    },
    //更改所选城市
    CITY_CHANGE (state,city) {
      state.selectedCity = city
    },
    //重置地址
    SITE_CHANGE (state,site) {
      state.selectedSite = site
    },
    //
    SAVE_SELECTED_SITEOBJ (state, siteObj) {
      state.selectedSite = siteObj.name
      state.selectedX = siteObj.location.lng
      state.selectedY = siteObj.location.lat
    },
    //从数据库中读取的地址列表保存到vuex的sites中
    SAVE_SITES (state, data) {
      state.sites = data
    },
    //保存新建的地址对象
    SAVE_SITE (state, siteObj) {
      state.sites.push(siteObj)
    },
    //更新用户对象中所选的地址
    UPDATA_USER (state, user) {
      state.user = user
    },
    //修改了地址信息
    REPLACE (state, siteObj) {
      for (let i = 0; i < state.sites.length; i++) {
        if (state.sites[i].id === Number(siteObj.id)) {
          state.sites[i] = siteObj
        }
      }
    },
    //删除地址
    DELETE_SITE (state, siteObj) {
      let index = state.sites.indexOf(siteObj)
      state.sites.splice(index,1)
    },
    //动画终点位置信息
    LOCATION (state, location) {
      state.location = location
    },
    //先保存每次登陆获取到的收藏列表
    SAVE_FAVOR_LIST (state,favorList) {
      state.favorList = favorList
    },
    //添加商品到收藏页
    ADD_FAVOR (state,productObj) {
      state.favorList.push(productObj)
    },
    //本地商品收藏取消
    DELETE_FAVOR (state,index) {
      state.favorList.splice(index,1)
    },
    //本地删除选中的收藏列表
    DELETE_CHECK (state, delFavorList) {
      //拿到本地收藏列表
      let localFavorList = state.favorList
      /*
      找到收藏列表中要删除的列表,判断要删除的收藏列表 在 本地所有收藏列表中的id
      */
      for (let i = 0; i < localFavorList.length; i++) {
        for (let j = 0; j < delFavorList.length; j++) {
          if (localFavorList[i].id === delFavorList[j].id) {
            localFavorList.splice(i, 1)
            /*因为对localFavorList执行删除操作会让localFavorList的length重新生成，
            那么删除下一个(i+1)的下标就会变成删除对象的下标(i)，因此需要i--
            */
            i--
            break
          }
        }
      }
    }
  }