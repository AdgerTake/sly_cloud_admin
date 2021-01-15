// 导航菜单配置
// Hierarchy值为'b'时: 标记本身为第二级并且存在下属第三级
export default [
  {
    path: 'rolesetup',
    title: '系统管理',
    icon: 'setting',
    rule: '#y1$x2#',
    childrenItem: [{
      path:'rolesetup/role',
      title: '角色设置',
      icon: 'usergroup-add',
      rule: '#y1$x2$j1#',
    },{
      path:'rolesetup/user',
      title: '人员设置',
      icon: 'solution',
      rule: '#y1$x2$r3#',
    }]
  },
  {
    path: 'config',
    title: '配置管理',
    icon: 'rocket',
    rule: '#y1$p3#',
    childrenItem: [{
      path:'config/banner',
      title: 'banner管理',
      icon: 'table',
      rule: '#y1$p3$b1#'
    }]
  },
  {
    path: 'shop',
    title: '商品管理',
    icon: 'shop',
    rule: '#y1$s5#',
    childrenItem: [{
      path:'shop/type',
      title: '商品类型',
      icon: 'shopping',
      rule: '#y1$s5$s1#'
    },{
      path:'shop/additional',
      title: '附加服务',
      icon: 'file-add',
      rule: '#y1$s5$f3#'
    }, {
      path:'shop/list',
      title: '商品列表',
      icon: 'skin',
      rule: '#y1$s5$s2#'
    }]
  },
  {
    path: 'order',
    title: '订单管理',
    icon: 'reconciliation',
    rule: '#y1$d6#',
    childrenItem: [{
      path:'order/list',
      title: '订单列表',
      icon: 'diff',
      rule: '#y1$s5$d1#'
    }, {
      path:'order/after-sale',
      title: '售后管理',
      icon: 'project',
      rule: '#xxxx#'
    }]
  },
  {
    path:'share',
    title: '分享记录',
    icon: 'share-alt',
    rule: '#xxxx#'
  },
]