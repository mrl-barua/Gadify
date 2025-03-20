<template>
  <h1 class="page-title">Campus Management</h1>
  <VaCard>
    <VaCardContent>
      <div class="flex flex-col md:flex-row gap-2 mb-2 justify-end">
        <VaButton @click="addCampusModal = !addCampusModal">Add Campus</VaButton>
      </div>

      <VaDataTable
        class="table-crud"
        :items="campuses"
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
                <VaPagination v-model="currentPage" :pages="campusPages" />
              </div>
            </td>
          </tr>
        </template>
        <template #cell(actions)="{ rowIndex }">
          <VaButton preset="plain" class="ml-3" icon="edit" @click="openModalToEditItemById(rowIndex)" />
          <!-- <VaButton preset="plain" icon="delete" class="ml-3" @click="deleteItemById(rowIndex)" /> -->
        </template>
      </VaDataTable>

      <!-- Add Campus Modal -->
      <VaModal v-model="addCampusModal" size="large" hide-default-actions>
        <h3 class="va-h3">Add New Campus</h3>
        <VaForm ref="formRef" @submit.prevent="createCampus">
          <VaInput v-model="campusModel.campusName" :rules="[rules.required]" class="mb-4" label="Campus Name" />
          <VaInput v-model="campusModel.campusAddress" :rules="[rules.required]" class="mb-4" label="Campus Address" />

          <div class="flex justify-end gap-2 mt-4">
            <VaButton color="danger" @click="addCampusModal = false">Cancel</VaButton>
            <VaButton color="primary" type="submit">Save</VaButton>
          </div>
        </VaForm>
      </VaModal>

      <!-- Edit Campus Modal -->
      <VaModal v-model="editCampusModal" class="modal-crud" size="small" hide-default-actions="true">
        <VaInput v-model="editedCampusModel.campusName" :rules="[rules.required]" class="mb-4" label="Campus Name" />
        <VaInput
          v-model="editedCampusModel.campusAddress"
          :rules="[rules.required]"
          class="mb-4"
          label="Campus Address"
        />

        <div class="flex justify-end gap-2 mt-4">
          <VaButton color="danger" @click="editCampusModal = false">Cancel</VaButton>
          <VaButton color="primary" @click="editCampus">Save</VaButton>
        </div>
      </VaModal>
    </VaCardContent>
  </VaCard>
</template>

<script>
import { defineComponent, ref, reactive, computed } from 'vue'
import { useToast } from 'vuestic-ui'
import { campusRepository } from '../../../repository/campusRepository'

export default defineComponent({
  setup() {
    const toast = useToast()

    const addCampusModal = ref(false)
    const editCampusModal = ref(false)

    const campusModel = reactive({
      id: 0,
      campusName: '',
      campusAddress: '',
    })

    const editedCampusModel = reactive({
      id: 0,
      campusName: '',
      campusAddress: '',
    })

    const resetEvaluatorModel = () => {
      campusModel.id = 0
      campusModel.campusName = ''
      campusModel.campusAddress = ''
    }

    const rules = {
      required: (value) => !!value || 'This field is required',
    }

    const campuses = ref([])
    const officeOptions = ref([])
    const columns = [
      { key: 'campusId', label: 'Campus Id', sortable: true },
      { key: 'campusName', label: 'campus Name', sortable: true },
      { key: 'campusAddress', label: 'Campus Address', sortable: true },
      { key: 'actions', width: 80 },
    ]

    const filtered = ref([])
    const perPage = ref(10)
    const currentPage = ref(1)
    const isLoading = ref(false)

    const campusPages = computed(() =>
      perPage.value && perPage.value !== 0 ? Math.ceil(filtered.value.length / perPage.value) : 1,
    )

    const loadCampuses = async () => {
      try {
        isLoading.value = true
        campuses.value = await campusRepository.getCampuses()
      } catch (error) {
        console.log(error)
      } finally {
        isLoading.value = false
      }
    }

    const createCampus = async () => {
      if (!campusModel.campusName || !campusModel.campusAddress) {
        toast.init({
          message: 'Please fill in all required fields',
          color: 'danger',
        })
        return
      }

      try {
        await campusRepository.createCampus(campusModel.campusName, campusModel.campusAddress)
        toast.init({
          message: 'Campus created successfully',
          color: 'success',
        })

        isLoading.value = true
      } catch (error) {
        console.log(error)
        toast.init({
          message: error.response?.data?.message || 'Failed to create campus',
          color: 'danger',
        })
        isLoading.value = false
      } finally {
        addCampusModal.value = false
        loadCampuses()
        isLoading.value = false
        resetEvaluatorModel()
      }
    }

    const editCampus = async () => {
      try {
        await campusRepository.updateCampus(
          editedCampusModel.id,
          editedCampusModel.campusName,
          editedCampusModel.campusAddress,
        )
        toast.init({
          message: 'Campus updated successfully',
          color: 'success',
        })
        loadCampuses()
      } catch (error) {
        console.log(error)
        toast.init({
          message: error.response?.data?.message || 'Failed to update campus',
          color: 'danger',
        })
      } finally {
        editCampusModal.value = false
      }
    }

    const openModalToEditItemById = (id) => {
      try {
        const campus = campuses.value[id]

        editedCampusModel.id = campus.id
        editedCampusModel.campusName = campus.campusName
        editedCampusModel.campusAddress = campus.campusAddress
      } catch (error) {
        console.log(error)
      } finally {
        editCampusModal.value = true
      }
    }

    const deleteItemById = (id) => {
      campuses.value.splice(id, 1)
    }

    return {
      officeOptions,
      campuses,
      columns,
      filtered,
      perPage,
      currentPage,
      isLoading,
      campusPages,
      addCampusModal,
      editCampusModal,
      campusModel,
      editedCampusModel,
      rules,
      createCampus,
      editCampus,
      openModalToEditItemById,
      deleteItemById,
      loadCampuses,
    }
  },
  mounted() {
    this.loadCampuses()
  },
})
</script>
