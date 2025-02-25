<template>
  <VaForm ref="form" @submit.prevent="submit">
    <h1 class="font-semibold text-4xl mb-4">Sign up</h1>
    <p class="text-base mb-4 leading-5">
      Have an account?
      <RouterLink :to="{ name: 'login' }" class="font-semibold text-primary">Login</RouterLink>
    </p>
    <VaInput v-model="formData.lastName" class="mb-4" label="Last Name" type="text" />
    <VaInput v-model="formData.firstName" class="mb-4" label="First Name" type="text" />
    <VaInput v-model="formData.middleName" class="mb-4" label="Middle Name" type="text" />
    <VaSelect v-model="formData.department" class="mb-4" label="Office/Department" :options="departmentOptions" />
    <VaRadioGroup v-model="formData.sex" class="mb-4" label="Sex">
      <VaRadio label="Male" name="sex" value="male" />
      <VaRadio label="Female" name="sex" value="female" />
    </VaRadioGroup>
    <div class="flex justify-center mt-4">
      <VaButton class="w-full" @click="submit"> Proceed to other information</VaButton>
    </div>
  </VaForm>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useForm, useToast } from 'vuestic-ui'

const { validate } = useForm('form')
const { push } = useRouter()
const { init } = useToast()
import { useProponentStore } from '../../stores/proponent-store'

const proponentStore = useProponentStore()

const formData = reactive({
  lastName: '',
  firstName: '',
  middleName: '',
  department: '',
  sex: '',
})

const submit = () => {
  if (validate()) {
    try {
      proponentStore.setProponentFullName(formData.firstName + '' + formData.middleName + '' + formData.lastName)
      proponentStore.setProponentDepartment(formData.department)
    } catch {
      init({
        message: 'An error occurred',
        color: 'error',
      })
    } finally {
      init({
        message: 'Next step: proceed to other information',
        color: 'success',
      })
      push({ name: 'next-signup' })
    }
  }
}
const departmentOptions = ['Human Resources', 'Information Technology', 'Finance', 'Marketing', 'Sales']
</script>
