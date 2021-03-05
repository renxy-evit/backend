// 视图组件
const view = {
  tabs: () => import('@/layouts/tabs'),
  blank: () => import('@/layouts/BlankView'),
  page: () => import('@/layouts/PageView')
}

// 路由组件注册
const routerMap = {
  login: {
    authority: '*',
    path: '/login',
    component: () => import('@/pages/login')
  },
  root: {
    path: '/',
    redirect: '/login',
    component: view.tabs
  },
  Welcome: {
    name: '欢迎页',
    component: () => import('@/pages/welcome/Welcome')
  },
  User: {
    name: '用户管理',
    component: () => import('@/pages/User')
  },
  goods: {
    name: '商品管理',
    component: view.page
  },
  product: {
    name: '商品信息管理',
    component: () => import('@/pages/goods/Product')
  },
  color: {
    name: '颜色管理',
    component: () => ('@/pages/goods/Color')
  },
  size: {
    name: '规格管理',
    component: () => ('@/pages/goods/Size')
  },
  orders: {
    name: '订单管理',
    component: view.page
  },
  unpay: {
    name: '未付款',
    component: () => import('@/pages/orders/Unpay')
  },
  unorder: {
    name: '未发货',
    component: () => import('@/pages/orders/Unorder')
  },
  ordered: {
    name: '未发货',
    component: () => import('@/pages/orders/Ordered')
  },
  completed: {
    name: '未发货',
    component: () => import('@/pages/orders/Completed')
  },
  unrefund: {
    name: '未发货',
    component: () => import('@/pages/orders/Unrefund')
  },
  refunded: {
    name: '未发货',
    component: () => import('@/pages/orders/Refunded')
  },
  recharge: {
    name: '未发货',
    component: () => import('@/pages/orders/Recharge')
  },
  admin: {
    name: '账号管理',
    component: () => import('@/pages/admin/Admin')
  },
  setting: {
    name: '通用设置',
    component: () => import('@/pages/setting/Setting')
  },
  exp403: {
    authority: '*',
    name: 'exp403',
    path: '403',
    component: () => import('@/pages/exception/403')
  },
  exp404: {
    name: 'exp404',
    path: '404',
    component: () => import('@/pages/exception/404')
  },
  exp500: {
    name: 'exp500',
    path: '500',
    component: () => import('@/pages/exception/500')
  },
  // form: {
  //   name: '表单页',
  //   icon: 'form',
  //   component: view.page
  // },
  // basicForm: {
  //   path: 'basic',
  //   name: '基础表单',
  //   component: () => import('@/pages/form/basic')
  // },
  // stepForm: {
  //   path: 'step',
  //   name: '分步表单',
  //   component: () => import('@/pages/form/step')
  // },
  // advanceForm: {
  //   path: 'advance',
  //   name: '高级表单',
  //   component: () => import('@/pages/form/advance')
  // },
  // list: {
  //   name: '列表页',
  //   icon: 'table',
  //   component: view.page
  // },
  // queryList: {
  //   path: 'query',
  //   name: '查询表格',
  //   component: () => import('@/pages/list/QueryList')
  // },
  // primaryList: {
  //   path: 'primary',
  //   name: '标准列表',
  //   component: () => import('@/pages/list/StandardList')
  // },
  // cardList: {
  //   path: 'card',
  //   name: '卡片列表',
  //   component: () => import('@/pages/list/CardList')
  // },
  // searchList: {
  //   path: 'search',
  //   name: '搜索列表',
  //   component: () => import('@/pages/list/search/SearchLayout')
  // },
  // article: {
  //   name: '文章',
  //   component: () => import('@/pages/list/search/ArticleList')
  // },
  // application: {
  //   name: '应用',
  //   component: () => import('@/pages/list/search/ApplicationList')
  // },
  // project: {
  //   name: '项目',
  //   component: () => import('@/pages/list/search/ProjectList')
  // },
  // details: {
  //   name: '详情页',
  //   icon: 'profile',
  //   component: view.blank
  // },
  // basicDetails: {
  //   path: 'basic',
  //   name: '基础详情页',
  //   component: () => import('@/pages/detail/BasicDetail')
  // },
  // advanceDetails: {
  //   path: 'advance',
  //   name: '高级详情页',
  //   component: () => import('@/pages/detail/AdvancedDetail')
  // },
  // result: {
  //   name: '结果页',
  //   icon: 'check-circle-o',
  //   component: view.page
  // },
  // success: {
  //   name: '成功',
  //   component: () => import('@/pages/result/Success')
  // },
  // error: {
  //   name: '失败',
  //   component: () => import('@/pages/result/Error')
  // },
  // exception: {
  //   name: '异常页',
  //   icon: 'warning',
  //   component: view.blank
  // },
  // 
  // components: {
  //   name: '小组件',
  //   icon: 'appstore-o',
  //   component: view.page
  // },
  // taskCard: {
  //   name: '任务卡片',
  //   component: () => import('@/pages/components/TaskCard')
  // },
  // palette: {
  //   name: '颜色复选框',
  //   component: () => import('@/pages/components/Palette')
  // }
}
export default routerMap

