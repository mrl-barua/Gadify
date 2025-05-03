<template>
  <h1 class="page-title">Evaluator Management</h1>
  <VaCard>
    <VaCardContent>
      <div class="flex flex-col md:flex-row gap-2 mb-2 justify-end">
        <div class="flex flex-col md:flex-row gap-2 justify-end">
          <VaInput v-model="input" placeholder="Filter..." class="w-full" />
        </div>
        <VaButton @click="addEvaluatorModal = !addEvaluatorModal">Add Evaluator</VaButton>
      </div>

      <VaDataTable
        striped
        class="table-crud"
        :items="evaluators"
        :columns="columns"
        :loading="isLoading"
        :per-page="perPage"
        :current-page="currentPage"
        :filter="filter"
        :filter-method="customFilteringFn"
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

          <VaSelect
            v-model="evaluatorModel.officeId"
            label="Select Office"
            :options="officeOptions"
            outer-label
            :loading="isVaSelectLoading"
            track-by="value"
            text-by="text"
            value-by="value"
          />

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
      <VaModal v-model="editEvaluatorModal" class="modal-crud" size="small" hide-default-actions>
        <VaInput v-model="editedEvaluatorModel.fullName" :rules="[rules.required]" class="mb-4" label="Full Name" />
        <VaInput
          v-model="editedEvaluatorModel.email"
          :rules="[rules.required, rules.email]"
          class="mb-4"
          label="Email"
        />

        <VaSelect
          v-model="editedEvaluatorModel.officeId"
          label="Select Office"
          :options="officeOptions"
          outer-label
          :loading="isVaSelectLoading"
          track-by="value"
          text-by="text"
          value-by="value"
        />
        <div class="flex justify-end gap-2 mt-4">
          <VaButton color="danger" @click="editEvaluatorModal = false">Cancel</VaButton>
          <VaButton color="primary" @click="editEvaluator">Save</VaButton>
        </div>
      </VaModal>
    </VaCardContent>
  </VaCard>
</template>

<script>
import { defineComponent, ref, reactive, computed, watch } from 'vue'
import debounce from 'lodash/debounce.js'
import { useToast } from 'vuestic-ui'
import { evaluatorsRepository } from '../../../repository/evaluatorRepository'
import { officeRepository } from '../../../repository/officeRepository'

export default defineComponent({
  setup() {
    const toast = useToast()

    const addEvaluatorModal = ref(false)
    const editEvaluatorModal = ref(false)

    const evaluatorModel = reactive({
      id: 0,
      officeId: null,
      fullName: '',
      email: '',
      password: '',
      repeatPassword: '',
    })

    const editedEvaluatorModel = reactive({
      id: 0,
      officeId: null,
      fullName: '',
      email: '',
    })

    const resetEvaluatorModel = () => {
      evaluatorModel.id = 0
      evaluatorModel.departmentId = 0
      evaluatorModel.officeId = null
      evaluatorModel.fullName = ''
      evaluatorModel.email = ''
      evaluatorModel.password = ''
    }

    const evaluators = ref([])

    const input = ref('')
    const filter = input
    const isDebounceInput = ref(true)
    const isCustomFilteringFn = ref(false)
    const filteredCount = computed(() => evaluators.value.length)
    const filteredCompleted = computed(() => evaluators.value)
    const customFilteringFn = computed(() => {
      return isCustomFilteringFn.value ? filterExact.value : undefined
    })
    function filterExact(source) {
      if (filter.value === '') {
        return true
      }
      return source?.toString?.() === filter.value
    }

    function updateFilter(newFilter) {
      filter.value = newFilter
    }

    const debouncedUpdateFilter = debounce((newFilter) => {
      updateFilter(newFilter)
    }, 600)

    watch(input, (newValue) => {
      if (isDebounceInput.value) {
        debouncedUpdateFilter(newValue)
      } else {
        updateFilter(newValue)
      }
    })

    const editedItem = reactive({})

    const rules = {
      required: (value) => !!value || 'This field is required',
      email: (value) => /\S+@\S+\.\S+/.test(value) || 'Please enter a valid email',
      passwordStrength: (value) => value.length >= 6 || 'Password must be at least 6 characters',
      matchPassword: (value) => value === evaluatorModel.password || 'Passwords do not match',
    }

    const officeOptions = ref([])
    const columns = [
      { key: 'evaluatorId', label: 'Evaluator Id', sortable: true },
      { key: 'fullName', label: 'Fullname', sortable: true },
      { key: 'email', label: 'Email', sortable: true },
      { key: 'office.officeName', label: 'Office', sortable: true },
      { key: 'office.department.departmentName', label: 'Department Name', sortable: true },
      { key: 'office.department.campus.campusName', label: 'Campus Name', sortable: true },
      { key: 'actions', width: 80 },
    ]

    const filtered = ref([])
    const perPage = ref(10)
    const currentPage = ref(1)
    const isLoading = ref(false)

    const evaluatorPages = computed(() =>
      perPage.value && perPage.value !== 0 ? Math.ceil(filtered.value.length / perPage.value) : 1,
    )

    const loadoffices = async () => {
      try {
        const data = await officeRepository.getOffices()
        officeOptions.value = data.map((office) => ({
          text: office.officeName,
          value: office.id,
        }))
      } catch (error) {
        console.log(error)
      } finally {
        console.log('Office loaded')
      }
    }

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
      if (
        !evaluatorModel.fullName ||
        !evaluatorModel.email ||
        !evaluatorModel.password ||
        !evaluatorModel.repeatPassword ||
        !evaluatorModel.officeId
      ) {
        toast.init({
          message: 'Please fill in all required fields',
          color: 'danger',
        })
        return
      }

      if (evaluatorModel.password !== evaluatorModel.repeatPassword) {
        toast.init({
          message: 'Passwords do not match',
          color: 'danger',
        })
        return
      }

      try {
        await evaluatorsRepository.createNewEvaluator(
          evaluatorModel.officeId,
          evaluatorModel.fullName,
          evaluatorModel.email,
          evaluatorModel.password,
        )
        toast.init({
          message: 'Evaluator created successfully',
          color: 'success',
        })

        isLoading.value = true
      } catch (error) {
        console.log(error)
        toast.init({
          message: error.response?.data?.message || 'Failed to create evaluator',
          color: 'danger',
        })
        isLoading.value = false
      } finally {
        addEvaluatorModal.value = false
        loadevaluators()
        isLoading.value = false
        resetEvaluatorModel()
      }
    }

    const editEvaluator = async () => {
      try {
        await evaluatorsRepository.updateEvaluator(
          editedEvaluatorModel.id,
          editedEvaluatorModel.officeId,
          editedEvaluatorModel.fullName,
          editedEvaluatorModel.email,
        )
        toast.init({
          message: 'Evaluator updated successfully',
          color: 'success',
        })
      } catch (error) {
        console.log(error)
        toast.init({
          message: error.response?.data?.message || 'Failed to update evaluator',
          color: 'danger',
        })
      } finally {
        loadevaluators()
        editEvaluatorModal.value = false
      }
    }

    const openModalToEditItemById = (id) => {
      try {
        const evaluator = evaluators.value[id]
        editedEvaluatorModel.id = evaluator.id
        editedEvaluatorModel.officeId = evaluator.officeId
        editedEvaluatorModel.fullName = evaluator.fullName
        editedEvaluatorModel.email = evaluator.email
      } catch (error) {
        console.log(error)
      } finally {
        editEvaluatorModal.value = true
      }
    }

    const deleteItemById = (id) => {
      evaluators.value.splice(id, 1)
    }

    return {
      officeOptions,
      evaluators,
      columns,
      filtered,
      perPage,
      currentPage,
      isLoading,
      evaluatorPages,
      addEvaluatorModal,
      editEvaluatorModal,
      evaluatorModel,
      editedEvaluatorModel,
      editedItem,
      rules,
      createEvaluator,
      editEvaluator,
      openModalToEditItemById,
      deleteItemById,
      loadevaluators,
      loadoffices,

      filteredCount,
      filteredCompleted,
      customFilteringFn,
      input,
      filter,
      isDebounceInput,
      updateFilter,
      debouncedUpdateFilter,
    }
  },
  mounted() {
    this.loadevaluators()
    this.loadoffices()
  },
})
</script>
