import { createRouter, createWebHashHistory } from 'vue-router'

import Layout from '@/views/layout/index'

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    hidden: true,
    redirect: '/home',
    children: [
      {
        path: 'home',
        component: () => import('@/views/home/index')
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'user',
        component: () => import('@/views/user/index')
      },
      {
        path: 'role',
        component: () => import('@/views/role/index')
      },
      {
        path: 'userTag',
        component: () => import('@/views/userTag/index')
      }
    ]
  },
  {
    path: '/paper',
    component: Layout,
    redirect: '/paper/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/paper/index')
      },
      {
        path: 'edit',
        component: () => import('@/views/paper/edit')
      },
    ]
  },
  {
    path: '/publishPaper',
    component: Layout,
    redirect: '/publishPaper/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/publishPaper/index'),
      },
      {
        path: 'examination',
        component: () => import('@/views/publishPaper/examination'),
      },
    ]
  },
  {
    path: '/exam',
    component: Layout,
    redirect: '/exam/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/exam/index'),
      }
    ]
  },
  {
    path: '/score',
    component: Layout,
    redirect: '/score/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/score/index'),
      }
    ]
  },
  {
    path: '/statisticScore',
    component: Layout,
    redirect: '/statisticScore/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/statisticScore/index'),
      }
    ]
  },
  

  {
    path: '/info',
    component: () => import('@/views/public/paperInfo'),
    hidden: true
  },
  {
    path: '/examInfo',
    component: () => import('@/views/publishPaper/examInfo'),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes
})


export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
