<template>
  <VaDropdown :offset="[13, 0]" class="profile-dropdown" stick-to-edges :close-on-content-click="false">
    <template #anchor>
      <VaButton preset="secondary" color="textPrimary">
        <VaBadge overlap>
          <VaAvatar :size="32" color="primary"> {{ username[0] }} </VaAvatar>
        </VaBadge>
      </VaButton>
    </template>
    <VaDropdownContent class="h-full sm:max-w-[420px] sm:h-auto">
      <section class="sm:max-h-[320px] p-4 overflow-auto">
        <VaButton preset="primary" class="w-full mb-2" @click="proceedToUserAccount">{{ t('User Account') }}</VaButton>
        <VaButton preset="primary" class="w-full mb-2" @click="logout">{{ t('Logout') }}</VaButton>
        <div class="flex items-center justify-center gap-3 mt-2">
          <span>Dark mode:</span>
          <VaSwitch v-model="switchValue" true-value="dark" false-value="light" size="small" />
        </div>
      </section>
    </VaDropdownContent>
  </VaDropdown>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
const { push } = useRouter()
const { t } = useI18n()
import { computed } from 'vue'
import { useColors } from 'vuestic-ui'
import { useJwtStore } from '../../../../stores/jwtHandler'

const username = useJwtStore().getUsername || ''

const { applyPreset, currentPresetName } = useColors()

const jwtStore = useJwtStore()

const switchValue = computed({
  get() {
    return currentPresetName.value
  },
  set(value) {
    applyPreset(value)
  },
})

const userRole = jwtStore.getDecodedToken ? jwtStore.getDecodedToken.role : null

const proceedToUserAccount = () => {
  if (userRole === 'proponent') push({ name: 'proponent-user-account' })
  if (userRole === 'evaluator') push({ name: 'evaluator-user-account' })
  if (userRole === 'admin') push({ name: 'user-account' })
}

const logout = () => {
  jwtStore.logout
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
