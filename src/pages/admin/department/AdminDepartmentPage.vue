<template>
  <VaDataTable class="table-crud" :items="departments" :columns="columns" striped>
    <template #cell(actions)="{ rowIndex }">
      <VaButton preset="plain" icon="edit" @click="openModalToEditItemById(rowIndex)" />
      <VaButton preset="plain" icon="delete" class="ml-3" @click="deleteItemById(rowIndex)" />
    </template>
  </VaDataTable>

  <VaModal
    class="modal-crud"
    :model-value="!!editedItem"
    title="Edit item"
    size="small"
    @ok="editItem"
    @cancel="resetEditedItem"
  >
    <VaInput v-for="key in Object.keys(editedItem)" :key="key" v-model="editedItem[key]" class="my-6" :label="key" />
  </VaModal>
</template>

<script>
import { defineComponent } from 'vue'
import { departmentRepository } from '../../../repository/departmentRepository'

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
      departments,
      columns,
      editedItemId: null,
      editedItem: null,
      createdItem: { ...defaultItem },
    }
  },

  computed: {
    isNewData() {
      return Object.keys(this.createdItem).every((key) => !!this.createdItem[key])
    },
  },

  mounted() {
    this.loadDepartments()
  },

  methods: {
    async loadDepartments() {
      this.departments = await departmentRepository.getDepartments()
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
