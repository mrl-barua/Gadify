<template>
  <h1 class="page-title">Evaluator Management</h1>
  <VaCard>
    <VaCardContent>
      <div class="flex flex-col md:flex-row gap-2 mb-2 justify-end">
        <VaButton @click="addEvaluatorModal = !addEvaluatorModal">Add Evaluator</VaButton>
      </div>

      <VaDataTable
        class="table-crud"
        :items="evaluators"
        :columns="columns"
        striped
        :loading="isLoading"
        :per-page="perPage"
        :current-page="currentPage"
        :filter="filter"
        @filtered="filtered = $event.items"
      >
        <template #bodyAppend>
          <tr>
            <td colspan="12">
              <div class="flex justify-center mt-4">
                <VaPagination v-model="currentPage" :pages="evaluatorPages" />
              </div>
            </td>
          </tr>
        </template>
        <template #cell(actions)="{ rowIndex }">
          <VaButton preset="plain" class="ml-3" icon="edit" @click="openModalToEditItemById(rowIndex)" />
          <!-- <VaButton preset="plain" icon="delete" class="ml-3" @click="deleteItemById(rowIndex)" /> -->
        </template>
      </VaDataTable>

      <!-- Add Evaluator Modal -->
      <VaModal v-model="addEvaluatorModal" size="large" hide-default-actions>
        <h3 class="va-h3">Add New Evaluator</h3>
        <VaForm ref="formRef" @submit.prevent="createEvaluator">
          <VaInput v-model="evaluatorModel.fullName" :rules="[rules.required]" class="mb-4" label="Full Name" />
          <VaInput v-model="evaluatorModel.email" :rules="[rules.required, rules.email]" class="mb-4" label="Email" />

          <VaInput
            v-model="evaluatorModel.password"
            :rules="[rules.required, rules.passwordStrength]"
            class="mb-4"
            label="Password"
            type="password"
          />

          <VaInput
            v-model="evaluatorModel.repeatPassword"
            :rules="[rules.required, rules.matchPassword]"
            class="mb-4"
            label="Repeat Password"
            type="password"
          />

          <div class="flex justify-end gap-2 mt-4">
            <VaButton color="danger" @click="addEvaluatorModal = false">Cancel</VaButton>
            <VaButton color="primary" type="submit">Save</VaButton>
          </div>
        </VaForm>
      </VaModal>

      <!-- Edit Evaluator Modal -->
      <VaModal v-model="isEditing" class="modal-crud" title="Edit Evaluator" size="small">
        <VaInput
          v-for="key in Object.keys(editedItem)"
          :key="key"
          v-model="editedItem[key]"
          class="my-6"
          :label="key"
        />
        <div class="flex justify-end gap-2 mt-4">
          <VaButton color="danger" @click="isEditing = false">Cancel</VaButton>
          <VaButton color="primary" @click="editItem">Save</VaButton>
        </div>
      </VaModal>
    </VaCardContent>
  </VaCard>
</template>

<script>
import { defineComponent, ref, reactive, computed } from 'vue'
import { useToast } from 'vuestic-ui'
import { evaluatorsRepository } from '../../../repository/evaluatorRepository'

export default defineComponent({
  setup() {
    const toast = useToast()

    const addEvaluatorModal = ref(false)
    const isEditing = ref(false)

    const evaluatorModel = reactive({
      id: 0,
      campusId: 0,
      departmentId: 0,
      officeId: 0,
      fullName: '',
      email: '',
      password: '',
    })

    const editedItem = reactive({})
    const editedItemId = ref(null)

    const rules = {
      required: (value) => !!value || 'This field is required',
      email: (value) => /\S+@\S+\.\S+/.test(value) || 'Please enter a valid email',
      passwordStrength: (value) => value.length >= 6 || 'Password must be at least 6 characters',
      matchPassword: (value) => value === evaluatorModel.password || 'Passwords do not match',
    }

    const evaluators = ref([])
    const columns = [
      { key: 'evaluatorId', label: 'Evaluator Id', sortable: true },
      { key: 'fullName', label: 'Fullname', sortable: true },
      { key: 'email', label: 'Email', sortable: true },
      { key: 'department.departmentName', label: 'Department Name', sortable: true },
      { key: 'department.campus.campusName', label: 'Campus Name', sortable: true },
      { key: 'office.officeName', label: 'Office', sortable: true },
      { key: 'actions', width: 80 },
    ]

    const filtered = ref([])
    const perPage = ref(10)
    const currentPage = ref(1)
    const isLoading = ref(false)

    const evaluatorPages = computed(() =>
      perPage.value && perPage.value !== 0 ? Math.ceil(filtered.value.length / perPage.value) : 1,
    )

    const loadevaluators = async () => {
      try {
        isLoading.value = true
        evaluators.value = await evaluatorsRepository.getEvaluators()
      } catch (error) {
        console.log(error)
      } finally {
        isLoading.value = false
      }
    }

    const createEvaluator = async () => {
      if (!evaluatorModel.fullName || !evaluatorModel.email || !evaluatorModel.password) {
        toast.init({
          message: 'Please fill in all required fields',
          color: 'danger',
        })
        return
      }

      try {
        await evaluatorsRepository.createNewEvaluator(
          evaluatorModel.campusId,
          evaluatorModel.departmentId,
          evaluatorModel.officeId,
          evaluatorModel.fullName,
          evaluatorModel.email,
          evaluatorModel.password,
        )

        toast.init({
          message: 'Evaluator created successfully',
          color: 'success',
        })

        addEvaluatorModal.value = false
        loadevaluators()
      } catch (error) {
        console.log(error)
        toast.init({
          message: error.response?.data?.message || 'Failed to create evaluator',
          color: 'danger',
        })
      }
    }

    const editItem = () => {
      evaluators.value = evaluators.value.map((evaluator, index) =>
        index === editedItemId.value ? { ...editedItem } : evaluator,
      )
      isEditing.value = false
    }

    const openModalToEditItemById = (id) => {
      editedItemId.value = id
      Object.assign(editedItem, evaluators.value[id])
      isEditing.value = true
    }

    const deleteItemById = (id) => {
      evaluators.value.splice(id, 1)
    }

    return {
      evaluators,
      columns,
      filtered,
      perPage,
      currentPage,
      isLoading,
      evaluatorPages,
      addEvaluatorModal,
      isEditing,
      evaluatorModel,
      editedItem,
      rules,
      createEvaluator,
      editItem,
      openModalToEditItemById,
      deleteItemById,
      loadevaluators,
    }
  },
  mounted() {
    this.loadevaluators()
  },
})
</script>
