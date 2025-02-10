<template>
  <div class="app-navbar-actions">
    <span class="app-navbar-actions__item app-navbar-actions__greeting">Hello, {{ name }}</span>
    <ProfileDropdown class="app-navbar-actions__item" />
  </div>
</template>

<script lang="ts" setup>
import ProfileDropdown from './dropdowns/ProfileDropdown.vue'

defineProps({
  isMobile: { type: Boolean, default: false },
})

import { ref } from 'vue'
// import { useI18n } from 'vue-i18n'
// const { t } = useI18n()

const name = ref('Marlo') // Replace 'Name' with the dynamic value you want
</script>

<style lang="scss">
.app-navbar-actions {
  display: flex;
  align-items: center;

  .va-dropdown__anchor {
    color: var(--va-primary);
    fill: var(--va-primary);
  }

  &__item {
    padding: 0;
    margin-left: 0.25rem;
    margin-right: 0.25rem;

    svg {
      height: 20px;
    }

    &--profile {
      display: flex;
      justify-content: center;
    }

    .va-dropdown-content {
      background-color: var(--va-white);
    }

    @media screen and (max-width: 640px) {
      margin-left: 0;
      margin-right: 0;

      &:first-of-type {
        margin-left: 0;
      }
    }
  }

  &__greeting {
    font-weight: bold;
    font-size: 1.1rem;
    color: var(--va-primary);
    margin-right: 0.5rem;
  }

  .fa-github {
    color: var(--va-on-background-primary);
  }
}
</style>
