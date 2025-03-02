<template>
  <h1 class="page-title">User Account</h1>
  <div class="flex justify-center mb-8">
    <VaAvatar class="mr-6" size="10rem"> M </VaAvatar>
  </div>
  <div class="flex justify-center -mb-4">
    <VaForm ref="formRef" class="flex flex-col items-baseline gap-6" @submit.prevent="showUpdateConfirmation">
      <div class="flex flex-wrap justify-center -mx-2">
        <template v-if="isLoading">
          <VaSkeleton v-for="n in 4" :key="n" height="40px" class="mb-4" />
        </template>
        <template v-else>
          <VaInput v-model="form.adminId" label="Admin Id" disabled class="mb-4" />
        </template>

        <template v-if="isLoading">
          <VaSkeleton v-for="n in 3" :key="n" height="40px" class="mb-4" />
        </template>
        <template v-else>
          <VaInput v-model="form.fullName" label="Full Name" class="mb-4" />
          <VaInput v-model="form.email" label="Email" class="mb-4" />
        </template>
      </div>

      <!-- Submit Button -->
      <div class="w-full flex justify-end mt-3">
        <VaButton type="submit" :disabled="isDisabled || isLoading">
          <template v-if="isLoading">
            <VaProgressCircle indeterminate />
          </template>
          <template v-else> Update User </template>
        </VaButton>
      </div>
    </VaForm>

    <!-- Update Confirmation Modal -->
    <VaModal v-model="updateConfirmation" ok-text="Apply" cancel-text="Cancel" @ok="handleSubmit">
      <h3 class="va-h3">Confirm Update</h3>
      <p>Are you sure you want to update your account information? Please confirm your changes before applying.</p>
    </VaModal>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, ref, watch } from 'vue'
import { adminRepository } from '../../../repository/adminRepository'
import { useToast } from 'vuestic-ui'
import { useJwtStore } from '../../../stores/jwtHandler'
const { init } = useToast()
const jwtStore = useJwtStore()

const form = reactive({
  adminId: '',
  fullName: '',
  email: '',
})

const isDisabled = ref(false)
const isLoading = ref(false)
const updateConfirmation = ref(false)

watch(
  () => ({ ...form }),
  () => {
    isDisabled.value = false
  },
  { deep: true },
)

const showUpdateConfirmation = () => {
  updateConfirmation.value = true
}

const handleSubmit = async () => {
  try {
    await updateCurrentlyLoggedInUserData()
    init({ message: 'Account Updated Successfully', color: 'success' })
  } catch (error) {
    console.error('Failed to update user data:', error)
    init({ message: 'Failed to update account', color: 'danger' })
  } finally {
    updateConfirmation.value = false
    isDisabled.value = true
  }
}

const loadCurrentlyLoggedinUser = async () => {
  try {
    const userId = jwtStore.getUserId
    const data = await adminRepository.getAdminById(userId)

    Object.assign(form, {
      adminId: data.adminId,
      proponentType: data.proponentType,
      proponentStatus: data.proponentStatus,
      department: data.department?.departmentName || '',
      fullName: data.fullName,
      userName: data.userName,
      email: data.email,
    })

    isLoading.value = false
  } catch (error) {
    console.error('Failed to load user data:', error)
    isLoading.value = false
  }
}

const updateCurrentlyLoggedInUserData = async () => {
  try {
    const userId = jwtStore.getUserId
    const data = await adminRepository.getAdminById(userId)
    await adminRepository.updateAdmin(data.id, data.adminId, form.fullName, form.email)
  } catch (error) {
    console.error('Failed to update user data:', error)
    throw error
  }
}

onMounted(loadCurrentlyLoggedinUser)
</script>
