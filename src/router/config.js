import TabsView from '@/layouts/tabs/TabsView'
// import PageView from '@/layouts/PageView'
import BlankView from '@/layouts/BlankView'

// 路由配置
const options = {
  routes: [
    {
      path: '/login',
      name: '登录页',
      component: () => import('@/pages/login')
    },
    {
      path: '*',
      name: '404',
      component: () => import('@/pages/exception/404'),
    },
    {
      path: '/403',
      name: '403',
      component: () => import('@/pages/exception/403'),
    },
    {
      path: '/',
      component: TabsView,
      redirect: '/login',
      children: [
        {
          path: 'welcome',
          name: '欢迎页',
          meta: {
            icon: 'dashboard',
            page: {
              closable: false
            }
          },
          component: () => import('@/pages/welcome/Welcome'),
        },
        {
          path: 'user',
          name: '用户管理',
          meta: {
            invisible: true
          },
          component: BlankView,
          children: [
            {
              path: 'showUser',
              name: '个人中心',

              component: () => import('@/pages/user/ShowUser')
            },
            {
              path: 'setUser',
              name: '账号设置',
              component: () => import('@/pages/user/SetUser')
            }
          ]
        },
        {
          path: 'goods',
          name: '商品管理',
          meta: {
            icon: 'gift'
          },
          component: BlankView,
          children: [
            {
              path: 'product',
              name: '商品信息',
              component: () => import('@/pages/goods/Product')
            },
            {
              path: 'color',
              name: '颜色管理',
              component: () => import('@/pages/goods/Color')
            },
            {
              path: 'size',
              name: '规格管理',
              component: () => import('@/pages/goods/Size')
            },
            {
              path: 'category',
              name: '类别管理',
              component: () => import('@/pages/goods/Category')
            }
          ]
        },
        {
          path: 'orders',
          name: '订单管理',
          meta: {
            icon: 'menu'
          },
          component: BlankView,
          children: [
            {
              path: 'unpay',
              name: '未付款',
              component: () => import('@/pages/orders/Unpay')
            },
            {
              path: 'unorder',
              name: '未发货',
              component: () => import('@/pages/orders/Unorder')
            },
            {
              path: 'ordered',
              name: '已发货',
              component: () => import('@/pages/orders/Ordered')
            },
            {
              path: 'completed',
              name: '已完成',
              component: () => import('@/pages/orders/Completed')
            },
            {
              path: 'unrefund',
              name: '待退款',
              component: () => import('@/pages/orders/Unrefund')
            },
            {
              path: 'refunded',
              name: '已退款',
              component: () => import('@/pages/orders/Refunded')
            },
            {
              path: 'recharge',
              name: '充值订单',
              component: () => import('@/pages/orders/Recharge')
            },
          ]
        },
        {
          path: 'rebate',
          name: '奖励申请',
          meta: {
            icon: 'money-collect'
          },
          component: BlankView,
          children: [
            {
              path: 'Unrebate',
              name: '未申请',
              component: () => import('@/pages/rebate/Unrebate')
            },
            {
              path: 'Rebating',
              name: '申请中',
              component: () => import('@/pages/rebate/Rebating')
            },
            {
              path: 'Rebated',
              name: '已发放',
              component: () => import('@/pages/rebate/Rebated')
            },
          ]
        },
        {
          path: 'setting',
          name: '通用设置',
          meta: {
            icon: 'tool'
          },
          component: () => import('@/pages/setting/Setting')
        },
      ]
    },
  ],
  mode: "history"
}

export default options
