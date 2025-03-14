import './scss/main.scss'

import { createApp } from 'vue'
import App from './App.vue'
import i18n from './i18n'
import { createVuestic } from 'vuestic-ui'
import { createGtm } from '@gtm-support/vue-gtm'

import stores from './stores'
import router from './router'
// import vuesticGlobalConfig from './services/vuestic-ui/global-config'

const app = createApp(App)

app.use(stores)
app.use(router)
app.use(i18n)
app.use(
  createVuestic({
    config: {
      colors: {
        variables: {
          primary: '#441752',
          secondary: '#8174A0',
          success: '#A888B5',
          info: '#00acc1',
          warning: '#ffb822',
          danger: '#fd5d93',
          gray: '#9ea0a5',
          dark: '#000',
          light: '#fff',
          backgroundPrimary: '#f4f5f8',
          backgroundSecondary: '#edf1f7',
          backgroundElement: '#ffffff',
          backgroundBorder: '#c1c7d0',
          textPrimary: '#2e2e2e',
          textSecondary: '#848484',
          textPlaceholder: '#aaaaaa',
          textInverted: '#ffffff',
          textHeading: '#3e3f5e',
          textDisabled: '#c1c7d0',
          textMuted: '#8492a6',
          textLink: '#00acc1',
          textButton: '#ffffff',
          textButtonHover: '#ffffff',
          textButtonPressed: '#ffffff',
          textButtonDisabled: '#ffffff',
          textButtonFocused: '#ffffff',
          textButtonIcon: '#ffffff',
          textButtonIconHover: '#ffffff',
          textButtonIconPressed: '#ffffff',
          textButtonIconDisabled: '#ffffff',
          textButtonIconFocused: '#ffffff',
          textButtonGhost: '#00acc1',
          textButtonGhostHover: '#00acc1',
          textButtonGhostPressed: '#00acc1',
          textButtonGhostDisabled: '#00acc1',
          button: '#441752',
        },
      },
      components: {
        VaButton: {
          color: 'button',
        },
      },
    },
  }),
)

if (import.meta.env.VITE_APP_GTM_ENABLED) {
  app.use(
    createGtm({
      id: import.meta.env.VITE_APP_GTM_KEY,
      debug: false,
      vueRouter: router,
    }),
  )
}

app.mount('#app')
