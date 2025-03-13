export interface INavigationRoute {
  name: string
  displayName: string
  meta: { icon: string }
  children?: INavigationRoute[]
}
export default {
  root: {
    name: '/',
    displayName: 'navigationRoutes.home',
  },
  adminRoutes: [
    {
      name: 'proponents',
      displayName: 'menu.proponents',
      meta: {
        icon: 'group',
      },
    },
    {
      name: 'manage-requests',
      displayName: 'menu.requests',
      meta: {
        icon: 'assignment',
      },
    },
    {
      name: 'certificates',
      displayName: 'menu.certificates',
      meta: {
        icon: 'content_paste',
      },
    },
    {
      name: 'evaluators',
      displayName: 'menu.evaluator',
      meta: {
        icon: 'groups_2',
      },
    },
    {
      name: 'office',
      displayName: 'menu.office',
      meta: {
        icon: 'domain',
      },
    },
    {
      name: 'department',
      displayName: 'menu.department',
      meta: {
        icon: 'corporate_fare',
      },
    },
    {
      name: 'campus',
      displayName: 'menu.campus',
      meta: {
        icon: 'apartment',
      },
    },

    {
      name: 'admins',
      displayName: 'menu.admin',
      meta: {
        icon: 'manage_accounts',
      },
    },
    {
      name: 'user-account',
      displayName: 'menu.userAccount',
      meta: {
        icon: 'manage_accounts',
      },
    },
  ] as INavigationRoute[],

  evaluatorRoutes: [
    {
      name: 'evaluation',
      displayName: 'menu.evaluation',
      meta: {
        icon: 'content_paste',
      },
    },
    {
      name: 'evaluator-user-account',
      displayName: 'menu.userAccount',
      meta: {
        icon: 'manage_accounts',
      },
    },
  ] as INavigationRoute[],

  proponentRoutes: [
    {
      name: 'proponent-request',
      displayName: 'menu.requests',
      meta: {
        icon: 'assignment',
      },
    },
    {
      name: 'proponent-issued-certificates',
      displayName: 'menu.certificates',
      meta: {
        icon: 'content_paste',
      },
    },
    {
      name: 'proponent-user-account',
      displayName: 'menu.userAccount',
      meta: {
        icon: 'manage_accounts',
      },
    },
  ] as INavigationRoute[],
}
