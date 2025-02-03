import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

import AuthLayout from '../layouts/AuthLayout.vue'
import AdminLayout from '../layouts/AdminLayout.vue'
import EvaluatorsLayout from '../layouts/EvaluatorsLayout.vue'

import RouteViewComponent from '../layouts/RouterBypass.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/:pathMatch(.*)*',
    redirect: { name: '404' },
  },
  // Admin Routes
  {
    name: 'admin',
    path: '/',
    component: AdminLayout,
    redirect: { name: 'login' },
    children: [
      {
        name: 'dashboard',
        path: 'dashboard',
        component: () => import('../pages/admin/dashboard/Dashboard.vue'),
      },
      {
        name: 'proponents',
        path: 'proponents',
        component: () => import('../pages/admin/proponents/ProponentsPage.vue'),
      },
      {
        name: 'manage-requests',
        path: 'manage-requests',
        component: () => import('../pages/admin/manage-request/ManageRequestPage.vue'),
      },
      {
        name: 'certificates',
        path: 'certificates',
        component: () => import('../pages/admin/certificate/CertificatePage.vue'),
      },
      {
        name: 'department',
        path: 'department',
        component: () => import('../pages/admin/department/DepartmentPage.vue'),
      },
      {
        name: 'user-account',
        path: 'user-account',
        component: () => import('../pages/admin/user-account/UserAccountPage.vue'),
      },

      {
        name: 'settings',
        path: 'settings',
        component: () => import('../pages/settings/Settings.vue'),
      },
      {
        name: 'preferences',
        path: 'preferences',
        component: () => import('../pages/preferences/Preferences.vue'),
      },
      {
        name: 'users',
        path: 'users',
        component: () => import('../pages/users/UsersPage.vue'),
      },
    ],
  },

  // Evaluator Routes
  {
    name: 'evaluator',
    path: '/',
    component: EvaluatorsLayout,
    redirect: { name: 'login' },
    children: [
      {
        name: 'evaluation',
        path: 'evaluation',
        component: () => import('../pages/evaluator/evaluation/EvaluationPage.vue'),
      },
    ],
  },

  // Auth Routes
  {
    path: '/auth',
    component: AuthLayout,
    children: [
      {
        name: 'login',
        path: 'login',
        component: () => import('../pages/auth/Login.vue'),
      },
      {
        name: 'signup',
        path: 'main-information-signup',
        component: () => import('../pages/auth/MainInformationSignup.vue'),
      },
      {
        name: 'next-signup',
        path: 'other-information-signup',
        component: () => import('../pages/auth/OtherInformationSignup.vue'),
      },
      {
        name: 'recover-password',
        path: 'recover-password',
        component: () => import('../pages/auth/RecoverPassword.vue'),
      },
      {
        name: 'recover-password-email',
        path: 'recover-password-email',
        component: () => import('../pages/auth/CheckTheEmail.vue'),
      },
      {
        path: '',
        redirect: { name: 'login' },
      },
    ],
  },

  {
    name: '404',
    path: '/404',
    component: () => import('../pages/404.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }

    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    } else {
      window.scrollTo(0, 0)
    }
  },
  routes,
})

export default router
