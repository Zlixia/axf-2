import http from 'axios'
import api from '@/api'
//import { Object } from 'core-js/library/web/timers';
export default {
  //后台对前台提交的手机号进行处理
  submit ({commit},userObj) {
    //验证手机号在数据库中是否存在
    return http.get(api.host + '/users?phone=' + userObj.phone)
      .then(res => {
        //判断这个接口是否返回了数据，如果返回就是存在，没有返回就是这个手机号不存在数据库中
        if (res.data.length > 0) {
          //3,提取该用户的收藏列表
          http.get(api.host + '/users/' + res.data[0].id + '/favorList')
            .then(res => {
              commit('SAVE_FAVOR_LIST',res.data)
            })
          //2,提取该用户的地址列表
          http.get(api.host + '/users/' + res.data[0].id + '/sites')
           .then(res => {
             commit('SAVE_SITES',res.data)
           })
          //1,用户存在，则提取数据库中用户的购物车数据
          //注意 get返回的是一个数组，post等返回的是一个资源对象
          http.get(api.host + '/users/' + res.data[0].id + '/carts')
            .then(res => {
              //存储到本地购物车中
              commit('SAVE_CARTS',res.data)
            })
            //登录成功后，将用户信息保存到vuex的user状态下面
            commit('LOGIN',res.data[0])
            return {"msg": "登录成功"}
        } else {
          //不存在就注册
          //
          return http.post(api.host + '/users', userObj)
            .then(res => {
              if(res.data.id > 0) {
                //注册成功将数据保存到vuex的state中
                commit('LOGIN',res.data)
                return {"msg": "注册成功"}
              } else {
                return {"msg": "注册失败"}
              }
            })
        }
      })
  },
  //添加到购物车的处理
  addCart (store, product) {
    
    //这是在carts(购物车)页面的商品添加
    if (product.cartBol) {
      //更新数量 num++
      //先克隆一下本地购物车对应的商品
      let newLocalCartProduct = JSON.parse(JSON.stringify(product))
      newLocalCartProduct.num++
      //更新数据库，同步vuex中的state中的num
      return http.patch(api.host + '/carts/' + newLocalCartProduct.id,{
        num: newLocalCartProduct.num
      })
        .then(res => {
          //更改成功
          if (res.data.id > 0) {
            //同时本地购物车更新,并传入返回的id值
            store.commit('UPDATA_NUM',res.data.id)
            return {"msg": "更新数量成功"}
          } else {
            return {"msg": "更新数量失败"}
          }
        })
    }

    //首先是验证该商品在本地购物车中是否存在
    let localCarts = store.state.carts
    let user = store.state.user
    // 假设该商品部不存在，需要添加
    let addBol = true
    for (let i = 0; i < localCarts.length; i++) {
      //判断id -> 该商品在购物车表中的id
      if (localCarts[i].product_id === product.id) {
        //该商品已经存在了
        addBol = false
        //更新数量，数量+1
        //先克隆一下本地购物车中对应的商品 
        /*(如果不可隆的话，直接更改num，则会直接更改actions中的数据，不符合规则，
        在actions中是不允许更改state中的数据)*/
        // let newLocalCartProduct = Object.assign({},localCarts[i])
        let newLocalCartProduct = JSON.parse(JSON.stringify(localCarts[i]))
        newLocalCartProduct.num++
        //更新数据库，同步vuex中的state中的num
        return http.patch(api.host + '/carts/' + newLocalCartProduct.id,{
          num: newLocalCartProduct.num
        })
          .then(res => {
            //更改成功
            if (res.data.id > 0) {
              //同时本地购物车更新,并传入返回的id值
              store.commit('UPDATA_NUM',res.data.id)
              return {"msg": "更新数量成功"}
            } else {
              return {"msg": "更新数量失败"}
            }
          })
      }
    }
    if (addBol) {
      //不存在，没有找到该商品，需要添加
      //构造需要添加到购物车中的商品对象
      /*
        数据结构：
        {
          商品在购物中表的 id
          商品的id product_id,
          用户id user_id,
          商品的数量,
          商品的图片,
          商品的名称,
          商品的价格,
          是否选择
        }
      */
      let productToCartObj = {
        product_id: product.id,
        user_id: user.id,
        product_img: product.imgs.min,
        product_name: product.name,
        product_price: product.price,
        checked: true,
        num: 1
      }
      //把购物车数据添加到数据库中的购物车
      console.log(product.imgs.min)   
      return http.post(api.host + '/carts', productToCartObj)
        .then(res => {
          if(res.data.id > 0) {
            //添加成功  再添加到本地的购物车中
            store.commit('ADD_CART',res.data)
            return {"msg":"添加成功"}
            } else {
              //添加失败
              return {"msg":"添加失败"}
            }
        })
    }
  },
  /*减少购物车中选中的商品的数量
  product 商品对象，必须拥有product_id属性
  */
  subCart (store,product) {
    let localCarts = store.state.carts
    //获取要更改数量的那个对象
    let cartObj = {}
    //循环遍历提取该商品对应本地购物车中的商品对象
    for (let i = 0; i < localCarts.length; i++) {
      if (product.product_id === localCarts[i].product_id) {
        cartObj = localCarts[i]
      }
    }
    
    //进行判断，看该商品的数量是多少 
    if (cartObj.num > 1) {
      //更改 -> 减少数量
      //发送请求更新num的值
      return http.patch(api.host + '/carts/' + cartObj.id, {
        num: cartObj.num
      })
        .then(res => {
          if (res.data.id > 0) {
            //更新本地购物车
            store.commit('SUB_CART',res.data.id)
            return {"msg": "减少数量成功"}
          }else {
            return {"msg": "减少数量失败"}
          }
        })
    } else {
      //从本地和数据库中删除该商品
      return http.delete(api.host + '/carts/' + cartObj.id)
        .then(res => {
          //把本地购物车中的该商品也删掉
          store.commit('DEL_CART', cartObj.id)
          return {"msg": "删除商品成功"}
        })
    }
  },
  //更改购物车中商品的选中状态
  changeChecked (store, product) {
    //先更新数据库中的商品的状态
    return http.patch(api.host + '/carts/' + product.id, {
      checked: !product.checked
    })
      .then(res => {
        if (res.data.id > 0) {
        //再更新本地购物车中的商品的状态
        store.commit('CHANGE_CHECKED', product)
        return {"msg": "更新状态成功"}
        } else {
          return {"msg": "更新状态失败"}
        }
      })
  },
  //购物车中的全选 -> 全部取消
  checkedAllFalse (store) {
    //先拿到本地购物车的数据
    let carts = store.state.carts
    let completeNum = 0
    function promiseCheckedAllFalse () {
      return new Promise(function (resolve, reject) {
        for (let i = 0; i < carts.length; i++) {
          //更新数据库中的每个商品的勾选状态
          http.patch(api.host + '/carts/' + carts[i].id, {
            checked: false
          })
            .then(res => {
              completeNum++
              //全部更改完成
              if (completeNum >= carts.length-1) {
                //成功之后的回调
                resolve({"msg": "全部取消成功"})
              }
            })
        }
      })
    }
    return promiseCheckedAllFalse().then(res => {
      //从数据库中返回的数据，更新到本地购物车中
      store.commit('CHECKED_ALL_FALSE')
      return res
    })
  },
  //购物车中的全选 -> 全部选中
  checkedAllTrue (store) {
    //先拿到本地购物车的数据
    let carts = store.state.carts
    let completeNum = 0
    function promiseCheckedAllTrue () {
      return new Promise(function (resolve, reject) {
        for (let i = 0; i < carts.length; i++) {
          //更新数据库中的每个商品的勾选状态
          http.patch(api.host + '/carts/' + carts[i].id, {
            checked: true
          })
            .then(res => {
              completeNum++
              //全部更改完成
              if (completeNum >= carts.length-1) {
                //成功之后的回调
                resolve({"msg": "全部选中成功"})
              }
            })
        }
      })
    }
    return promiseCheckedAllTrue().then(res => {
      //从数据库中返回的数据，更新到本地购物车中
      store.commit('CHECKED_ALL_TRUE')
      return res
    })
  },
  //保存添加过来的地址对象
  saveSite (store, siteObj) {
    //1,先将地址对象存储到数据库，并返回在数据库中的id
    return http.post(api.host + '/sites', siteObj)
      .then(res => {
        //通过判断返回的结果是否包含id来判断是否已经存储成功
        if (res.data.id > 0) {
          //更改用户当前所选的地址
          http.patch(api.host + '/users/' + store.state.user.id, {
            select_site: res.data
          })
            .then(res => {
              //更新本地user对象
              store.commit('UPDATA_USER', res.data)
            })
          //2,保存到vuex中
          store.commit('SAVE_SITE', res.data)
          return {"msg": "添加成功"}
        } else {
          return {"msg": "添加失败"}
        }
      })
  },
  //更改所选的地址
  changeSelectedSite(store, siteObj) {
    //更改用户当前所选地址
    return http.patch(api.host + '/users/' + store.state.user.id, {
      select_site: siteObj
    })
      .then(res => {
        //监听成功后的返回值，如果id>0 则更改成功
        if(res.data.id > 0) {
          //更新本地中所选地址
          //更新本地user对象
          console.log(res.data)
          store.commit("UPDATA_USER", res.data)
          return {"msg": "更新所选地址成功"}
        }else {
          return {"msg": "更新所选地址失败"}
        }
      })
  },
  //修改地址信息后
  replace (store, siteObj) {
    if(Number(siteObj.id) === Number(store.state.user.select_site.id)) {
      //更新所选的地址
      store.dispatch('changeSelectedSite', siteObj)
    }
    //在数据库中 put:更改所有 
    return http.put(api.host + '/sites/' + siteObj.id, siteObj)
      .then(res => {
        if (res.data.id > 0) {
          //更改成功后，更新本地
          store.commit('REPLACE',res.data)
          return {"msg": "更新地址信息成功"}
        } else {
          return {"msg": "更新地址信息失败"}
        }
      })
  },
  //删除地址
  deleteSite (store, siteObj) {
    //在数据库中删除
    return http.delete(api.host + '/sites/' + siteObj.id, siteObj)
      .then(res => {
        if (!res.data.id > 0) {
          //删除本地vuex
          store.commit("DELETE_SITE", siteObj)
          return {"msg": "删除地址成功"}
        } else {
          return {"msg": "删除地址失败"}
        }
      })
  },
  //添加到收藏页面中
  addToFavor (store,productObj) {
    //先要构造一个收藏对象
    let favorObj = {
      user_id: store.state.user.id,
      product_id: productObj.id,
      img: productObj.imgs.min,
      name: productObj.name,
      unit: productObj.unit,
      price: productObj.price
    }
    //把创建好的收藏对象添加到数据库中
    return http.post(api.host + '/favorList',favorObj)
      .then(res => {
        if (res.data.id > 0) {
          //保存到本地vuex中的收藏列表中
          store.commit('ADD_FAVOR',res.data)
          return {"msg": "收藏成功"}
        } else {
          return {"msg": "收藏失败"}
        }
      })
  },
  //删除添加收藏
  deleteFavor (store,productObjId) {
    //通过传过来的商品的id获取到该商品的收藏id
    let favorList = store.state.favorList
    let productFavorId = 0
    //该商品对象在收藏列表中的下标
    let index = 0
    for (let i = 0; i < favorList.length; i++) {
      if (favorList[i].product_id = productObjId) {
        index = i
        productFavorId = favorList[i].id
      }
    }
    //数据库中删除
    return http.delete(api.host + '/favorList/' + productFavorId)
      .then(res => {
        //本地同步
        store.commit('DELETE_FAVOR',index)
        return {'msg': '删除收藏成功'}
      })
  },
  //删除收藏页中选中的商品
  deleteCheck (store, delFavorList) {
    //因为要执行删除是一个列表，所以使用promise来监听是否完成
    //promise 解决异步操作
    function promiseDelFavorList() {
      return new Promise(function (resolve,reject) {
        //为了验证是否完全删除成功
        let num = 0
        for (let i = 0; i < delFavorList.length; i++) {
          //在数据库中删除
          http.delete(api.host + '/favorList/' + delFavorList[i].id)
            .then(res => {
              num++
              if (num >= delFavorList.length) {
                //选中的收藏商品全部删除成功
                resolve({"msg": "取消收藏成功"})
              }
            })
        }
      })
    }
    return promiseDelFavorList()
      .then(res => {
        //删除本地
        store.commit("DELETE_CHECK",delFavorList)
        return res
      })
  }
}