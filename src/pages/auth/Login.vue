<template>
  <VaForm ref="form" @submit.prevent="submit">
    <h1 class="font-semibold text-4xl mb-4">Log in</h1>
    <p class="text-base mb-4 leading-5">
      New to Gadify?
      <RouterLink :to="{ name: 'signup' }" class="font-semibold text-primary">Sign up</RouterLink>
    </p>
    <VaInput v-model="formData.email" class="mb-4" label="Email" type="email" />
    <VaValue v-slot="isPasswordVisible" :default-value="false">
      <VaInput
        v-model="formData.password"
        :rules="[validators.required]"
        :type="isPasswordVisible.value ? 'text' : 'password'"
        class="mb-4"
        label="Password"
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

    <div class="auth-layout__options flex flex-col sm:flex-row items-start sm:items-center justify-between">
      <VaCheckbox v-model="formData.keepLoggedIn" class="mb-2 sm:mb-0" label="Keep me signed in on this device" />
      <RouterLink :to="{ name: 'recover-password' }" class="mt-2 sm:mt-0 sm:ml-1 font-semibold text-primary">
        Forgot password?
      </RouterLink>
    </div>

    <div class="flex justify-center mt-4">
      <VaButton class="w-full" @click="submit"> Login</VaButton>
    </div>
  </VaForm>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useForm, useToast } from 'vuestic-ui'
import { validators } from '../../services/utils'
import { loginApiService } from '../../repository/authenticationRepository'
import { useJwtStore } from '../../stores/jwtHandler'

const { validate } = useForm('form')
const { push } = useRouter()
const { init } = useToast()
const jwtStore = useJwtStore()

const formData = reactive({
  email: 'test',
  password: '12345',
  keepLoggedIn: false,
})

const submit = async () => {
  if (validate()) {
    try {
      // Call the API service
      const response = await loginApiService.login(formData.email, formData.password)
      const data = response.data
      console.log(data.token)
      // Handle success
      init({ message: response.data.message || 'Login successful', color: 'success' })

      // Save token and decode it
      const token = response.data.token
      jwtStore.setToken(token)
      if (formData.keepLoggedIn) {
        localStorage.setItem('token', token)
      } else {
        sessionStorage.setItem('token', token)
      }

      // Redirect to the dashboard
      push({ name: 'dashboard' })
    } catch (error: any) {
      // Handle errors (e.g., invalid credentials)
      init({
        message: error.response?.data?.message || 'Login failed. Please try again.',
        color: 'danger',
      })
    }
  }
}
</script>
