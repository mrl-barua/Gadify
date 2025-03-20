<template>
  <h1 class="page-title">Admin Management</h1>
  <VaCard>
    <VaCardContent>
      <div class="flex flex-col md:flex-row gap-2 mb-2 justify-end">
        <VaButton @click="addAdminModal = !addAdminModal">Add Admin</VaButton>
      </div>

      <VaDataTable
        class="table-crud"
        :items="admins"
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
                <VaPagination v-model="currentPage" :pages="adminPages" />
              </div>
            </td>
          </tr>
        </template>
        <template #cell(actions)="{ rowIndex }">
          <VaButton preset="plain" class="ml-3" icon="edit" @click="openModalToEditItemById(rowIndex)" />
          <!-- <VaButton preset="plain" icon="delete" class="ml-3" @click="deleteItemById(rowIndex)" /> -->
        </template>
      </VaDataTable>

      <!-- Add Admin Modal -->
      <VaModal v-model="addAdminModal" size="large" hide-default-actions>
        <h3 class="va-h3">Add New Admin</h3>
        <VaForm ref="formRef" @submit.prevent="createAdmin">
          <VaInput v-model="adminModel.fullName" :rules="[rules.required]" class="mb-4" label="Full Name" />
          <VaInput v-model="adminModel.email" :rules="[rules.required, rules.email]" class="mb-4" label="Email" />

          <VaInput
            v-model="adminModel.password"
            :rules="[rules.required, rules.passwordStrength]"
            class="mb-4"
            label="Password"
            type="password"
          />

          <VaInput
            v-model="adminModel.repeatPassword"
            :rules="[rules.required, rules.matchPassword]"
            class="mb-4"
            label="Repeat Password"
            type="password"
          />

          <div class="flex justify-end gap-2 mt-4">
            <VaButton color="danger" @click="addAdminModal = false">Cancel</VaButton>
            <VaButton color="primary" type="submit">Save</VaButton>
          </div>
        </VaForm>
      </VaModal>

      <!-- Edit Admin Modal -->
      <VaModal v-model="isEditing" class="modal-crud" title="Edit Admin" size="small" hide-default-actions="true">
        <VaInput v-model="editedAdminModel.fullName" :rules="[rules.required]" class="mb-4" label="Full Name" />
        <VaInput v-model="editedAdminModel.email" :rules="[rules.required]" class="mb-4" label="Email Address" />
        <div class="flex justify-end gap-2 mt-4">
          <VaButton color="danger" @click="isEditing = false">Cancel</VaButton>
          <VaButton color="primary" @click="updateAdmin">Save</VaButton>
        </div>
      </VaModal>
    </VaCardContent>
  </VaCard>
</template>

<script>
import { defineComponent, ref, reactive, computed } from 'vue'
import { useToast } from 'vuestic-ui'
import { adminRepository } from '../../../repository/adminRepository'

export default defineComponent({
  setup() {
    const toast = useToast()

    const addAdminModal = ref(false)
    const isEditing = ref(false)

    const adminModel = reactive({
      fullName: '',
      email: '',
      password: '',
      repeatPassword: '',
    })

    const editedAdminModel = reactive({
      fullName: '',
      email: '',
    })

    const editedItem = reactive({})
    const editedItemId = ref(null)

    const rules = {
      required: (value) => !!value || 'This field is required',
      email: (value) => /\S+@\S+\.\S+/.test(value) || 'Please enter a valid email',
      passwordStrength: (value) => value.length >= 6 || 'Password must be at least 6 characters',
      matchPassword: (value) => value === adminModel.password || 'Passwords do not match',
    }

    const admins = ref([])
    const columns = [
      { key: 'adminId', label: 'Admin Id', sortable: true },
      { key: 'fullName', label: 'Fullname', sortable: true },
      { key: 'email', label: 'Email', sortable: true },
      { key: 'actions', width: 80 },
    ]

    const filtered = ref([])
    const perPage = ref(10)
    const currentPage = ref(1)
    const isLoading = ref(false)

    const adminPages = computed(() =>
      perPage.value && perPage.value !== 0 ? Math.ceil(filtered.value.length / perPage.value) : 1,
    )

    const loadAdmins = async () => {
      try {
        isLoading.value = true
        admins.value = await adminRepository.getAllAdmin()
      } catch (error) {
        console.log(error)
      } finally {
        isLoading.value = false
      }
    }

    const createAdmin = async () => {
      if (!adminModel.fullName || !adminModel.email || !adminModel.password) {
        toast.init({
          message: 'Please fill in all required fields',
          color: 'danger',
        })
        return
      }

      try {
        await adminRepository.createAdmin(adminModel.fullName, adminModel.email, adminModel.password)

        toast.init({
          message: 'Admin created successfully',
          color: 'success',
        })

        addAdminModal.value = false
        loadAdmins()
      } catch (error) {
        console.log(error)
        toast.init({
          message: error.response?.data?.message || 'Failed to create admin',
          color: 'danger',
        })
      }
    }

    const editItem = () => {
      admins.value = admins.value.map((admin, index) => (index === editedItemId.value ? { ...editedItem } : admin))
      isEditing.value = false
    }

    const updateAdmin = async () => {
      try {
        await adminRepository.updateAdmin(editedItemId.id, editedItem.fullName, editedItem.email)
        toast.init({
          message: 'Admin updated successfully',
          color: 'success',
        })
        loadAdmins()
      } catch (error) {
        console.log(error)
        toast.init({
          message: error.response?.data?.message || 'Failed to update admin',
          color: 'danger',
        })
      }
    }

    const openModalToEditItemById = (id) => {
      try {
        const admin = admins.value[id]
        editedItemId.id = admin.id
        editedItem.fullName = admin.fullName
        editedItem.email = admin.email
      } catch (error) {
        console.log(error)
      } finally {
        isEditing.value = true
      }
    }

    const deleteItemById = (id) => {
      admins.value.splice(id, 1)
    }

    return {
      admins,
      columns,
      filtered,
      perPage,
      currentPage,
      isLoading,
      adminPages,
      addAdminModal,
      editedAdminModel,
      isEditing,
      updateAdmin,
      adminModel,
      editedItem,
      rules,
      createAdmin,
      editItem,
      openModalToEditItemById,
      deleteItemById,
      loadAdmins,
    }
  },
  mounted() {
    this.loadAdmins()
  },
})
</script>
