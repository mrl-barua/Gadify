<template>
  <h1 class="page-title">Department Management</h1>
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
            <td colspan="12">
              <div class="flex justify-center mt-4">
                <VaPagination v-model="currentPage" :pages="departmentPages" />
              </div>
            </td>
          </tr>
        </template>
        <template #cell(actions)="{ rowIndex }">
          <VaButton preset="plain" class="ml-3" icon="edit" @click="openModalToEditItemById(rowIndex)" />
          <!-- <VaButton preset="plain" icon="delete" class="ml-3" @click="deleteItemById(rowIndex)" /> -->
        </template>
      </VaDataTable>

      <VaModal v-model="addDepartmentModal" ok-text="Save" size="large" hide-default-actions="true">
        <h3 class="va-h3">Add New Department</h3>
        <VaForm ref="formRef">
          <VaSelect
            v-model="departmentModel.campusId"
            label="Select Campus"
            :options="campusesOptions"
            outer-label
            :loading="isVaSelectLoading"
            track-by="value"
            text-by="text"
            value-by="value"
          />

          <VaInput
            v-model="departmentModel.departmentName"
            :rules="[rules.required]"
            class="mb-4"
            label="Department Name"
            type="text"
          >
            <template #label>Department Name <span style="color: red">*</span></template>
          </VaInput>

          <div class="flex justify-end gap-2 mt-4">
            <VaButton color="danger" @click="addDepartmentModal = false">Cancel</VaButton>
            <VaButton color="primary" @click="createDepartment">Save</VaButton>
          </div>
        </VaForm>
      </VaModal>

      <VaModal
        class="modal-crud"
        :model-value="!!editedDepartment"
        title="Edit item"
        size="small"
        @ok="editDepartment"
        @cancel="resetEditedItem"
      >
        <VaSelect
          v-model="editedDepartment.campusId"
          label="Select Campus"
          :options="campusesOptions"
          outer-label
          :loading="isVaSelectLoading"
          track-by="value"
          text-by="text"
          value-by="value" />

        <VaInput
          v-model="editedDepartment.departmentName"
          :rules="[rules.required]"
          class="mb-4"
          label="Department Name"
          type="text"
        ></VaInput></VaModal
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
      editedDepartment: null,
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
      const departmentName = this.departmentModel.departmentName.trim()

      if (!campusId) {
        toast.init({
          message: 'Please select a campus',
          color: 'danger',
        })
        return
      }

      if (!departmentName) {
        toast.init({
          message: 'Department Name cannot be empty',
          color: 'danger',
        })
        return
      }

      try {
        await departmentRepository.createDepartment(campusId, departmentName)
        toast.init({
          message: 'Created department successfully',
          color: 'success',
        })

        this.addDepartmentModal = false
        this.loadDepartments()
      } catch (error) {
        console.log(error)
        toast.init({
          message: error.response?.data?.message || 'Failed to create department',
          color: 'danger',
        })
        this.addDepartmentModal = true
      }
    },

    resetEditedItem() {
      this.editedDepartment = null
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
    editDepartment() {
      this.departments = [
        ...this.departments.slice(0, this.editedItemId),
        { ...this.editedDepartment },
        ...this.departments.slice(this.editedItemId + 1),
      ]
      try {
        departmentRepository.updateDepartment(
          this.editedDepartment.id,
          this.editedDepartment.campusId,
          this.editedDepartment.departmentName,
        )
        toast.init({
          message: 'Department updated successfully',
          color: 'success',
        })
      } catch (error) {
        console.log(error)
        toast.init({
          message: error.response?.data?.message || 'Failed to update department',
          color: 'danger',
        })
      } finally {
        this.resetEditedItem()
      }
    },
    openModalToEditItemById(id) {
      this.editedItemId = id
      this.editedDepartment = { ...this.departments[id] }
    },
  },
})
</script>
