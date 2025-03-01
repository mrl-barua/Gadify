<template>
  <VaDataTable class="table-crud" :items="departments" :columns="columns" striped>
    <template #headerAppend>
      <tr class="table-crud__slot">
        <th v-for="key in Object.keys(createdItem)" :key="key" class="p-1">
          <VaInput v-if="createdItem[key].id" v-model="createdItem[key]" disabled="true" :placeholder="key" />
          <VaInput v-else v-model="createdItem[key]" :placeholder="key" />
        </th>
        <th class="p-1">
          <VaButton :disabled="!isNewData" block @click="addNewItem"> Add </VaButton>
        </th>
      </tr>
    </template>

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

const defaultItem = {
  id: '',
  departmentId: '',
  campusId: '',
  departmentName: '',
}

export default defineComponent({
  data() {
    const departments = [
      {
        id: 1,
        departmentId: 'D-0001',
        campusId: 1,
        departmentName: 'cc',
      },
      {
        id: 2,
        departmentId: 'D-0002',
        campusId: 2,
        departmentName: 'cc',
      },
      {
        id: 3,
        departmentId: 'D-0003',
        campusId: 1,
        departmentName: 'ccc',
      },
      {
        id: 4,
        departmentId: 'D-0004',
        campusId: 1,
        departmentName: 'ccc',
      },
      {
        id: 5,
        departmentId: 'D-0005',
        campusId: 1,
        departmentName: 'ccc',
      },
      {
        id: 6,
        departmentId: 'D-0006',
        campusId: 1,
        departmentName: 'ccc',
      },
      {
        id: 7,
        departmentId: 'D-0007',
        campusId: 1,
        departmentName: 'ccc',
      },
      {
        id: 8,
        departmentId: 'D-0008',
        campusId: 1,
        departmentName: 'ccc',
      },
      {
        id: 9,
        departmentId: 'D-0009',
        campusId: 1,
        departmentName: 'ccc',
      },
    ]

    const columns = [
      { key: 'id', sortable: true },
      { key: 'departmentId', sortable: true },
      { key: 'campusId', sortable: true },
      { key: 'departmentName', sortable: true },
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

  methods: {
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
