<template>
  <div class="login">
    <div class="m"></div>
    <div class="wrap">
      <div class="logo">
        <!-- <span class="title">
          <img src="@/assets/login_logo.png" alt="">
          <p class="text">
            <i>活动系统</i>
            <i>
              <u>A</u>
              <u>C</u>
              <u>T</u>
              <u>I</u>
              <u>V</u>
              <u>I</u>
              <u>T</u>
              <u>Y</u>
              <u>&nbsp;</u>
              <u>S</u>
              <u>Y</u>
              <u>S</u>
              <u>T</u>
              <u>E</u>
              <u>M</u>
            </i>
          </p>
        </span> -->
        <img src="@/assets/logo.png" alt="" class="sly_logo">
      </div>
      <div class="main">
        <a-form
          id="components-form-demo-normal-login"
          :form="form"
          class="login-form"
          @submit="handleSubmit"
        >
          <div class="login-form-title">
            <span>您好!</span>
            <i v-show="!showNewSet">欢迎来到云店后台管理系统， 请从以下方式登录。</i>
            <i v-show="showNewSet" style="color: #ee0000;">新密码为6~16位并至少包含字母，数字或特殊字符任意两种。</i>
          </div>
          <div v-if="!showNewSet">
            <a-form-item>
              <a-input
                class="login-form-input"
                :maxLength='11'
                v-decorator="[
                  'userName',
                  { rules: [{ required: true, message: '请输入您的账号!' }] },
                ]"
                placeholder="账号"
                autocomplete="off"
                :disabled="isLoging"
              >
                <a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.6)" />
              </a-input>
            </a-form-item>
            <a-form-item>
              <a-input
                class="login-form-input"
                v-decorator="[
                  'password',
                  { rules: [{ required: true, message: '请输入您的密码!' }] },
                ]"
                type="password"
                placeholder="密码"
                :disabled="isLoging"
              >
                <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.6)" />
              </a-input>
            </a-form-item>
            <a-form-item>
              <a-button type="primary" html-type="submit" class="login-form-button" :loading="isLoging">
                登录
              </a-button>
            </a-form-item>
          </div>
          <div v-if="showNewSet">
            <a-form-item>
              <a-input
                class="login-form-input"
                v-decorator="[
                  'oldPsw',
                  { rules: [{ required: true, message: '请输入您的旧密码!' }] },
                ]"
                placeholder="旧密码"
                type="password"
                autocomplete="new-password"
                :disabled="isLoging"
              >
                <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.6)" />
              </a-input>
            </a-form-item>
            <a-form-item>
              <a-input
                class="login-form-input"
                v-decorator="[
                  'newPsw',
                  { rules: [{ required: true, message: '密码不符合校验规则!', pattern: /^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*]+$)[a-zA-Z\d!@#$%^&*]{6,16}$/ }] },
                ]"
                placeholder="新密码"
                type="password"
                autocomplete="new-password"
                :disabled="isLoging"
              >
                <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.6)" />
              </a-input>
            </a-form-item>
            <a-form-item>
              <a-input
                class="login-form-input"
                v-decorator="[
                  'newPsw1',
                  { rules: [{ required: true, message: '密码不符合校验规则!', pattern: /^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*]+$)[a-zA-Z\d!@#$%^&*]{6,16}$/}] },
                ]"
                placeholder="新密码"
                autocomplete="new-password"
                type="password"
                :disabled="isLoging"
              >
                <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.6)" />
              </a-input>
            </a-form-item>
            <a-form-item>
              <a-button-group style="display: flex;">
                <a-button type="primary" html-type="submit" class="login-form-button" :loading="isLoging">
                  确认
                </a-button>
                <a-button @click="closeSetPsw" class="login-form-button" :loading="isLoging">
                  取消
                </a-button>
              </a-button-group>
            </a-form-item>
          </div>
        </a-form>
      </div>
    </div>
  </div>
</template>

<script>
import { loginUser, sysUserUpdate } from '@/https'
import { mapMutations, mapGetters } from 'vuex'
import routes from '@/Router/routes'
import moment from 'moment'
export default {
  data() {
    return {
      showNewSet: false,
      oldPsw: '',
      newPsw: '',
      newPsw1: '',
      isLoging: false,
      isGoView: false,
      userOldPassword: ''
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: 'normal_login' })
  },
  computed: {
    ...mapGetters(['isLogin'])
  },
  methods: {
    ...mapMutations(['setUserInfo']),
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err && !this.isLoging) {
          if (values.oldPsw && values.newPsw && values.newPsw1) {
            if (this.userOldPassword != values.oldPsw ) {
              this.$message.error('旧密码不正确')
            } else if (values.newPsw != values.newPsw1) {
              this.$message.error('两次密码不一致,不允许提交')
            } else {
              this.isLoging = true
              sysUserUpdate(this.userId, values.newPsw1)
                .then(res => {
                  this.isLoging = false
                  if (res.code === 200) {
                    this.$message.success(res.msg)
                    this.showNewSet = false
                  } else {
                    this.$message.error(res.msg)
                  }
                })
                .catch(() => {
                  this.isLoging = false
                  this.$message.error('修改失败！')
                })
            }
          } else {
            this.isLoging = true
            loginUser(values.userName, values.password)
              .then(res => {
                sessionStorage.setItem('auto_token', res.autoToken)
                console.log(res.loginUser)
                if (!res.loginUser) {
                  this.$message.error('用户不存在或者密码错误！')
                  this.isLoging = false
                } else if (res.loginUser.status == 2) {
                  this.$message.error('该用户已禁用！')
                  this.isLoging = false
                } else if (!(/^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*]+$)[a-zA-Z\d!@#$%^&*]+$/).test(values.password)) {
                  this.$message.warning('密码过于简单，请修改密码！')
                  this.showNewSet = true
                  this.userId = res.loginUser.id
                  this.userOldPassword = values.password
                  this.isLoging = false
                } else {
                  this.isLoging = false
                  this.setUserInfo({...res,tel: values.userName, loginTime: moment().format('YYYY-MM-DD HH:mm:ss')})
                  sessionStorage.setItem('c1_x2_l', this.$CryptoJS.Encrypt(values.userName + values.password))
                  sessionStorage.setItem('userInfo', this.$CryptoJS.Encrypt(JSON.stringify({...res,tel: values.userName, loginTime: moment().format('YYYY-MM-DD HH:mm:ss')})))
                  let power = res.permissions || ''
                  routes.map(item => {
                    if (item.meta && item.meta.isFrame) {
                      item.children.some(item => {
                        if ((item.meta && item.meta.rule && power.indexOf(item.meta.rule) >= 0)) {
                          this.$router.push({name: item.name})
                          this.isGoView = true
                          return item
                        }
                      })
                    }
                  })
                  if (!this.isGoView) {
                    this.$message.warning('没有权限，请联系管理员！')
                  }
                }
              })
              .catch(() => {
                this.isLoging = false
              })
          }
        }
      })
    },
    closeSetPsw() {
      this.showNewSet = false
    }
  }
}
</script>

<style lang="scss" scoped>
.login {
  height: 100%;
  position: relative;
  background: url('~@/assets/bg.png') no-repeat;
  background-size: 100% 100%;
  .wrap {
    height: 400px;
    width: 650px;
    display: flex;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;
    background: url('~@/assets/item_bg.png') 0px -500px no-repeat;
    border-radius: 10px;
    .logo {
      width: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      background: #00000011;
      .title {
        display: flex;
        justify-content: center;
        align-items: flex-end;
        img {
          margin-right: 15px;
          width: 40px;
        }
        .text {
          height: 100%;
          font-weight: bold;
          color: #fff;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          margin: 0;
          i:nth-child(1) {
            line-height: 26px;
            font-family: '楷体';
            font-size: 28px;
          }
          i:nth-child(2) {
            font-size: 12px;
            display: flex;
            line-height: 11px;
            justify-content: space-between;
          }
        }
      }
      .sly_logo {
        margin-top: 15px;
        width: 180px;
      }
    }
    .main {
      width: 50%;
      padding: 50px;
      background: #ffffffbd;
      border-radius: 0 10px 10px 0;
    }
  }
  .m {
    height: 100%;
    width: 100%;
    background: rgba(0,0,0,.4);
  }
}
#components-form-demo-normal-login {
  .login-form-button {
    width: 100%;
  }
}
/deep/ .login-form-input {
  .ant-input {
    border: none;
    border-bottom: 1px solid #cecece;
    border-radius: 0;
    background: #00000000;
    font-weight: bold;
  }
  input::-webkit-input-placeholder {
    color: rgba(0,0,0,.45);
    font-weight: normal;
  }
  .ant-input:focus {
    box-shadow: none !important;
  }
}
#components-form-demo-normal-login {
  .login-form-title {
    display: flex;
    flex-direction: column;
    font-size: 20px;
    span {
      line-height: 42px;
      font-weight: bold;
    }
    i {
      font-size: 12px;
      color: #777;
      font-weight: bold;
      line-height: 20px;
      margin-bottom: 12px;
    }
  }
}
</style>