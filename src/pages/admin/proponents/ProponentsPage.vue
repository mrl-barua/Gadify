<template>
  <h1 class="page-title">Proponents</h1>
  <VaDataTable class="table-crud" :items="proponents" :columns="columns" striped>
    <template #cell(actions)="{ rowIndex }">
      <VaButton preset="plain" icon="edit" @click="openModalToEditItemById(rowIndex)" />
      <VaButton preset="plain" icon="delete" class="ml-3" @click="deleteItemById(rowIndex)" />
    </template>
  </VaDataTable>

  <VaModal
    class="modal-crud"
    :model-value="!!editedProponent"
    title="Edit proponent"
    size="small"
    @ok="editItem"
    @cancel="reseteditedProponent"
  >
    <VaInput
      v-for="key in Object.keys(editedProponent)"
      :key="key"
      v-model="editedProponent[key]"
      class="my-6"
      :label="key"
    />
  </VaModal>
</template>

<script>
import { defineComponent } from 'vue'
import { proponentsRepository } from './repository/ProponentsRepository'

const defaultProponent = {
  proponentId: '',
  departmentId: '',
  proponentType: '',
  proponentStatus: '',
  fullName: '',
  userName: '',
  createdAt: '',
}

export default defineComponent({
  data() {
    const proponents = []

    const columns = [
      { key: 'proponentId', label: 'Proponent ID', sortable: true },
      { key: 'department.departmentId', label: 'Department ID', sortable: true },
      { key: 'proponentType', label: 'Proponent Type', sortable: true },
      { key: 'proponentStatus', label: 'Proponent Status', sortable: true },
      { key: 'fullName', label: 'Full Name', sortable: true },
      { key: 'userName', label: 'User Name', sortable: true },
      { key: 'createdAt', label: 'Created At', sortable: true },
      { key: 'department.departmentName', label: 'Department Name', sortable: true },
      { key: 'department.campus.campusName', label: 'Campus Name', sortable: true },
      { key: 'department.campus.campusAddress', label: 'Campus Address', sortable: true },
      { key: 'actions', label: 'Actions', width: 80 },
    ]

    return {
      proponents,
      columns,
      editedProponentId: null,
      editedProponent: null,
      createdProponent: { ...defaultProponent },
    }
  },

  mounted() {
    this.loadProponents()
  },

  computed: {
    isNewData() {
      return Object.keys(this.createdProponent).every((key) => !!this.createdProponent[key])
    },
  },

  methods: {
    async loadProponents() {
      try {
        const data = await proponentsRepository.getProponents()
        this.proponents = data // Assign fetched data to the component state
      } catch (error) {
        console.error('Failed to load proponents:', error)
      }
    },
    reseteditedProponent() {
      this.editedProponent = null
      this.editedProponentId = null
    },
    resetcreatedProponent() {
      this.createdProponent = { ...defaultProponent }
    },
    deleteItemById(id) {
      this.proponents = [...this.proponents.slice(0, id), ...this.proponents.slice(id + 1)]
    },
    addNewItem() {
      this.proponents = [...this.proponents, { ...this.createdProponent }]
      this.resetcreatedProponent()
    },
    editItem() {
      this.proponents = [
        ...this.proponents.slice(0, this.editedProponentId),
        { ...this.editedProponent },
        ...this.proponents.slice(this.editedProponentId + 1),
      ]
      this.reseteditedProponent()
    },
    openModalToEditItemById(id) {
      this.editedProponentId = id
      this.editedProponent = { ...this.proponents[id] }
    },
  },
})
</script>

<style lang="scss" scoped>
.table-crud {
  --va-form-element-default-width: 0;

  .va-input {
    display: block;
  }

  &__slot {
    th {
      vertical-align: middle;
    }
  }
}

.modal-crud {
  .va-input {
    display: block;
  }
}
</style>
