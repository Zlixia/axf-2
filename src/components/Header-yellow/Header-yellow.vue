<template>
  <header>
    <router-link tag="div" to="/site" class="header-content">
      <span>宝安区&nbsp;</span>
    </router-link> 
    <span class="search">搜&nbsp;索&nbsp;</span>
  </header>
</template>
<script>
export default {
  computed: {
    user () {
      return this.$store.state.user
    }
  }
}
</script>

<style lang="less" scoped>
@import url("../../styles/index.less");
@import url("../../styles/mixin.less");
header{
  position: fixed;
  top: 0;
  width: 100%;
  height: 4.5rem;
  z-index: 3;
  background-color: @color-background;
}
.header-content{
  position: absolute;
  top: 0;
  bottom: 0;
  left: 6rem;
  right: 6rem;
  line-height: 4.5rem;
  text-align: center;
  font-weight: 700;  
  font-size: 1.4rem;
  span{
    display: inline-block;
    width: 85%;
    .no-wrap();
    &:after{
      content: "▼";
    }
  }  
}
.search{
  .extend-click();
  position: absolute;
  right: 0.6rem;
  top: 0;
  width: 6rem;
  height: 4.4rem;
  font-size: 1.2rem;
  background: url("./images/serach.png") no-repeat right 0.5rem;
  background-size: auto 2.3rem;
  text-align: right;
  line-height: 7rem;
}
</style>
