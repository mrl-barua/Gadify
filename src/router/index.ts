import { createRouter, createWebHistory } from 'vue-router'
import AuthLayout from '../layouts/AuthLayout.vue'
import AdminLayout from '../layouts/AdminLayout.vue'
import EvaluatorsLayout from '../layouts/EvaluatorsLayout.vue'
import ProponentLayout from '../layouts/ProponentsLayout.vue'

// Function to get the user role (Assuming it's stored in localStorage)
function getUserRole() {
  return localStorage.getItem('userRole') // Should be 'admin' or 'evaluator'
}

const routes = [
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
    meta: { requiresAuth: true, role: 'admin' }, // Role-based access
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
        component: () => import('../pages/admin/user-account/AdminUserAccountPage.vue'),
      },
    ],
  },

  // Evaluator Routes
  {
    name: 'evaluator',
    path: '/',
    component: EvaluatorsLayout,
    redirect: { name: 'login' },
    meta: { requiresAuth: true, role: 'evaluator' }, // Role-based access
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

  // Proponent Routes
  {
    name: 'proponent',
    path: '/',
    component: ProponentLayout,
    redirect: { name: 'login' },
    meta: { requiresAuth: true, role: 'proponent' }, // Role-based access
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

// Global Navigation Guard
router.beforeEach((to, from, next) => {
  const userRole = getUserRole()

  // Check if the route requires authentication
  if (to.meta.requiresAuth) {
    if (!userRole) {
      return next({ name: 'login' }) // Redirect to login if not logged in
    }

    // Check if the user has the correct role
    if (to.meta.role && to.meta.role !== userRole) {
      return next({ name: '404' }) // Redirect to 404 if unauthorized
    }
  }

  next()
})

export default router
