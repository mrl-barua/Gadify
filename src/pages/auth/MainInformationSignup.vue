<template>
  <VaForm ref="form" @submit.prevent="submit">
    <h1 class="font-semibold text-4xl mb-4">Sign up</h1>
    <p class="text-base mb-4 leading-5">
      Have an account?
      <RouterLink :to="{ name: 'login' }" class="font-semibold text-primary">Login</RouterLink>
    </p>
    <VaInput v-model="formData.lastName" :rules="[rules.required]" class="mb-4" label="Last Name" type="text">
      <template #label> Last Name <span style="color: red">*</span> </template>
    </VaInput>
    <VaInput v-model="formData.firstName" :rules="[rules.required]" class="mb-4" label="First Name" type="text">
      <template #label> First Name <span style="color: red">*</span> </template></VaInput
    >
    <VaInput v-model="formData.middleName" class="mb-4" label="Middle Name" type="text" placeholder="(Optional)" />
    <VaSelect
      v-model="formData.department"
      class="mb-4"
      label="Office/Department"
      :options="departmentOptions"
      text-by="label"
      value-by="value"
      ><template #label> Department <span style="color: red">*</span> </template>
    </VaSelect>
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
import { reactive, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useForm, useToast } from 'vuestic-ui'

const { validate } = useForm('form')
const { push } = useRouter()
const { init } = useToast()
import { useProponentStore } from '../../stores/proponent-store'

import { departmentRepository } from '../../repository/departmentRepository'

const proponentStore = useProponentStore()

const rules = {
  required: (value: string) => !!value || 'This field is required',
}

const formData = reactive({
  lastName: '',
  firstName: '',
  middleName: '',
  department: '',
  sex: '',
})

const departmentOptions = ref<{ value: number; label: string }[]>([])

const loadDepartments = async () => {
  const departments = await departmentRepository.getDepartments()
  departmentOptions.value = departments.map((department: { id: number; departmentName: string }) => ({
    value: department.id,
    label: department.departmentName,
  }))
}

onMounted(() => {
  loadDepartments()
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
</script>
