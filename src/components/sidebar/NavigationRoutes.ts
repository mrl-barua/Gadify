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
      name: 'department',
      displayName: 'menu.department',
      meta: {
        icon: 'domain',
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
        icon: 'vuestic-iconset-settings',
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
        icon: 'vuestic-iconset-user',
      },
    },
  ] as INavigationRoute[],

  proponentRoutes: [
    {
      name: 'proponent-request',
      displayName: 'menu.requests',
      meta: {
        icon: 'vuestic-iconset-user',
      },
    },
    {
      name: 'proponent-issued-certificates',
      displayName: 'menu.certificates',
      meta: {
        icon: 'vuestic-iconset-files',
      },
    },
    {
      name: 'proponent-user-account',
      displayName: 'menu.userAccount',
      meta: {
        icon: 'vuestic-iconset-files',
      },
    },
  ] as INavigationRoute[],
}
