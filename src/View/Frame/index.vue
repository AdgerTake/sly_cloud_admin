<template>
  <a-layout id="components-layout-demo-custom-trigger">
    <a-layout-sider collapsible v-model="collapsed" style=" max-width: 220px;
    min-width: 220px;
    width: 220px;
    overflow: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
    ">
      <div class="logo" />
      <a-menu
        theme="dark"
        mode="inline"
        :selectedKeys="[$route.name.split('/')[0], $route.name.split('/')[0]+'/'+$route.name.split('/')[1]]"
        :inline-collapsed="collapsed"
        :defaultOpenKeys="[$route.name.split('/')[0]]"
      >
        <template v-for="item in itemChild">
          <a-menu-item v-if="!(item.childrenItem && item.childrenItem.length)" v-show="selMenuItem(item.rule)" :key="item.path" @click="goPage(item)">
            <a-icon :type="item.icon" />
            <span>{{item.title}}</span>
          </a-menu-item>
          <a-sub-menu v-if="item.childrenItem && item.childrenItem.length" v-show="selMenuItem(item.rule)" :key="item.path">
            <span slot="title"><a-icon :type="item.icon" /><span>{{item.title}}</span></span>
            <a-menu-item v-for="citem in item.childrenItem" v-show="selMenuItem(citem.rule)" :key="citem.path" @click="goPage(citem)">
              <a-icon :type="citem.icon" />
              <span>{{citem.title}}</span>
            </a-menu-item>
          </a-sub-menu>
        </template>
      </a-menu>
    </a-layout-sider>
    <a-layout class="z">
      <a-layout-header style="background: #fff; padding: 0; display: flex; justify-content: space-between;min-width: 932px;">
        <div class="user-name">
          <span style="margin-left: 20px; margin-right: 20px">欢迎你：<a-icon type="user" /> {{userInfo.loginUser.name}}</span>
          <span>登录时间：{{userInfo.loginTime}}</span>
        </div>
        <div class="pwd-out" style="margin-right: 24px;">
          <span>
            <a-icon type="setting" style="margin: 0 5px 0 0;"/>
            <span @click="changePrint"><a href="javascript:;">打印设置</a></span>
            </span>
          <span>
            <a-icon type="lock" style="margin: 0 5px 0 30px;"/>
            <span @click="changePsw"><a href="javascript:;">修改密码</a></span>
            </span>
          <span>
            <a-icon type="poweroff" style="margin: 0 5px 0 30px;"/>
            <span @click="outLogin"><a href="javascript:;">退出登录</a></span>
            </span>
        </div>
      </a-layout-header>
      <a-layout-content
        :style="{ margin: '24px 16px', background: '#fff', minWidth: '900px' }"
      >
        <div class="title">
          <a-menu
            mode="horizontal"
            v-model="pageTitle"
            v-if="pageItme.path"
            :style="{
              fontWeight: 'bold',
              fontSize: '18px',
              width: '100%'
            }"
          >
            <a-menu-item
              v-for="item in pageItme.childrenItem"
              :key="item.rule"
              @click="goPageTwo(item)"
            >
              {{item.title}}
            </a-menu-item>
          </a-menu>
          <a-menu
            mode="horizontal"
            v-model="pageTitle"
            :style="{
              fontWeight: 'bold',
              fontSize: '18px',
              width: '100%',
              position: 'relative'
            }"
            v-else
          >
            <a-menu-item
              key="default"
            >
              {{pageName}}
            </a-menu-item>
          </a-menu>
          <a-button type="primary"
            v-show="$route.meta.showBack"
            style="position: absolute;right:30px;"
            @click="goBack">
            <a-icon type="left" />
            返回</a-button>
        </div>
        <router-view></router-view>
      </a-layout-content>
      <a-drawer
        title="修改密码"
        placement="right"
        :closable="true"
        :width="300"
        :visible="visible"
        @close="onClose"
      >
        <i style="color: #ee0000;font-size:12px;margin-bottom: 20px;display: block;" >新密码为6~16位并至少包含字母，数字或特殊字符任意两种。</i>
        <a-form
          :form="form"
          class="login-form"
          @submit="handleSubmit"
        >
            <a-form-item>
              <a-input
                class="login-form-input"
                v-decorator="[
                  'newPsw',
                  { rules: [{ required: true, message: '密码不符合校验规则!', pattern: /^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*]+$)[a-zA-Z\d!@#$%^&*]{6,16}$/ }] },
                ]"
                placeholder="新密码"
                type="password"
                autocomplete="off"
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
                autocomplete="off"
                type="password"
              >
                <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.6)" />
              </a-input>
            </a-form-item>
            <a-form-item
            >
              <a-button-group style="width:100%">
                <a-button type="primary" html-type="submit" class="login-form-button" style="width:50%">
                  确认
                </a-button>
                <a-button @click="onClose" class="login-form-button" style="width:50%">
                  取消
                </a-button>
              </a-button-group>
            </a-form-item>
        </a-form>
      </a-drawer>
      <a-drawer
        title="打印设置"
        placement="right"
        :closable="true"
        :width="300"
        :visible="printVisible"
        @close="closePrintName"
      >
        <div class="print-drawer">
          <p>水洗码打印机设置</p>
          <a-select v-model="printName" style="min-width: 200px;">
            <a-select-option v-for="item in printArr" :key="item">
              {{item}}
            </a-select-option>
          </a-select>
          <a-button type="primary" @click="sevaPrintName">
            确认
          </a-button>
        </div>
      </a-drawer>
    </a-layout>
  </a-layout>
</template>
<script>
import menuList from '@/Router/menuList'
import { mapState, mapMutations } from 'vuex'
import { sysUserUpdate } from '@/https'
  export default {
    data() {
      return {
        collapsed: false,
        itemChild: [],
        visible: false,
        form: this.$form.createForm(this),
        pageTitle: ['default'],
        pageItme: {},
        printVisible: false,
        printArr: [],
        printName: ''
      }
    },
    computed: {
      ...mapState(['pageName', 'userInfo']),
    },
    created() {
      this.printName = localStorage.getItem('printName')
      window.PAZU.TPrinter.getPrinters((res) => {
        this.printArr = res.split("\r\n")
      })
      this.itemChild = menuList
      if (this.$route.meta.ruleArr && this.$route.meta.ruleArr.length === 2) {
        let [pArr, sArr] = [JSON.parse(JSON.stringify(this.itemChild.filter(item => item.rule === this.$route.meta.ruleArr[0])[0])), []]
        sArr = pArr.childrenItem.filter(item => item.rule === this.$route.meta.ruleArr[1])[0]
        sArr.childrenItem = sArr.childrenItem.filter(item => this.selMenuItem(item.rule))
        this.pageItme = sArr
        this.pageTitle[0] = this.$route.meta.rule
      } else {
        this.setpageName(this.$route.meta.title)
        this.pageTitle[0] = 'default'
      }
    },
    methods: {
      ...mapMutations(['setpageName']),
      goPage(citem) {
        console.log("%c菜单信息","background: #da00ff;color:#fff;line-height: 16px;border-radius: 3px;padding: 0 5px;text-align: center;", citem)
        citem.Hierarchy === 'b'?
        (() => {
          citem.childrenItem = citem.childrenItem.filter(item => this.selMenuItem(item.rule))
          this.pageItme = citem
          this.pageTitle[0] = citem.childrenItem[0].rule
          this.$route.path != '/frame/'+citem.childrenItem[0].path?
          this.$router.push('/frame/'+citem.childrenItem[0].path)
          :
          ''
        })()
        :
        (() => {
          this.pageItme = {}
          this.setpageName(citem.title)
          this.pageTitle[0] = 'default'
          this.$route.path != '/frame/'+citem.path?
          this.$router.push('/frame/'+citem.path)
          :
          ''
        })()
      },
      goPageTwo(item) {
        this.pageTitle[0] = item.rule
        this.$route.name == item.path?
        ''
        :
        this.$router.push('/frame/'+item.path)
      },
      selMenuItem(n) {
        return this.userInfo.permissions.indexOf(n) >= 0
      },
      outLogin () {
        sessionStorage.clear()
        this.$router.push('/')
      },
      changePsw () {
        this.visible = true
      },
      onClose() {
        this.visible = false
        this.form.resetFields()
      },
      handleSubmit(e) {
        e.preventDefault()
        this.form.validateFields((err, values) => {
          if (!err) {
            if (values.newPsw && values.newPsw1) {
              if (values.newPsw != values.newPsw1) {
                this.$message.error('两次密码不一致,不允许提交')
              } else {
                sysUserUpdate(this.userInfo.loginUser.id, values.newPsw1)
                  .then(res => {
                    if (res.code === 200) {
                      this.visible = false
                      this.form.resetFields()
                      setTimeout(() => {
                        this.$message.success(res.msg)
                      }, 600)
                      this.outLogin()
                    } else {
                      this.$message.error(res.msg)
                    }
                  })
                  .catch(() => {
                    this.$message.error('修改失败！')
                  })
              }
            }
          }
        })
      },
      goBack() {
        this.$router.go(-1)
      },
      changePrint() {
        this.printVisible = true
      },
      sevaPrintName() {
        localStorage.setItem('printName', this.printName)
        this.printVisible = false
      },
      closePrintName() {
        this.printName = localStorage.getItem('printName')
        this.printVisible = false
      }
    },
    beforeRouteUpdate(to, from, next){
      if (to.meta.ruleArr && to.meta.ruleArr.length === 2) {
        let [pArr, sArr] = [JSON.parse(JSON.stringify(this.itemChild.filter(item => item.rule === to.meta.ruleArr[0])[0])), []]
        sArr = pArr.childrenItem.filter(item => item.rule === to.meta.ruleArr[1])[0]
        sArr.childrenItem = sArr.childrenItem.filter(item => this.selMenuItem(item.rule))
        this.pageItme = sArr
        this.pageTitle[0] = to.meta.rule
      } else {
        this.setpageName(to.meta.title)
        this.pageTitle[0] = 'default'
      }
      next()
    }
  }
</script>
<style lang="scss">
#components-layout-demo-custom-trigger {
  height: 100%;
  .ant-layout-sider-trigger {
    width: 220px !important;
  }
  .ant-layout-sider-collapsed {
    max-width: 80px !important;
    min-width: 80px !important;
    width: 80px !important;
    .ant-layout-sider-trigger {
      width: 80px !important;
    }
  }
  .ant-layout-sider-children {
    height: auto;
  }
}
  #components-layout-demo-custom-trigger .trigger {
    font-size: 18px;
    line-height: 64px;
    padding: 0 24px;
    cursor: pointer;
    transition: color 0.3s;
  }

  #components-layout-demo-custom-trigger .trigger:hover {
    color: #1890ff;
  }
  #components-layout-demo-custom-trigger .logo {
    height: 32px;
    background: url(~@/assets/title.png) no-repeat left center;
    // background: #002140;
    background-size: auto 100%;
    margin: 16px;
  }
  #components-layout-demo-custom-trigger .ant-layout-content {
    min-height: auto;
  }
  #components-layout-demo-custom-trigger .ant-layout-sider::-webkit-scrollbar {
    width: 0;
  }
  .ant-layout {
    overflow-x: auto !important;
  }
  .user-name {
    font-weight: bold;
  }
  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
  }
  .pwd-out {
    a {
      color: #333;
    }
    a:hover {
      color: #40a9ff;
    }
  }
  .print-drawer {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    button {
      margin-top: 15px;
    }
  }
</style>