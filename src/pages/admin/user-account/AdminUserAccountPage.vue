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
        <VaButton type="button" class="mr-4" @click="showChangePasswordModal">Change Pasword</VaButton>
        <VaButton type="submit" :disabled="isDisabled || isLoading">
          <template v-if="isLoading">
            <VaProgressCircle indeterminate />
          </template>
          <template v-else> Update User </template>
        </VaButton>
      </div>
    </VaForm>

    <VaModal v-model="changePasswordModal" :hide-default-actions="hideDefaultActions" size="large">
      <VaInput v-model="password.oldPassword" :rules="[rules.required]" class="mb-4" label="Old Password"></VaInput>
      <VaInput
        v-model="password.newPassword"
        :rules="[rules.required, rules.passwordStrength]"
        class="mb-4"
        label="New Password"
      ></VaInput>
      <VaInput
        v-model="password.confirmPassword"
        :rules="[rules.required, rules.matchPassword]"
        class="mb-4"
        label="Confirm Password"
      ></VaInput>
      <div class="flex justify-end gap-2 mt-4">
        <VaButton preset="plainOpacity" class="mr-3" :is-loading="isButtonLoading" @click="hideChangePasswordModal"
          >Cancel</VaButton
        >
        <VaButton :disabled="!isFormValid" :is-loading="isButtonLoading" @click="changePasword"
          >Change Password</VaButton
        >
      </div>
    </VaModal>

    <!-- Update Confirmation Modal -->
    <VaModal v-model="updateConfirmation" ok-text="Apply" cancel-text="Cancel" @ok="handleSubmit">
      <h3 class="va-h3">Confirm Update</h3>
      <p>Are you sure you want to update your account information? Please confirm your changes before applying.</p>
    </VaModal>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, ref, watch, computed } from 'vue'
import { adminRepository } from '../../../repository/adminRepository'
import { adminLoginApiService } from '../../../repository/authenticationRepository'
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

const hideDefaultActions = ref(true)
const isButtonLoading = ref(false)
const updateConfirmation = ref(false)
const changePasswordModal = ref(false)
const password = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const isFormValid = computed(() => {
  return (
    rules.required(password.oldPassword) === true &&
    rules.required(password.newPassword) === true &&
    rules.passwordStrength(password.newPassword) === true &&
    rules.required(password.confirmPassword) === true &&
    rules.matchPassword(password.confirmPassword) === true
  )
})

const changePasword = async () => {
  try {
    isButtonLoading.value = true
    const userId = jwtStore.getUserId
    const data = await adminRepository.getAdminById(userId)
    await adminLoginApiService.changePassword(data.email, password.oldPassword, password.newPassword)
    init({ message: 'Password changed successfully', color: 'success' })
    changePasswordModal.value = false
  } catch (error: any) {
    console.error('Failed to change password:', error)
    init({ message: error.response?.data?.message, color: 'danger' })
  } finally {
    isButtonLoading.value = false
  }
}

watch(
  () => ({ ...form }),
  () => {
    isDisabled.value = false
  },
  { deep: true },
)

const rules = {
  required: (v: string) => !!v || 'This field is required',
  passwordStrength: (v: string) => v.length >= 8 || 'Password must be at least 8 characters long',
  matchPassword: (v: string) => v === password.newPassword || 'Passwords do not match',
}

const showUpdateConfirmation = () => {
  updateConfirmation.value = true
}

const showChangePasswordModal = () => {
  changePasswordModal.value = true
}

const hideChangePasswordModal = () => {
  changePasswordModal.value = false
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
    await adminRepository.updateAdmin(data.id, form.fullName, form.email)
  } catch (error) {
    console.error('Failed to update user data:', error)
    throw error
  }
}

onMounted(loadCurrentlyLoggedinUser)
</script>
