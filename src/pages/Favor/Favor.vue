<template>
  <div class="favor">
    <HeaderGray headerTitle="商品收藏" back="true"/>
    <span class="edit-product" @click="editBtn">{{editBol ? '完成':'编辑'}}</span>
    <div class="main" :style="{'bottom': editBol ? '4.9rem':'0'}">
      <ul class="products-lists">
        <div class="products-wrap" v-for="item in favorList" :key="item.id" 
        @click="selectProductItem(item)">
          <span class="checkbox" v-show="editBol" :class="{'active': item.check}"></span>
          <li class="products-list">
            <div class="products-list-img">
              <img v-lazy="item.img"/>
            </div >
            <div class="products-list-div">
              <div class="products-list-title">
                <p>{{item.name}}</p>
              </div>
              <div class="products-list-content">
                <p>{{item.unit}}ml</p>
                <p>￥{{item.price}}</p>
              </div>
            </div>
          </li>
        </div>
      </ul>
        <!-- 全选和删除 -->
      <div class="footer" v-show="editBol">
        <span class="allSelect" :class="{'active': allCheckBol}"  @click="changeAllCheck">全选</span>
        <span class="deleteBtn" @click="deleteCheck">删除</span>
      </div>
    </div>
  </div>
</template>
<script>
import HeaderGray from '@/components/Header-gray/Header-gray'
import api from '@/api'
export default {
  components: {
    HeaderGray
  },
  data () {
    return {
      //收藏页的收藏列表
      favorList :[],
      //默认编辑按钮显示 编辑 
      editBol: false
    }
  },
  //每次激活就会触发
  activated () {
    this.editBol = false
    if (this.user.id > 0) {
      //已经登录就调用这个方法获取收藏列表数据
      this.getFavorList()
    } else {
      this.$msg("提示","未登录，请登录")
        .then(action => {
          this.$router.push('/login')
        })
    }
  },
  computed: {
    user () {
      return this.$store.state.user
    },
    //要得到全选按钮的状态，这个计算属性返回的就是选中按钮的状态
    allCheckBol () {
      //假设一开始就是全部都选中
      let checkBol = true
      for (let i = 0; i < this.favorList.length; i++) {
        //既然全选，那么所有收藏的商品的check属性都应该是true，否则假设就不成立了
        if (!this.favorList[i].check){
          checkBol = false
        }
      }
      return checkBol
    }
  },
  methods: {
    //删除勾选中了的商品
    deleteCheck () {
      //先判断收藏列表中有哪些商品被选中，也就是check为true的收藏商品
      let delFavorList = this.favorList.filter(item => item.check)
      //判断至少要删除的收藏列表中有一个
      if (delFavorList.length > 0) {
        this.$store.dispatch('deleteCheck',delFavorList)
          .then(res => {
            this.$msg("提示", res.msg)
            //一定要重新从本地获取新的收藏列表
            this.getFavorList()
          })
      }
    },
    //改变全选按钮的选中状态，只有要么全选要么全不选两种
    changeAllCheck () {
      //看当前的全选按钮的选中状态，如果是选中那么就全部取消
      if (this.allCheckBol) {
        for (let i = 0; i < this.favorList.length; i++) {
          this.favorList[i].check = false
        }
      } else {
        for (let i = 0; i < this.favorList.length; i++) {
          this.favorList[i].check = true
        }
      }
    },
    //点击图片跳转到该商品的详情页
    selectProductItem (item) {
      //先判断是否是编辑状态，只有显示编辑是才会跳转
      if (this.editBol) {
        //在显示完成时，点击会勾选check
        item.check = !item.check
      } else {
        //跳转到详情页
        this.$router.push('/product-item/' + item.product_id)
      }
    },
    //点击编辑按钮切换它的状态
    editBtn () {
      this.editBol = !this.editBol
    },
    //获取收藏列表
    /* 因为需要添加选择的状态，这个状态是不需要跟数据库和本地收藏列表同步，
      只需要获取原始收藏列表就可以，所以获取本地收藏列表保存到组件的data中*/
    getFavorList () {
      let favorList = JSON.parse(JSON.stringify(this.$store.state.favorList))
      //为每个收藏对象添加一个check 属性
      for (let i = 0; i < favorList.length; i++) {
        favorList[i].check = false
      }
      //让现在有check属性的对象 保存到favorList中
      this.favorList = favorList
      console.log(this.favorList)
    }
    
  }
}
</script>
<style lang="less" scoped>
@import url('../../styles/index.less');
p {
  .no-wrap();
}
.main {
  //bottom: 0;
}
.edit-product {
  z-index: 10;
  color: #999999;
  font-size: 1.4rem;
  display: inline-block;
  width: 6rem;
  height: 4.4rem;
  line-height: 4.4rem;
  text-align: center;
  position: absolute; 
  right: 0;
}
ul.products-lists {
  padding-left: 1.4rem;
  background-color: #ffffff;
}
.products-wrap {
  overflow: hidden;
  //padding-left: 2rem;
  border-bottom: 1px solid #e0e0e0;
}
.products-list {
  float: left;
  overflow: hidden;
  padding: 0.5rem;
  width: 88%;
  .products-list-img {
    float: left;
    width: 7rem;
    img {
      width: 100%;
      padding-top: 0.5rem;
    }
  }
  .products-list-div {
    width: 60%;
    padding-top: 0.5rem;
    padding-left: 1rem;
    float: left;
    font-size: 1.2rem;
    .products-list-title {
      font-size: 1.4rem;
    }
    .products-list-content {
      padding-top: 2rem;
      p {
        height: 2rem;
        line-break: 2rem;
      }
      p:nth-child(1) {
        color: #999;
      }
      p:nth-child(2) {
        color: #f40;
      }
    }
  }
}
.checkbox {
  float: left;
  display: inline-block;
  width: 2rem;
  height: 8rem;
  padding-top: 1.5rem;
  background: url('./images/checkbox.png') center center no-repeat;
  background-size: 1.8rem 1.8rem;
}
.checkbox.active{
  background-image: url("./images/checkbox-selectd.png");
}
.footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 5rem;
  line-height: 5rem;
  border-top: 1px solid #e0e0e0;
  background-color: #ffffff;
  font-size: 1.4rem;
  .allSelect {
    display: inline-block;
    padding-left: 4.4rem;
    background: url('./images/checkbox.png') 1.4rem center no-repeat;
    background-size: 1.8rem 1.8rem;
  }
  .allSelect.active {
    background-image: url('./images/checkbox-selectd.png');
  }
  .deleteBtn {
    display: inline-block;
    background-color: @color-background;
    width: 8rem;
    line-height: 3.7rem;
    margin-right: 1.2rem;
    text-align: center;
    border-radius: 0.5rem;
    position: absolute;
    top: 0.7rem;
    right: 0;
  }
}
</style>


