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
        icon: 'vuestic-iconset-user',
      },
    },
    {
      name: 'manage-requests',
      displayName: 'menu.requests',
      meta: {
        icon: 'vuestic-iconset-files',
      },
    },
    {
      name: 'certificates',
      displayName: 'menu.certificates',
      meta: {
        icon: 'vuestic-iconset-files',
      },
    },
    {
      name: 'department',
      displayName: 'menu.department',
      meta: {
        icon: 'vuestic-iconset-user',
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
        icon: 'vuestic-iconset-user',
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
}
