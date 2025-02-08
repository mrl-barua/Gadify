<template>
  <VaDropdown :offset="[13, 0]" class="profile-dropdown" stick-to-edges :close-on-content-click="false">
    <template #anchor>
      <VaButton preset="secondary" color="textPrimary">
        <VaBadge overlap>
          <VaAvatar :size="32" color="primary"> 😎 </VaAvatar>
        </VaBadge>
      </VaButton>
    </template>
    <VaDropdownContent class="h-full sm:max-w-[420px] sm:h-auto">
      <section class="sm:max-h-[320px] p-4 overflow-auto">
        <VaButton preset="primary" class="w-full mb-2" @click="proceedToUserAccount">{{ t('User Account') }}</VaButton>
        <VaButton preset="primary" class="w-full" @click="logout">{{ t('Logout') }}</VaButton>
      </section>
    </VaDropdownContent>
  </VaDropdown>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
const { push } = useRouter()
const { t } = useI18n()

const proceedToUserAccount = () => {
  if (localStorage.getItem('userRole') === 'proponent') push({ name: 'proponent-user-account' })
  if (localStorage.getItem('userRole') === 'evaluator') push({ name: 'evaluator-user-account' })
  if (localStorage.getItem('userRole') === 'admin') push({ name: 'user-account' })
}

const logout = () => {
  localStorage.removeItem('userRole')
  sessionStorage.removeItem('userRole')
  push({ name: 'admin' })
}
</script>

<style lang="scss" scoped>
.profile-dropdown {
  cursor: pointer;

  .profile-dropdown__icon {
    position: relative;
    display: flex;
    align-items: center;
  }

  .va-dropdown__anchor {
    display: inline-block;
  }
}
</style>
