<template>
  <h1 class="page-title">Admin Management</h1>
  <VaCard>
    <VaCardContent>
      <div class="flex flex-col md:flex-row gap-2 mb-2 justify-end">
        <div class="flex flex-col md:flex-row gap-2 justify-end">
          <VaInput v-model="input" placeholder="Filter..." class="w-full" />
        </div>
        <VaButton @click="addAdminModal = !addAdminModal">Add Admin</VaButton>
      </div>

      <VaDataTable
        striped
        class="table-crud"
        :items="admins"
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
                <VaPagination v-model="currentPage" :pages="adminPages" />
              </div>
            </td>
          </tr>
        </template>
        <template #cell(actions)="{ rowIndex }">
          <VaButton preset="plain" class="ml-3" icon="edit" @click="openModalToEditItemById(rowIndex)" />
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
      <VaModal v-model="isEditing" class="modal-crud" title="Edit Admin" size="small" hide-default-actions>
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
import { defineComponent, ref, reactive, computed, watch } from 'vue'
import debounce from 'lodash/debounce.js'
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
      id: 0,
      fullName: '',
      email: '',
    })

    const rules = {
      required: (value) => !!value || 'This field is required',
      email: (value) => /\S+@\S+\.\S+/.test(value) || 'Please enter a valid email',
      passwordStrength: (value) => value.length >= 6 || 'Password must be at least 6 characters',
      matchPassword: (value) => value === adminModel.password || 'Passwords do not match',
    }

    const admins = ref([])
    const input = ref('')
    const filter = input
    const isDebounceInput = ref(true)
    const isCustomFilteringFn = ref(false)
    const filteredCount = computed(() => admins.value.length)
    const filteredCompleted = computed(() => admins.value)
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

    const updateAdmin = async () => {
      if (!editedAdminModel.fullName || !editedAdminModel.email) {
        toast.init({
          message: 'Please fill in all required fields',
          color: 'danger',
        })
        return
      }

      try {
        await adminRepository.updateAdmin(editedAdminModel.id, editedAdminModel.fullName, editedAdminModel.email)
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
      } finally {
        isEditing.value = false
      }
    }

    const openModalToEditItemById = (id) => {
      try {
        const admin = admins.value[id]
        editedAdminModel.id = admin.id
        editedAdminModel.fullName = admin.fullName
        editedAdminModel.email = admin.email
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
      rules,
      createAdmin,
      openModalToEditItemById,
      deleteItemById,
      loadAdmins,

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
    this.loadAdmins()
  },
})
</script>
