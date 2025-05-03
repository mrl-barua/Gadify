<template>
  <h1 class="page-title">Office Management</h1>
  <VaCard>
    <VaCardContent>
      <div class="flex flex-col md:flex-row gap-2 mb-2 justify-end">
        <div class="flex flex-col md:flex-row gap-2 justify-end">
          <VaInput v-model="input" placeholder="Filter..." class="w-full" />
        </div>
        <VaButton @click="addOfficeModal = !addOfficeModal">Add Office</VaButton>
      </div>

      <VaDataTable
        striped
        class="table-crud"
        :items="offices"
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
                <VaPagination v-model="currentPage" :pages="officePages" />
              </div>
            </td>
          </tr>
        </template>
        <template #cell(actions)="{ rowIndex }">
          <VaButton preset="plain" class="ml-3" icon="edit" @click="openModalToEditItemById(rowIndex)" />
        </template>
      </VaDataTable>

      <!-- Add Office Modal -->
      <VaModal v-model="addOfficeModal" size="large" hide-default-actions>
        <h3 class="va-h3">Add New Office</h3>
        <VaForm ref="formRef" @submit.prevent="createOffice">
          <VaInput v-model="OfficeModel.fullName" :rules="[rules.required]" class="mb-4" label="Full Name" />
          <VaInput v-model="OfficeModel.email" :rules="[rules.required, rules.email]" class="mb-4" label="Email" />

          <VaSelect
            v-model="OfficeModel.officeId"
            label="Select Office"
            :options="departmentOptions"
            outer-label
            :loading="isVaSelectLoading"
            track-by="value"
            text-by="text"
            value-by="value"
          />

          <VaInput
            v-model="OfficeModel.password"
            :rules="[rules.required, rules.passwordStrength]"
            class="mb-4"
            label="Password"
            type="password"
          />

          <VaInput
            v-model="OfficeModel.repeatPassword"
            :rules="[rules.required, rules.matchPassword]"
            class="mb-4"
            label="Repeat Password"
            type="password"
          />

          <div class="flex justify-end gap-2 mt-4">
            <VaButton color="danger" @click="addOfficeModal = false">Cancel</VaButton>
            <VaButton color="primary" type="submit">Save</VaButton>
          </div>
        </VaForm>
      </VaModal>

      <!-- Edit Office Modal -->
      <VaModal v-model="editOfficeModal" class="modal-crud" size="small" hide-default-actions>
        <VaInput v-model="editedOfficeModel.fullName" :rules="[rules.required]" class="mb-4" label="Full Name" />
        <VaInput v-model="editedOfficeModel.email" :rules="[rules.required, rules.email]" class="mb-4" label="Email" />

        <VaSelect
          v-model="editedOfficeModel.officeId"
          label="Select Office"
          :options="departmentOptions"
          outer-label
          :loading="isVaSelectLoading"
          track-by="value"
          text-by="text"
          value-by="value"
        />
        <div class="flex justify-end gap-2 mt-4">
          <VaButton color="danger" @click="editOfficeModal = false">Cancel</VaButton>
          <VaButton color="primary" @click="editOffice">Save</VaButton>
        </div>
      </VaModal>
    </VaCardContent>
  </VaCard>
</template>

<script>
import { defineComponent, ref, reactive, computed, watch } from 'vue'
import debounce from 'lodash/debounce.js'
import { useToast } from 'vuestic-ui'
import { officeRepository } from '../../../repository/officeRepository'
import { departmentRepository } from '../../../repository/departmentRepository'

export default defineComponent({
  setup() {
    const toast = useToast()

    const addOfficeModal = ref(false)
    const editOfficeModal = ref(false)

    const OfficeModel = reactive({
      id: 0,
      officeId: null,
      departmentId: null,
      officeName: '',
    })

    const editedOfficeModel = reactive({
      id: 0,
      officeId: null,
      departmentId: null,
      officeName: '',
    })

    const resetOfficeModel = () => {
      OfficeModel.id = 0
      OfficeModel.officeId = null
      OfficeModel.departmentId = null
      OfficeModel.officeName = ''
    }

    const editedItem = reactive({})

    const rules = {
      required: (value) => !!value || 'This field is required',
    }

    const offices = ref([])

    const input = ref('')
    const filter = input
    const isDebounceInput = ref(true)
    const isCustomFilteringFn = ref(false)
    const filteredCount = computed(() => offices.value.length)
    const filteredCompleted = computed(() => offices.value)
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

    const departmentOptions = ref([])
    const columns = [
      { key: 'officeId', label: 'Office Id', sortable: true },
      { key: 'department.departmentName', label: 'Department', sortable: true },
      { key: 'department.campus.campusName', label: 'Campus', sortable: true },
      { key: 'officeName', label: 'Office Name', sortable: true },
      { key: 'actions', width: 80 },
    ]

    const filtered = ref([])
    const perPage = ref(10)
    const currentPage = ref(1)
    const isLoading = ref(false)

    const officePages = computed(() =>
      perPage.value && perPage.value !== 0 ? Math.ceil(filtered.value.length / perPage.value) : 1,
    )

    const loadDepartments = async () => {
      try {
        const data = await departmentRepository.getDepartments()
        departmentOptions.value = data.map((department) => ({
          text: department.departmentName,
          value: department.id,
        }))
      } catch (error) {
        console.log(error)
      } finally {
        console.log('Department loaded')
      }
    }

    const loadOffices = async () => {
      try {
        isLoading.value = true
        offices.value = await officeRepository.getOffices()
      } catch (error) {
        console.log(error)
      } finally {
        isLoading.value = false
      }
    }

    const createOffice = async () => {
      if (
        !OfficeModel.fullName ||
        !OfficeModel.email ||
        !OfficeModel.password ||
        !OfficeModel.repeatPassword ||
        !OfficeModel.officeId
      ) {
        toast.init({
          message: 'Please fill in all required fields',
          color: 'danger',
        })
        return
      }

      if (OfficeModel.password !== OfficeModel.repeatPassword) {
        toast.init({
          message: 'Passwords do not match',
          color: 'danger',
        })
        return
      }

      try {
        await evaluatorsRepository.createNewEvaluator(
          OfficeModel.officeId,
          OfficeModel.fullName,
          OfficeModel.email,
          OfficeModel.password,
        )
        toast.init({
          message: 'Office created successfully',
          color: 'success',
        })

        isLoading.value = true
      } catch (error) {
        console.log(error)
        toast.init({
          message: error.response?.data?.message || 'Failed to create office',
          color: 'danger',
        })
        isLoading.value = false
      } finally {
        addOfficeModal.value = false
        loadOffices()
        isLoading.value = false
        resetOfficeModel()
      }
    }

    const editOffice = async () => {
      try {
        await evaluatorsRepository.updateEvaluator(
          editedOfficeModel.id,
          editedOfficeModel.officeId,
          editedOfficeModel.fullName,
          editedOfficeModel.email,
        )
        toast.init({
          message: 'Office updated successfully',
          color: 'success',
        })
      } catch (error) {
        console.log(error)
        toast.init({
          message: error.response?.data?.message || 'Failed to update office',
          color: 'danger',
        })
      } finally {
        loadOffices()
        editOfficeModal.value = false
      }
    }

    const openModalToEditItemById = (id) => {
      try {
        const office = offices.value[id]
        editedOfficeModel.id = office.id
        editedOfficeModel.officeId = office.officeId
        editedOfficeModel.fullName = office.fullName
        editedOfficeModel.email = office.email
      } catch (error) {
        console.log(error)
      } finally {
        editOfficeModal.value = true
      }
    }

    const deleteItemById = (id) => {
      offices.value.splice(id, 1)
    }

    return {
      departmentOptions,
      offices,
      columns,
      filtered,
      perPage,
      currentPage,
      isLoading,
      officePages,
      addOfficeModal,
      editOfficeModal,
      OfficeModel,
      editedOfficeModel,
      editedItem,
      rules,
      createOffice,
      editOffice,
      openModalToEditItemById,
      deleteItemById,
      loadOffices,
      loadDepartments,

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
    this.loadOffices()
  },
})
</script>
