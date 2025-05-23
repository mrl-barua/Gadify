<template>
  <VaForm ref="form" @submit.prevent="submit">
    <h1 class="font-semibold text-4xl mb-4">Sign up</h1>
    <p class="text-base mb-4 leading-5">
      Have an account?
      <RouterLink :to="{ name: 'login' }" class="font-semibold text-primary">Login</RouterLink>
    </p>
    <VaInput
      v-model="formData.email"
      :rules="[(v) => !!v || 'Email field is required', (v) => /.+@.+\..+/.test(v) || 'Email should be valid']"
      class="mb-4"
      label="Email"
      type="email"
    >
      <template #label> Email <span style="color: red">*</span> </template>
    </VaInput>
    <VaInput v-model="formData.contactNo" class="mb-4" label="Contact No" type="text"
      ><template #label> Contact No. <span style="color: red">*</span> </template></VaInput
    >
    <VaValue v-slot="isPasswordVisible" :default-value="false">
      <VaInput
        ref="password1"
        v-model="formData.password"
        :rules="passwordRules"
        :type="isPasswordVisible.value ? 'text' : 'password'"
        class="mb-4"
        label="Password"
        messages="Password should be 8+ characters: letters, numbers, and special characters."
        @clickAppendInner.stop="isPasswordVisible.value = !isPasswordVisible.value"
      >
        <template #appendInner>
          <VaIcon
            :name="isPasswordVisible.value ? 'mso-visibility_off' : 'mso-visibility'"
            class="cursor-pointer"
            color="secondary"
          />
        </template>
      </VaInput>
      <VaInput
        ref="password2"
        v-model="formData.repeatPassword"
        :rules="[
          (v) => !!v || 'Repeat Password field is required',
          (v) => v === formData.password || 'Passwords don\'t match',
        ]"
        :type="isPasswordVisible.value ? 'text' : 'password'"
        class="mb-4"
        label="Repeat Password"
        @clickAppendInner.stop="isPasswordVisible.value = !isPasswordVisible.value"
      >
        <template #appendInner>
          <VaIcon
            :name="isPasswordVisible.value ? 'mso-visibility_off' : 'mso-visibility'"
            class="cursor-pointer"
            color="secondary"
          />
        </template>
      </VaInput>
    </VaValue>
    <div class="flex justify-center mt-4">
      <VaButton :loading="isButtonLoading" class="w-full" @click="submit"> Create account</VaButton>
    </div>
  </VaForm>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useForm, useToast } from 'vuestic-ui'

const { validate } = useForm('form')
const isButtonLoading = ref(false)
const { push } = useRouter()
const { init } = useToast()
import { useProponentStore } from '../../stores/proponent-store'
import { proponentsRepository } from '../../repository/proponentsRepository'

const proponentStore = useProponentStore()

const formData = reactive({
  email: '',
  contactNo: '',
  userName: '',
  password: '',
  repeatPassword: '',
})

const submit = () => {
  if (validate()) {
    isButtonLoading.value = true
    try {
      proponentStore.setProponentEmail(formData.email)
      proponentStore.setProponentUsername(formData.userName)
      proponentStore.setProponentPassword(formData.password)

      const proponentData = proponentStore.proponent
      proponentsRepository.registerProponent(
        proponentData.department,
        proponentData.fullname,
        proponentData.email,
        proponentData.password,
      )
      init({
        message: 'Success: You have signed up successfully',
        color: 'success',
      })
      push({ name: 'login' })
    } catch (error: any) {
      init({
        message: 'An error occurred' + error,
        color: 'error',
      })
    } finally {
      isButtonLoading.value = false
    }
  }
}

const passwordRules: ((v: string) => boolean | string)[] = [
  (v) => !!v || 'Password field is required',
  (v) => (v && v.length >= 8) || 'Password must be at least 8 characters long',
  (v) => (v && /[A-Za-z]/.test(v)) || 'Password must contain at least one letter',
  (v) => (v && /\d/.test(v)) || 'Password must contain at least one number',
  (v) => (v && /[!@#$%^&*(),.?":{}|<>]/.test(v)) || 'Password must contain at least one special character',
]
</script>
