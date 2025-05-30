import { createRouter, createWebHistory } from 'vue-router'
import AuthLayout from '../layouts/AuthLayout.vue'
import AdminLayout from '../layouts/AdminLayout.vue'
import EvaluatorsLayout from '../layouts/EvaluatorsLayout.vue'
import ProponentLayout from '../layouts/ProponentsLayout.vue'
import { useJwtStore } from '../stores/jwtHandler'

function getUserRole() {
  const jwtStore = useJwtStore()
  return jwtStore.getUserRole
}

function IsTokenExpired() {
  const jwtStore = useJwtStore()
  const token = jwtStore.getToken
  if (!token) {
    return true
  }

  const decodedToken = jwtStore.getDecodedToken
  if (!decodedToken) {
    return true
  }

  const currentTime = Math.floor(Date.now() / 1000)
  return decodedToken.exp < currentTime
}

const routes = [
  {
    path: '/:pathMatch(.*)*',
    redirect: { name: '404' },
  },

  /* Admin Route */
  {
    name: 'admin',
    path: '/',
    component: AdminLayout,
    redirect: { name: 'login' },
    meta: { requiresAuth: true, role: 'admin' },
    children: [
      {
        name: 'proponents',
        path: 'proponents',
        component: () => import('../pages/admin/proponents/AdminProponentsPage.vue'),
      },
      {
        name: 'manage-requests',
        path: 'manage-requests',
        component: () => import('../pages/admin/manage-request/AdminManageRequestPage.vue'),
      },
      {
        name: 'certificates',
        path: 'certificates',
        component: () => import('../pages/admin/certificate/AdminCertificatePage.vue'),
      },
      {
        name: 'department',
        path: 'department',
        component: () => import('../pages/admin/department/AdminDepartmentPage.vue'),
      },
      {
        name: 'evaluators',
        path: 'evaluators',
        component: () => import('../pages/admin/evaluator/AdminEvaluatorPage.vue'),
      },
      {
        name: 'office',
        path: 'office',
        component: () => import('../pages/admin/office/AdminOfficePage.vue'),
      },
      {
        name: 'campus',
        path: 'campus',
        component: () => import('../pages/admin/campus/AdminCampusPage.vue'),
      },
      {
        name: 'admins',
        path: 'admins',
        component: () => import('../pages/admin/admin/AdminManagement.vue'),
      },
      {
        name: 'user-account',
        path: 'user-account',
        component: () => import('../pages/admin/user-account/AdminUserAccountPage.vue'),
      },
    ],
  },

  /* Evaluator Route */
  {
    name: 'evaluator',
    path: '/',
    component: EvaluatorsLayout,
    redirect: { name: 'login' },
    meta: { requiresAuth: true, role: 'evaluator' },
    children: [
      {
        name: 'evaluation',
        path: 'evaluation',
        component: () => import('../pages/evaluator/evaluation/EvaluatorEvaluationPage.vue'),
      },
      {
        name: 'evaluator-user-account',
        path: 'evaluator-user-account',
        component: () => import('../pages/evaluator/user-account/EvaluatorUserAccountPage.vue'),
      },
    ],
  },

  /* Evaluator Route */
  {
    name: 'proponent',
    path: '/',
    component: ProponentLayout,
    redirect: { name: 'login' },
    meta: { requiresAuth: true, role: 'proponent' },
    children: [
      {
        name: 'proponent-request',
        path: 'proponent-request',
        component: () => import('../pages/proponents/manage-proponent-request/ProponentManageRequestPage.vue'),
      },
      {
        name: 'proponent-issued-certificates',
        path: 'proponent-issued-certificates',
        component: () => import('../pages/proponents/issued-certificate/ProponentIssuedCertificatePage.vue'),
      },
      {
        name: 'proponent-user-account',
        path: 'proponent-user-account',
        component: () => import('../pages/proponents/user-account/ProponentUserAccountPage.vue'),
      },
      {
        name: 'proponent-create-document-for-evaluation',
        path: 'proponent-create-document-for-evaluation',
        component: () =>
          import(
            '../pages/proponents/manage-proponent-request/create-document-for-evaluation/ProponentCreateDocumentForEvaluation.vue'
          ),
      },
    ],
  },

  /* Authentication Route */
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

/* Authentication Guard */
router.beforeEach((to, from, next) => {
  const userRole = getUserRole()
  if (to.meta.requiresAuth) {
    if (!userRole) {
      return next({ name: 'login' })
    }

    if (IsTokenExpired()) {
      return next({ name: 'login' })
    }

    if (to.meta.role && to.meta.role !== userRole) {
      return next({ name: '404' })
    }
  }

  next()
})

export default router
