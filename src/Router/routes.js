const Login = () => import(/* webpackChunkName: "Login" */ '@/View/Login')
const Frame = () => import(/* webpackChunkName: "Frame" */ '@/View/Frame')
// 系统管理
const role = () => import(/* webpackChunkName: "role" */ '@/View/Frame/System/role')
const user = () => import(/* webpackChunkName: "user" */ '@/View/Frame/System/user')
// 配置管理
const banner = () => import(/* webpackChunkName: "banner" */ '@/View/Frame/WebConfig/banner')
// 商品管理
const shopType = () => import(/* webpackChunkName: "shopType" */ '@/View/Frame/Shop/shopType')
const shopList = () => import(/* webpackChunkName: "shopList" */ '@/View/Frame/Shop/shopList')
const additional = () => import(/* webpackChunkName: "additional" */ '@/View/Frame/Shop/additional')
// 订单管理
const orderList = () => import(/* webpackChunkName: "orderList" */ '@/View/Frame/Order/orderList')
const orderDetails = () => import(/* webpackChunkName: "orderDetails" */ '@/View/Frame/Order/orderDetails')
const afterSale = () => import(/* webpackChunkName: "afterSale" */ '@/View/Frame/Order/afterSale')

const Error = () => import(/* webpackChunkName: "404" */ '@/View/404')
// ruleArr: Array
// >> 父级的权限集合
// showBack: Boolean
// >> 显示返回按钮
export default [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      rule: false
    },
    components: {
      default: Login
    }
  },
  {
    path: '/frame',
    component: Frame,
    meta: {
      isFrame: true
    },
    children: [
      {
        path: 'rolesetup/role',
        name: 'rolesetup/role',
        meta: {
          title: '角色设置',
          rule: '#y1$x2$j1#',
        },
        component: role
      },
      {
        path: 'rolesetup/user',
        name: 'rolesetup/user',
        meta: {
          title: '人员设置',
          rule: '#y1$x2$r3#',
        },
        component: user
      },
      {
        path: 'config/banner',
        name: 'config/banner',
        meta: {
          title: 'banner管理',
          rule: '#y1$p3$b1#',
        },
        component: banner
      },
      {
        path: 'shop/type',
        name: 'shop/type',
        meta: {
          title: '商品类型',
          rule: '#y1$s5$s1#',
        },
        component: shopType
      },
      {
        path: 'shop/additional',
        name: 'shop/additional',
        meta: {
          title: '附加服务',
          rule: '#y1$s5$f3#',
        },
        component: additional
      },
      {
        path: 'shop/list',
        name: 'shop/list',
        meta: {
          title: '商品列表',
          rule: '#y1$s5$s2#',
        },
        component: shopList
      },
      {
        path: 'order/list',
        name: 'order/list',
        meta: {
          title: '订单列表',
          rule: '#y1$s5$d1$c1#',
        },
        component: orderList
      },
      {
        path: 'order/list/details',
        name: 'order/list/details',
        meta: {
          title: '订单详情',
          rule: '#y1$s5$d1$c1#',
          showBack: true
        },
        component: orderDetails
      },
      {
        path: 'order/after-sale',
        name: 'order/after-sale',
        meta: {
          title: '售后管理',
          rule: '#xxxxx#',
        },
        component: afterSale
      },
      {
        path: ':id',
        redirect: '/404',
        meta: {
          isRedirect: true
        }
      }
    ]
  },
  {
    path: '/404',
    name: '404',
    meta: {
      rule: false
    },
    components: {
      default: Error
    }
  },
  {
    path: '/:id',
    redirect: '/404'
  }
]