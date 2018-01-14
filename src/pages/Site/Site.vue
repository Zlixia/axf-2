<template>
  <div class="site">
    <HeaderGray headerTitle="选择地址" back="true"/>
    <div class="main">
      <div class="site-current"><span>定位到当前位置</span></div>
      <!-- 地址栏为空的时候 -->
      <div class="site-dingwei-wrap" v-if="!sites.length>0">
        <div class="site-dingwei"></div>
        <p class="address">您还没有地址哦~</p>
      </div>
      <!-- 新增的地址在地址栏中的显示 -->
      <ul class="address-lists" v-if="sites.length>0">
        <li class="address-list" v-for="item in sites" 
        :key="item.index" 
        @click="changeSelectedSite(item)">
          <div class="address-text" :class="{'active': user.select_site.id == item.id}">
            <p>{{item.linkman}}&nbsp;&nbsp;&nbsp;{{item.phone}}</p>
            <p>{{item.city}}&nbsp;{{item.site}}</p>
          </div>
          <div class="edit" @click.stop="goReplan(item.id)"></div>
        </li>
      </ul>
    </div>
    <!-- 新增地址 -->
    <div class="newAddress-btn">
      <p @click="addSite">+&nbsp;新增地址</p>
    </div>
  </div>
</template>
<script>
import HeaderGray from '@/components/Header-gray/Header-gray'
export default {
  components: {
    HeaderGray
  },
  created () {
    //判断是否登录
    if(!(this.user.id > 0)) {
      this.$msg("提示","未登录，请登录")
        .then(action => {
          this.$router.push('/login')
        })
    }
  },
  methods: {
    addSite () {
      this.$router.push('/addSite')
    },
    //改变了选择的地址
    changeSelectedSite (siteObj) {
      this.$store.dispatch('changeSelectedSite',siteObj)
        .then(action => {
          this.$router.push('/')
        })
    },
    //跳转到修改页面
    goReplan (id) {
      this.$router.push('/replan/'+ id)
    }
  },
  computed: {
    //获取本地的sites（所有的siteObj对象）
    sites () {
      return this.$store.state.sites
    },
    //获取本地的用户信息
    user () {
      return this.$store.state.user
    }
  }
}
</script>
<style lang="less" scoped>
@import url("../../styles/index.less");
p {
  .no-wrap();
}
.site-current {
  background-color: #ffffff;
  font-size: 1.4rem;
  height: 4.5rem;
  line-height: 4.5rem;
  text-align: center;
  span{
    display: inline-block;
    padding-left: 2.5rem;
    background: url('./images/current_bg.png') left center no-repeat;
    background-size: 2rem;
  }
}
.site-dingwei-wrap {
  padding-top: 24%;
  text-align: center;

  //display: none;
  .site-dingwei {
    width: 8rem;
    height: 8rem;
    border-radius: 4rem;
    background: url('../../styles/images/dingwei.png') center center no-repeat;
    background-size: contain;
    margin: 0 auto;
  }
  .address {
    font-size: 1.4rem;
    color:#999999;
    padding-top: 1.2rem;
  }
}
.newAddress-btn {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 5rem;
  line-height: 5rem;
  padding-bottom: 0.4rem;
  background-color: #fff;
  p{
    font-size: 1.4rem;
    height: 3.7rem;
    line-height: 3.7rem;
    margin: 0.9rem 20%;
    background-color: #ffd600;
    border-radius: 0.5rem;
    text-align: center;
  }
}
ul.address-lists {
  z-index: 10;
  position: absolute;
  top: 4.4rem;
  width: 100%;
  margin: 1rem 0;
  background-color: #fff;
  .address-list {
    height: 8rem;
    font-size: 1.4rem;
    border-bottom: 1px solid lightgray; 
    position: relative;
    .address-text {
      position: absolute;
      top: 0.5rem;
      bottom: 0.5rem;
      left: 0;
      right: 8rem;
      line-height: 2.8rem;
      padding-top: 0.7rem;
      padding-left: 1rem;
      border-left: 0.5rem solid transparent;
      p:nth-child(2) {
        color:#999999;
      }
    }
    .address-text.active {
      border-left: 0.5rem solid #ffd600;
    }
    .edit {
      position: absolute;
      width: 8rem;
      height: 5.2rem;
      top: 1.5rem;
      right: 0;
      background: url('./images/edit.png') center center no-repeat;
      background-size: 2.2rem;
      border-left: 1px solid lightgray;
    }
  }
}
</style>


