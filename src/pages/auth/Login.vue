<template>
  <VaForm ref="form" @submit.prevent="submit">
    <h1 class="font-semibold text-4xl mb-4">Log in</h1>
    <p class="text-base mb-4 leading-5" :hidden="loginValue !== 'Proponent'">
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
    <div class="flex justify-center mb-4">
      <VaSelect v-model="loginValue" placeholder="Colored" label="Login As" :options="loginOptions" outer-label />
    </div>
    <div class="auth-layout__options flex flex-col sm:flex-row items-start sm:items-center justify-between">
      <VaCheckbox v-model="formData.keepLoggedIn" class="mb-2 sm:mb-0" label="Keep me signed in on this device" />
      <RouterLink :to="{ name: 'recover-password' }" class="mt-2 sm:mt-0 sm:ml-1 font-semibold text-primary">
        Forgot password?
      </RouterLink>
    </div>

    <div class="flex justify-center mt-4">
      <VaButton :loading="isLoading" class="w-full" @click="submit"> Login</VaButton>
    </div>
  </VaForm>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useForm, useToast } from 'vuestic-ui'
import { sleep, validators } from '../../services/utils'
import { adminLoginApiService } from '../../repository/authenticationRepository'
import { useJwtStore } from '../../stores/jwtHandler'

const { validate } = useForm('form')
const { push } = useRouter()
const { init } = useToast()
const isLoading = ref(false)
const jwtStore = useJwtStore()

const loginOptions = ref(['Proponent', 'Evaluator', 'Admin'])

const loginValue = ref('Proponent')

const formData = reactive({
  email: 'admin1@example.com',
  password: '12345',
  keepLoggedIn: false,
})

const submit = async () => {
  if (validate()) {
    isLoading.value = true // Start loading
    await sleep(3000) // Simulate loading

    if (loginValue.value === 'Proponent') {
      try {
        alert('Proponent Page not yet implemented')
      } finally {
        isLoading.value = false
      }
    } else if (loginValue.value === 'Evaluator') {
      try {
        init({ message: 'Login successful', color: 'success' })
        push({ name: 'evaluation' })
      } finally {
        isLoading.value = false
      }
    } else if (loginValue.value === 'Admin') {
      try {
        const response = await adminLoginApiService.login(formData.email, formData.password)
        const data = response.data
        console.log(data.token)

        init({ message: response.data.message || 'Login successful', color: 'success' })

        const token = response.data.token
        jwtStore.setToken(token)
        if (formData.keepLoggedIn) {
          localStorage.setItem('token', token)
        } else {
          sessionStorage.setItem('token', token)
        }

        push({ name: 'dashboard' })
      } catch (error: any) {
        init({
          message: error.response?.data?.message || 'Login failed. Please try again.',
          color: 'danger',
        })
      } finally {
        isLoading.value = false // Stop loading after request completes
      }
    } else {
      alert('')
    }
  }
}
</script>
