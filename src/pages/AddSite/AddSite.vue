<template>
  <div class="addSite">
    <HeaderGray headerTitle="添加地址" back="true"/>
    <span class="save-addSite" @click="saveSite">保存</span>
    <div class="main">
      <table>
        <tr class="item_list">
          <th>联系人</th>
          <td><input type="text" placeholder="收货人姓名" v-model="linkman"></td>
        </tr>
        <tr class="item_list">
          <th>&nbsp;&nbsp;&nbsp;</th>
          <td>
            <span class="man" :class="{'active': sex===0}" 
            @click="sex=0">先生</span>
            <span class="man" :class="{'active': sex===1}" 
            @click="sex=1">女士</span>
          </td>
        </tr>
        <tr class="item_list">
          <th>手机号码</th>
          <td><input type="text" placeholder="鲜蜂侠联系您的电话" 
          v-model="phone"></td>
        </tr>
        <tr class="item_list">
          <th>所在城市</th>
          <td>
            <select :value="selectedCity" @change="cityChange">
              <option value="">请选择城市</option>
              <option v-for="(item,index) in citys" :key="index" 
              :value="item.city">{{item.city}}</option>
            </select>
          </td>
        </tr>
        <!-- 点击后会跳转到百度地图页面 -->
        <tr class="item_list">
          <th>所在地区</th>
          <td class="diqu"><input type="text" @click.prevent="selectSite" 
          placeholder="请选择您的住宅小区、大厦或学校" :value="selectedSite"></td>
        </tr>
        <tr class="item_list">
          <th>详细地址</th>
          <td><input type="text" v-model="detailSite"
          placeholder="请输入楼号门牌号等详细信息"></td>
        </tr>
      </table>
    </div>
  </div>
</template>
<script>
import api from '@/api'
import HeaderGray from '@/components/Header-gray/Header-gray'
export default {
  components: {
    HeaderGray
  },
  //因为citys列表只需要获取一次，所以使用created
  created () {
    //获取城市列表
    this.$http.get(api.host + '/citys')
      .then(res => {
        this.citys = res.data
      })
  },
  data () {
    return {
      //所有的城市列表
      citys: [],
      //当前所选择的城市
      //city: '',
      linkman: '',
      sex: '',
      phone: '',
      //所在地区
      //site: '',
      //详细地址
      detailSite: ''
    }
  },
  methods: {
    //先判断用户是否登录
    saveSite () {
      //判断是否有用户id
      if (this.user.id) {
        //判断这个对象里是否有值
        if (this.linkman !== '' && this.detailSite !== '' 
          && this.sex !== '' && this.selectedCity !== '' 
          && this.selectedSite !== '') {
            //创建地址对象
            let siteObj = {
              linkman: this.linkman,
              //sex:0 先生    1,女士
              sex: this.sex,
              phone: this.phone,
              city: this.selectedCity,
              site: this.selectedSite,
              detailSite: this.detailSite,
              userId: this.user.id,
              x: this.selectedX,
              y: this.selectedY
            }
            //将地址对象对象添加到数据库和vuex中
            this.$store.dispatch('saveSite',siteObj)
              .then(res => {
                return this.$msg("提示",res.msg)
              })
              .then(action => {
                //跳转到地址列表页
                this.$router.push('/site')
              })
          } else {
            this.$msg("提示","内容不能为空")
          }
      }else {
        //没有用户
        this.$msg("提示","未登录，请登录")
          .then(action => {
            this.$router.push('/login')
          })
      }
    },
    //需要判断看是否选择了城市，决定是否跳转到地图页
    selectSite () {
      if (this.city !== '') {
        //跳转到百度地图页
        this.$router.push('/select-site')
      } else {
        this.$msg("提示","请先选择城市")
      }
    },
    //更新城市和重置地址
    cityChange () {
      this.$store.commit('CITY_CHANGE',event.target.value)
      this.$store.commit('SITE_CHANGE', '')
    }
  },
  computed: {
    user () {
      return this.$store.state.user
    },
    selectedCity () {
      return this.$store.state.selectedCity
    },
    selectedSite () {
      return this.$store.state.selectedSite
    }
  },
  //组件停用时触发
  deactivated () {
    this.linkman = ''
    this.phone = ''
    this.detailSite = ''
    this.sex = ''
  }
}
</script>
<style lang="less" scoped>
.main {
  bottom: 0;
}
.save-addSite {
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
table {
  width: 100%;
  font-size: 1.4rem;
  background-color: #fff;
}
.item_list {
  width: 100%;
  border-top: 1px solid #e0e0e0;
  th {
    width: 7rem;
    padding: 1.1rem 0 1.1rem 1.5rem;
    text-align: left;
    font-weight: 400; 
  }
  td {
    input {
      outline: none;
      border: 0;
      font-size: 1.4rem;
      width: 90%;
    }
    select {
      width: 100%;
      font-size: 1.4rem;
      outline: none;
      border: 0;
      appearance: none;
      background: url('./images/cart-more.png') right center no-repeat;
      background-size: 2rem;
    }
  }
  td.diqu {
    background: url('./images/cart-more.png') right center no-repeat;
    background-size: 2rem;
  }
}
.man {
  display: inline-block;
  padding-left: 2rem;
  margin-right: 1rem;
  background: url('./images/checkbox.png') 0rem center no-repeat;
  background-size: 1.4rem;
}
.man.active {
  background-image: url('./images/checkbox-selectd.png')
}
</style>


