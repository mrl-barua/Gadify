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
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useForm, useToast } from 'vuestic-ui'
import { validators } from '../../services/utils'
import {
  adminLoginApiService,
  evaluatorLoginApiService,
  proponentLoginApiService,
} from '../../repository/authenticationRepository'
import { useJwtStore } from '../../stores/jwtHandler'

const { validate } = useForm('form')
const { push } = useRouter()
const { init } = useToast()
const isLoading = ref(false)
const jwtStore = useJwtStore()

const removeLocalAndSessionStorage = () => {
  // if (jwtStore.isAuthenticated) {
  //   console.log(jwtStore.isAuthenticated)
  //   const userRole = jwtStore.getDecodedToken ? jwtStore.getDecodedToken.role : null
  //   if (userRole) {
  //     switch (userRole) {
  //       case 'proponent':
  //         push({ name: 'proponent-request' })
  //         break
  //       case 'evaluator':
  //         push({ name: 'evaluation' })
  //         break
  //       case 'admin':
  //         push({ name: 'proponents' })
  //         break
  //     }
  //   }
  // } else {
  //   jwtStore.logout()
  // }
  jwtStore.logout()
}

const loginOptions = ref(['Proponent', 'Evaluator', 'Admin'])

const loginValue = ref('Proponent')

const formData = reactive({
  email: 'admin1@example.com',
  password: '12345',
  keepLoggedIn: false,
})

const submit = async () => {
  if (validate()) {
    isLoading.value = true

    try {
      if (loginValue.value === 'Proponent') {
        try {
          const response = await proponentLoginApiService.login(formData.email, formData.password)

          init({ message: response.data.message || 'Login successful', color: 'success' })
          const token = response.data.token

          if (formData.keepLoggedIn) {
            jwtStore.setLocalStorageToken(token)
          } else {
            jwtStore.setSessionStorageToken(token)
          }
          push({ name: 'proponent-request' })
        } catch (error: any) {
          init({
            message: error.response?.data?.message || 'Login failed. Please try again.',
            color: 'danger',
          })
        } finally {
          isLoading.value = false
        }
      } else if (loginValue.value === 'Evaluator') {
        try {
          const response = await evaluatorLoginApiService.login(formData.email, formData.password)

          init({ message: response.data.message || 'Login successful', color: 'success' })
          const token = response.data.token

          if (formData.keepLoggedIn) {
            jwtStore.setLocalStorageToken(token)
          } else {
            jwtStore.setSessionStorageToken(token)
          }
          push({ name: 'evaluation' })
        } catch (error: any) {
          init({
            message: error.response?.data?.message || 'Login failed. Please try again.',
            color: 'danger',
          })
        } finally {
          isLoading.value = false
        }
      } else if (loginValue.value === 'Admin') {
        try {
          const response = await adminLoginApiService.login(formData.email, formData.password)

          init({ message: response.data.message || 'Login successful', color: 'success' })
          const token = response.data.token

          if (formData.keepLoggedIn) {
            jwtStore.setLocalStorageToken(token)
          } else {
            jwtStore.setSessionStorageToken(token)
          }
          push({ name: 'proponents' })
        } catch (error: any) {
          init({
            message: error.response?.data?.message || 'Login failed. Please try again.',
            color: 'danger',
          })
        } finally {
          isLoading.value = false
        }
      } else {
        console.log('')
      }
    } catch (error: any) {
      init({
        message: error.response?.data?.message || 'Login failed. Please try again.',
        color: 'danger',
      })
    } finally {
      isLoading.value = false
    }
  }
}

onMounted(() => {
  removeLocalAndSessionStorage()
})
</script>
