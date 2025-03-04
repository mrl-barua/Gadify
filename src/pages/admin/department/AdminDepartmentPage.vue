<template>
  <h1 class="page-title">Department</h1>
  <VaCard>
    <VaCardContent>
      <div class="flex flex-col md:flex-row gap-2 mb-2 justify-end">
        <VaButton @click="addDepartmentModal = !addDepartmentModal">Add Department</VaButton>
      </div>

      <VaDataTable
        class="table-crud"
        :items="departments"
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
            <td colspan="6">
              <div class="flex justify-center mt-4">
                <VaPagination v-model="currentPage" :pages="departmentPages" />
              </div>
            </td>
          </tr>
        </template>
        <template #cell(actions)="{ rowIndex }">
          <VaButton preset="plain" icon="edit" @click="openModalToEditItemById(rowIndex)" />
          <VaButton preset="plain" icon="delete" class="ml-3" @click="deleteItemById(rowIndex)" />
        </template>
      </VaDataTable>

      <VaModal v-model="addDepartmentModal" ok-text="Save" size="large" @ok="createDepartment()">
        <h3 class="va-h3">Add New Department</h3>
        <VaForm>
          <VaSelect
            v-model="departmentModel.campusId"
            placeholder=""
            label="Select Campus"
            :options="campusesOptions"
            outer-label
            :multiple="false"
            selected-top-shown
            :loading="isVaSelectLoading"
            track-by="value"
            text-by="text"
            value-by="value"
          >
          </VaSelect>
          <VaInput
            v-model="departmentModel.departmentName"
            :rules="[rules.required]"
            class="mb-4"
            label="Department Name"
            type="text"
          >
            <template #label> Department Name <span style="color: red">*</span> </template></VaInput
          ></VaForm
        >
      </VaModal>

      <VaModal
        class="modal-crud"
        :model-value="!!editedItem"
        title="Edit item"
        size="small"
        @ok="editItem"
        @cancel="resetEditedItem"
      >
        <VaInput
          v-for="key in Object.keys(editedItem)"
          :key="key"
          v-model="editedItem[key]"
          class="my-6"
          :label="key"
        /> </VaModal
    ></VaCardContent>
  </VaCard>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { departmentRepository } from '../../../repository/departmentRepository'
import { campusRepository } from '../../../repository/campusRepository'
import { useToast } from 'vuestic-ui'

const toast = useToast()

const isVaSelectLoading = ref(false)

const rules = {
  required: (value) => !!value || 'This field is required',
}

const defaultItem = {
  id: '',
  departmentName: '',
  campusName: '',
}

export default defineComponent({
  data() {
    const departments = []

    const columns = [
      { key: 'departmentId', label: 'Department Id', sortable: true },
      { key: 'departmentName', label: 'Department Name', sortable: true },
      { key: 'campus.campusName', label: 'Campus', sortable: true },
      { key: 'actions', width: 80 },
    ]

    return {
      rules,
      departments,
      columns,
      editedItemId: null,
      editedItem: null,
      createdItem: { ...defaultItem },
      addDepartmentModal: false,

      campusesOptions: [],
      departmentModel: {
        campusId: '',
        departmentName: '',
      },

      filtered: departments,
      perPage: 10,
      currentPage: 1,
      filter: '',

      isLoading: false,
      isVaSelectLoading,
    }
  },

  computed: {
    isNewData() {
      return Object.keys(this.createdItem).every((key) => !!this.createdItem[key])
    },
    departmentPages() {
      return this.perPage && this.perPage !== 0 ? Math.ceil(this.filtered.length / this.perPage) : this.filtered.length
    },
  },

  mounted() {
    this.loadDepartments()
    this.loadCampuses()
  },

  methods: {
    async loadDepartments() {
      try {
        this.isLoading = true
        this.departments = await departmentRepository.getDepartments()
      } catch (error) {
        console.log(error)
      } finally {
        this.isLoading = false
      }
    },

    async loadCampuses() {
      isVaSelectLoading.value = true
      try {
        const data = await campusRepository.getCampuses()
        this.campusesOptions = data.map((campus) => ({
          text: campus.campusName,
          value: campus.id,
        }))
      } catch (error) {
        console.log(error)
      } finally {
        isVaSelectLoading.value = false
      }
    },

    async loadDepartmentById(id) {
      return await departmentRepository.getDepartmentById(id)
    },

    async createDepartment() {
      const campusId = Number(this.departmentModel.campusId)

      if (campusId === 0) {
        alert('Please select a campus')
        /* fix this -- add a validation to check if user didnt select a campus if no do not turn the modal off */
      }

      try {
        await departmentRepository.createDepartment(campusId, this.departmentModel.departmentName)
        toast.init({
          message: error.response?.data?.message || 'Failed to create department',
          color: 'danger',
        })
      } catch (error) {
        this.addDepartmentModal = true
        console.log(error)
        toast.init({
          message: 'Created department successfully',
          color: 'success',
        })
      } finally {
        this.addDepartmentModal = false
        this.loadDepartments()
      }
    },

    resetEditedItem() {
      this.editedItem = null
      this.editedItemId = null
    },
    resetCreatedItem() {
      this.createdItem = { ...defaultItem }
    },
    deleteItemById(id) {
      this.departments = [...this.departments.slice(0, id), ...this.departments.slice(id + 1)]
    },
    addNewItem() {
      this.departments = [...this.departments, { ...this.createdItem }]
      this.resetCreatedItem()
    },
    editItem() {
      this.departments = [
        ...this.departments.slice(0, this.editedItemId),
        { ...this.editedItem },
        ...this.departments.slice(this.editedItemId + 1),
      ]
      this.resetEditedItem()
    },
    openModalToEditItemById(id) {
      this.editedItemId = id
      this.editedItem = { ...this.departments[id] }
    },
  },
})
</script>
