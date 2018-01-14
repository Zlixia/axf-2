<template>
  <ul>
    <router-link to="/" tag="li" class="home">
      <span></span> 
      首页
    </router-link>
    <router-link to="/shop" tag="li" class="current">
      <span></span>
      闪送超市
    </router-link>
    <router-link to="/cart" tag="li" class="cart" ref="cheEl">
      <span></span>
      <var v-if="cartNums > 0" :class="{'active': numsActive}">{{cartNums}}</var>
      购物车
    </router-link>
    <router-link to="/mine" tag="li" class="mine">
      <span></span>
      我的
    </router-link>
  </ul>
</template>
<script>
export default {
  data () {
    return {
      //购物车按钮的动画
      numsActive: false  
    }
  },
  //DOM结构创建完成后执行 （获取dom元素必须要在这里面进行）
  mounted () {
    
    //获取动画结束的终点位置信息  $el是把它转换成真正的dom元素 getBoundingClientRect()是获取元素的位置信息
    let location = this.$refs.cheEl.$el.getBoundingClientRect()
    console.log(location)
    //存储到vuex中
    this.$store.commit('LOCATION', location)
  },
  //计算属性
  computed: {
    tabBarShow () {
      return this.$store.state.tabBarShow
    },
    //获取动画结束位置信息
    location () {
      return this.$store.state.location
    },
    //获取选中的所有商品的数量
    cartNums () {
      return this.$store.getters.cartNums
    }
  },
  //watch监听购物车数量变化 -> 动画
  watch: {
    cartNums () {
      this.numsActive = true
      setTimeout(() => {
        this.numsActive = false
      },300)
    }
  },
  tabBarShow () {
      // 监听tabBarShow的变化,如果为true了的话就获取位置信息
      if (!this.location.width) {
        let location = this.$refs.cheEle.$el.getBoundingClientRect()
        this.$store.commit('CHE_NUMS', location)
      }
    }
}
</script>

<style lang="less" scoped>
  @import url('../../styles/var.less');
  ul{
    position: fixed;
    z-index: 1000;
    bottom: 0;
    width: 100%;
    height: 5rem;
    background-color:#f6f6f6;
    display: flex;
    li{
      flex: 1;
      text-align: center;
      font-size: 1.2rem;
      color: #777;
      position: relative;

      span{
        display: block;
        width: 100%;
        height: 3rem;
        background: no-repeat center .6rem;
        background-size: auto 2rem;
      }
    }
  }
  ul>li.home>span{
  background-image: url("./images/home.png");
}
ul>li.current>span{
  background-image: url("./images/current.png");
}
ul>li.cart>span{
  background-image: url("./images/cart.png");
}
ul>li.mine>span{
  background-image: url("./images/mine.png");
}
// 兼容
// @-webkit-keyframes navs{
//   0%{
//     -webkit-background-size: auto .6rem;
//     background-size: auto .6rem;
//   }
//   20%{
//     -webkit-background-size: auto 2.2rem;
//     background-size: auto 2.2rem;
//   }
//   40%{
//     -webkit-background-size: auto 1.8rem;
//     background-size: auto 1.8rem;
//   }
//   60%{
//     -webkit-background-size: auto 2.06rem;
//     background-size: auto 2.06rem;
//   }
//   80%{
//     -webkit-background-size: auto 1.94rem;
//     background-size: auto 1.94rem;
//   }
//   100%{
//     -webkit-background-size: auto 2rem;
//     background-size: auto 2rem;
//   }
// }
@keyframes navs{
  0%{
    -webkit-background-size: auto .6rem;
    background-size: auto .6rem;
  }
  20%{
    -webkit-background-size: auto 2.2rem;
    background-size: auto 2.2rem;
  }
  40%{
    -webkit-background-size: auto 1.8rem;
    background-size: auto 1.8rem;
  }
  60%{
    -webkit-background-size: auto 2.06rem;
    background-size: auto 2.06rem;
  }
  80%{
    -webkit-background-size: auto 1.94rem;
    background-size: auto 1.94rem;
  }
  100%{
    -webkit-background-size: auto 2rem;
    background-size: auto 2rem;
  }
}
ul>li.home.router-link-exact-active>span{
  background-image: url("./images/home-active.png");
}
ul>li.current.router-link-exact-active>span{
  background-image: url("./images/current-active.png");
}
ul>li.cart.router-link-exact-active>span{
  background-image: url("./images/cart-active.png");
}
ul>li.mine.router-link-exact-active>span{
  background-image: url("./images/mine-active.png");
}
ul>li.router-link-exact-active>span{
  animation: navs 1s;
}
.cart > var {
  position: absolute;
  right: 1.1rem;
  top: 0.5rem;
  width: 1.8rem;
  border-radius: 50%;
  line-height: 1.8rem;
  text-align: center;
  font-size: 1rem;
  color: #fff;
  background-color: #f40;
  transition: all 0.3s cubic-bezier(0.28,-0.42, 0.37, 1.55);
}
.cart > var.active {
  transform: scale(1.2)
}
</style>


