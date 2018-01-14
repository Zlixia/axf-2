<template>
  <div class="product-item">
      <HeaderGray :headerTitle="productInfo.name + productInfo.unit+ 'ml'" back="true"/>
      <div class="main">
        <div class="img-wrap">
          <img v-lazy="productInfo.imgs.big" ref="dongImg">
        </div>
        <div class="detial-wrap">
          <p class="detial-name">{{productInfo.name}}{{productInfo.unit}}ml</p>
          <p class="detial-price">￥{{productInfo.price}}</p>
        </div>
        <!-- 商品详情 -->
        <div class="product-detial-wrap">
          <div class="product-title">商品详情</div>
          <p class="product-item">品<span class="text-hidden">品牌</span>牌
          <span class="text-hidden">品</span><span class="txt">{{productInfo.brand}}</span></p>
          <p class="product-item">产品规格<span class="text-hidden">品</span><span class="txt">{{productInfo.unit}}ml</span></p>
          <p class="product-item">保质期限<span class="text-hidden">品</span>
          <span class="txt">{{productInfo.expiration_date}}月</span></p>
        </div>
        <!-- 爱鲜蜂背景 -->
        <div class="block">
          <img src="./images/productDetailBg.jpg">
        </div>
        <!-- 详情页添加收藏商品 -->
        <div class="addCollect-wrap">
          <div class="collect" :class="{'active': favorBol}" @click="addFavor">收藏</div>
          <div class="addProduct">添加商品：
            <div class="btn-wrap">
              <span :class="{'active':productInfo.num > 0}" @click="subCart">-</span>
              <span class="products-list-num">{{productInfo.num}}</span>
              <span @click="addCart" :class="{'active':productInfo.num > 0}">+</span>
            </div>
            <div class="cheLine"></div>
          </div>
        </div>
        <!-- 购物的车 -->
        <div class="che" @click="goCart">
          <div ref="cheEleBtn" class="cheNum" v-if="cartNums > 0" 
            :class="{'active': numsActive}">{{cartNums}}</div>
        </div>
      </div>
  </div>
</template>
<script>
import HeaderGray from '@/components/Header-gray/Header-gray'
import api from '@/api'
// 用于避免在进行对收藏进行添加移除操作的时候重复执行
let favorAtiveBol= true
export default {
  //当组件创建成功的时候执行，且执行一次
  activated () {
    favorAtiveBol = true
    //获取商品的id
    //console.log(this.$route.params)
    let productId = this.$route.params.id
    // 判断用户是否已经登陆，如果已经登陆就从本地商品列表中读取(有数量的)，
    //如果没有登陆就直接走请求获取
    if (this.user.id > 0) {
      //根据id过去商品信息
      let computedCategories = this.computedCategories
      label:
      for (let i = 0; i < computedCategories.length; i++) {
        let products = computedCategories[i].products
        for (let j = 0; j < products.length; j++) {
          if (products[j].id === Number(productId)) {
            this.productInfo = products[j]
            break label
          }
        }
      }
      /*
        先判断这个商品在商品收藏页中是否存在，
        那么首先就要获取商品收藏列表,然后遍历
      */
      //初始化收藏按钮的状态
      this.favorBol = false
      for (let i = 0; i < this.favorList.length; i++){
        if (this.favorList[i].product_id === Number(productId)) {
          //改变收藏按钮的状态
          this.favorBol = true
        }
      }
    } else {
      this.$http.get(api.host + '/products/' + productId)
      .then(res => {
        //返回的数据是一个商品对象
        this.productInfo = res.data
        //console.log(res.data)
      })
    }
    
  },
  data () {
    return {
      productInfo: {
        imgs: {}
      },
      //div.cheNum的动画按钮
      numsActive: false,
      //控制收藏列表按钮是否被选中
      favorBol: false
    }
  },
  components: {
    HeaderGray
  },
  computed: {
    //获取本地中的商品收藏列表
    favorList () {
      return this.$store.state.favorList
    },
    //用户信息
    user () {
      return this.$store.state.user
    },
    //分类列表
    computedCategories () {
      return this.$store.state.computedCategories
    },
    //获取购物车中所选商品的总数量
    cartNums () {
      return this.$store.getters.cartNums
    }
  },
  //监听购物车数量变化 -> 动画
  watch: {
    cartNums () {
      this.numsActive = true
      setTimeout(() => {
        this.numsActive = false
      },300)
    }
  },
  methods: {
    //添加收藏
    addFavor () {
      //判断用户是否登录
      if (this.user.id > 0) {
        //每个商品都先默认没有收藏
        if (favorAtiveBol) {
          favorAtiveBol = false
          if (this.favorBol) {
            // 能进来就代表已经收藏了，删除
            this.$store.dispatch('deleteFavor',this.productInfo.id)
              .then(res => {
                favorAtiveBol = true
                this.favorBol = false
                this.$msg('提示',res.msg)
              })
          } else {
            //没有收藏 ,添加
            this.$store.dispatch('addToFavor',this.productInfo)
              .then(res => {
                favorAtiveBol = true
                //改变收藏状态
                this.favorBol = true
                this.$msg('提示',res.msg)
              })
          }
          
        }
      } else {
        this.$msg("提示","未登录，请登录")
          .then(action => {
            this.$router.push('/login')
          })
      }
    },
    //添加商品
    addCart () {
      let product = this.productInfo
      //console.log(product)
      //首先验证是否登录
      if (this.user.id) {
        //用户已经登录或注册了
        //直接将选中的商品添加到购物车中
        this.$store.dispatch('addCart',product)
          .then(res => {
            //this.$msg("提示", res.msg)

            //(注意：vue中获取DOM元素需要添加一个属性ref)
            /*现在这里执行动画  1，获取所点击的图片的位置信息 
              2，获取cartNums数量的那个按钮位置信息
            */
            //开始
            let dongStart = this.$refs.dongImg.getBoundingClientRect()
            //结束
            let location = this.$store.state.location
            //新建一个对象
            let obj = {
              src: product.imgs.big,
              width: dongStart.width,
              height:dongStart.height,
              start: {
                left: dongStart.left,
                top: dongStart.top
              },
              end: {
                left: location.left,
                top: location.top
              }
            }
            //调用在vue原型中自己手动封装好的插件，把obj传过去
            this.$animationOwn(obj)
             
            //更新或者添加成功后，让num++
            product.num++
          })
      } else {
        //用户没有登录或注册
        this.$msg("提示","未登录，请登录")
          .then(action => {
            this.$router.push('/login')
          })
      } 
    },
    //减少
    subCart () {
      let product = this.productInfo
      if (this.user.id) {
        if (product.num > 0) {
          // 追加product_id属性
          product.product_id = product.id
          this.$store.dispatch('subCart',product)
            .then(res => {
              //this.$msg("提示", res.msg)
              product.num--
            })
        }
      } else {
        //没登录
        this.$msg("提示","未登录，请登录")
          .then(action => {
            this.$router.push('/login')
          })
      }
    },
    //去到购物车页面
    goCart () {
      this.$router.push('/cart')
    }
  }
}
</script>
<style lang="less" scoped>
@import url('../../styles/index.less');
  .text-hidden{
    visibility: hidden;
  }
  .img-wrap {
    padding: 1rem;
    background-color: #fff;
    img{
      width: 100%;
    }
  }
  .detial-wrap {
    text-align: center;
    background-color: #fff;
    .detial-name {
      font-size:2.3rem;
      padding: 0 1rem; 
      color: #292d33;
      .no-wrap();
    }
    .detial-price {
      color: #f40;
      padding: 1rem 0 3rem 0;
      font-size: 1.8rem;
      font-weight: 400;
    }
  }
  .product-detial-wrap {
    background-color: #fff;
    padding: 1.5rem;
    margin-bottom: 0.5rem;
    margin-top: 0.5rem;
    font-size: 1.4rem;
    .product-title{
      margin-bottom: 1.5rem;
      background: url('images/title_bg.png') center center no-repeat;
      text-align: center;
      color: #e0bd6a;
      background-size: auto 0.2rem;
    }
    .product-item{
      height: 3rem;
      line-height: 3rem;
      color: #999999;
      .txt{
        color: #292d33;
      }
    }
  }
  .block {
    margin-bottom: 0.5rem;
    img{
      width: 100%;
      vertical-align: middle;
    }
  }
  .addCollect-wrap{
    position: fixed;
    bottom: 0;
    height: 5rem;
    line-height: 5rem;
    width: 100%;
    padding-left: 1.4rem;
    .collect{
      position: absolute;
      left: 0;
      top: 18%;
      width: 4rem;
      padding-top: 1.8rem;
      line-height: 1.8rem;
      font-size: 1rem;
      text-align: center;
      display: inline-block;
      background: url('./images/favor.png') top center no-repeat;
      background-size: 1.8rem auto;
    }
    .collect.active{
      background-image: url('./images/favor_active.png')
    }
    .addProduct{
      position: relative;
      margin-left: 3rem;
      line-height: 5rem;
      font-size: 1.4rem;
    }
    .btn-wrap{
      position: absolute;
      left: 28%;
      bottom: 0rem;
      width: 9rem;
      height:5rem;
      line-height: 6rem;
      span:nth-child(2n+1){
        display: inline-block;
        width: 2.5rem;
        height: 2.5rem;
        line-height: 2.2rem;
        text-align: center;
        border: 1px solid lightgray;
        color: #f40;
        border-radius: 50%;
        font-size: 2.4rem;
      }
      span:nth-child(2n+1).active{
        border-color: #f40;
      }
      span:nth-child(2){
        display: inline-block;
        width: 2rem;
        height: 3rem;
        line-height: 2.5rem;
        text-align: center;
      }
    }
  }
  .cheLine {
    position: absolute;
    width: 6rem;
    height: 6rem;
    right: 1.8rem;
    bottom: 0.6rem;
    border: 0.1rem solid #e0e0e0;
    border-radius: 50%;
  }
  .che{
    position: fixed;
    right: 0.6rem;
    bottom: 0.7rem;
    width: 5.4rem;
    height: 5.4rem;
    border-radius: 50%;
    border: 0.3rem solid #f7f7f7;
    z-index: 4;
    background: url('./images/che.png') center center no-repeat;
    background-size: 80%;
    background-color: #ffd600;
    .cheNum{
      position: absolute;
      right: 0;
      width: 1.8rem;
      border-radius: 50%;
      line-height: 1.8rem;
      text-align: center;
      font-size: 1rem;
      color: #fff;
      background-color: #f40;
      transition: all 0.3s cubic-bezier(0.28,-0.42, 0.37, 1.55);
    }
    .cheNum.active{
      transform: scale(1.2)
    }
  }
</style>


