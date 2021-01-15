import Vue from 'vue'
import App from './App.vue'
import router from './Router'
// import routes from './Router/routes'
import store from './store'
import 'ant-design-vue/dist/antd.less'
import { Skeleton, Descriptions, List, Tabs, Radio, Tag, Collapse, Tree, Breadcrumb, Spin, Progress, Alert, Tooltip, Button, Form, Drawer, Upload, Input, Select, Icon, Checkbox, Menu, Layout, Table, DatePicker, ConfigProvider, Pagination, Card, message, Modal, InputNumber } from 'ant-design-vue'
import XLSX from 'xlsx'
import CryptoJS from './CryptoJS'
import moment from 'moment'
import md5 from 'js-md5'
import qrcode from 'qrcode'
import './lib/pazuclient'
import './lib/pazucloud'

/**
 * @function 生成表格的方法
 * @param {String} excelName 文件名
 * @param {Array} titleArr 数据表头显示
 * @param {Array} dataArr 数据内容显示
 */
const ToDoExcel = (excelName, titleArr, dataArr) => {
  var filename = excelName + ".xlsx" //文件名称
  var data = [titleArr, ...dataArr]  //数据，一定注意需要时二维数组
  var ws_name = "Sheet1" //Excel第一个sheet的名称
  var wb = XLSX.utils.book_new(), ws = XLSX.utils.aoa_to_sheet(data)
  XLSX.utils.book_append_sheet(wb, ws, ws_name)  //将数据添加到工作薄
  XLSX.writeFile(wb, filename)
}
/**
 * @function 脱敏手机号的方法
 * @param {String} mobile 手机号
 * @return {String}
 */
function tmMobile(mobile) {
  let n = Number(mobile)
  return n && n.toString().length == 11?
  n.toString().slice(0, 3) + '****' + n.toString().slice(7, 11)
  :
  mobile
}
/**
 * @function 验证权限的方法
 * @param {String} rule 手机号
 * @return {Boolean}
 */
function getRule(n) {
  return store.state.userInfo.permissions.indexOf(n) >= 0
}

Vue.prototype.$ToDoExcel = ToDoExcel
Vue.prototype.$getRule = getRule
Vue.prototype.$message = message
Vue.prototype.$confirm = Modal.confirm
Vue.prototype.$CryptoJS = CryptoJS
Vue.prototype.$moment = moment
Vue.prototype.$md5 = md5
Vue.prototype.$tmMobile = tmMobile
Vue.prototype.$QRcode = qrcode
Vue.use(InputNumber)
Vue.use(List)
Vue.use(Tabs)
Vue.use(Descriptions)
Vue.use(Skeleton)
Vue.use(Radio)
Vue.use(Tag)
Vue.use(Collapse)
Vue.use(Tree)
Vue.use(Breadcrumb)
Vue.use(Spin)
Vue.use(Progress)
Vue.use(Alert)
Vue.use(Modal)
Vue.use(Tooltip)
Vue.use(Button)
Vue.use(Upload)
Vue.use(Select)
Vue.use(Drawer)
Vue.use(Form)
Vue.use(Input)
Vue.use(Icon)
Vue.use(Checkbox)
Vue.use(Menu)
Vue.use(Layout)
Vue.use(Table)
Vue.use(DatePicker)
Vue.use(ConfigProvider)
Vue.use(Pagination)
Vue.use(Card)
Vue.config.productionTip = false
router.beforeEach((to, from, next) => {
  let isLogin = Boolean(sessionStorage.getItem('userInfo'))
  if (!to.meta.rule && (to.name == '404' || to.name == 'login')) {
    next()
  } else if (isLogin && to.meta.rule){
    let powers = JSON.parse(CryptoJS.Decrypt(sessionStorage.getItem('userInfo'))).permissions
    if (powers.indexOf(to.meta.rule) >= 0) {
      next()
    } else {
      next('/404')
    }
  } else if (!isLogin) {
    next('/')
  } else {
    next('/404')
  }
})

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app')
