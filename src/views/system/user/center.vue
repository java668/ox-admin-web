<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="8" :lg="6" :xl="5" style="margin-bottom: 10px">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>个人信息</span>
          </div>
          <div>
            <div style="text-align: center">
              <div class="el-upload">
                <img :src="avatar ? avatar : Avatar" title="头像" class="avatar" >
              </div>
            </div>
            <ul class="user-info">
              <li><div style="height: 100%"><svg-icon icon-class="login" /> 登录账号<div class="user-right">{{ user.username }}</div></div></li>
              <li><svg-icon icon-class="user1" /> 用户昵称 <div class="user-right">{{ user.nickName }}</div></li>
              <li><svg-icon icon-class="phone" /> 手机号码 <div class="user-right">{{ user.phone }}</div></li>
              <li><svg-icon icon-class="email" /> 用户邮箱 <div class="user-right">{{ user.email }}</div></li>
              <li>
                <svg-icon icon-class="anq" /> 安全设置
                <div class="user-right">
                  <a @click="$refs.pass.dialog = true">修改密码</a>
                </div>
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <updatePass ref="pass" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import updatePass from './center/updatePass'
import store from '@/store'
import Avatar from '@/assets/images/avatar.png'
export default {
  name: 'Center',
  components: { updatePass },
  data() {
    return {
      Avatar: Avatar
    }
  },
  computed: {
    ...mapGetters([
      'avatar',
      'user'
    ])
  },
  created() {
    store.dispatch('user/getInfo').then(() => {})
  },
  methods: {
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  .avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;
  }
  .user-info {
    padding-left: 0;
    list-style: none;
    li{
      border-bottom: 1px solid #F0F3F4;
      padding: 11px 0;
      font-size: 13px;
    }
    .user-right {
      float: right;
      a{
        color: #317EF3;
      }
    }
  }
</style>
