<template>
  <h1 class="page-title">Proponents</h1>

  <VaCard>
    <VaCardContent>
      <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between">
        <div class="flex flex-col md:flex-row gap-2 justify-start">
          <VaButtonToggle
            v-model="currentTable"
            color="background-element"
            border-color="background-element"
            :options="[
              { label: 'Pending', value: 'pending' },
              { label: 'Approved', value: 'approved' },
              { label: 'Disapproved', value: 'disapproved' },
            ]"
          />
        </div>
        <div class="flex flex-col md:flex-row gap-2 justify-end">
          <VaInput v-model="input" placeholder="Filter..." class="w-full" />
        </div>
      </div>
      <VaDataTable
        v-if="currentTable === 'pending'"
        class="table-crud"
        :items="pendingProponents"
        :columns="columns"
        :loading="isLoading"
        :current-page="pendingCurrentPage"
        :filter="filter"
        :filter-method="customFilteringFn"
        striped
        @filtered="filteredCount = $event.items.length"
      >
        <template #bodyAppend>
          <tr>
            <td colspan="12">
              <div class="flex justify-center mt-4">
                <VaPagination
                  v-model="pendingCurrentPage"
                  :pages="pendingProponentTotalPages"
                  :visible-pages="7"
                  boundary-numbers
                  direction-links
                />
              </div>
            </td>
          </tr>
        </template>
        <template #cell(createdAt)="{ value }">
          {{ formatDate(value) }}
        </template>
        <template #cell(proponentStatus)="{ value }">
          <VaChip size="small" color="warning">
            {{ value }}
          </VaChip>
        </template>
        <template #cell(actions)="{ rowIndex }">
          <VaButton preset="plain" icon="check" @click="showApproveModal(pendingProponents[rowIndex])" />
          <VaButton
            preset="plain"
            icon="close"
            color="danger"
            class="ml-3"
            @click="showRejectModal(pendingProponents[rowIndex])"
          />
          <VaModal v-model="approveModal" ok-text="Approve" @ok="approvedProponent(selectedRowIndex)">
            <h3 class="va-h3">Approve Proponent</h3>
            <p>Are you sure you want to approve this proponent?</p>
          </VaModal>
          <VaModal v-model="rejectModal" ok-text="Reject" @ok="rejectProponent(selectedRowIndex)">
            <h3 class="va-h3">Reject Proponent</h3>
            <p>Are you sure you want to reject this proponent?</p>
          </VaModal>
        </template>
      </VaDataTable>

      <VaDataTable
        striped
        v-if="currentTable === 'approved'"
        class="table-crud"
        :items="approvedProponents"
        :columns="columns"
        :loading="isLoading"
        :filter="filter"
        :filter-method="customFilteringFn"
        @filtered="filteredCount = $event.items.length"
        ><template #bodyAppend>
          <tr>
            <td colspan="12">
              <div class="flex justify-center mt-4">
                <VaPagination
                  v-model="approvedCurrentPage"
                  :pages="approvedProponentTotalPages"
                  :visible-pages="7"
                  boundary-numbers
                  direction-links
                />
              </div>
            </td>
          </tr>
        </template>
        <template #cell(createdAt)="{ value }">
          {{ formatDate(value) }}
        </template>
        <template #cell(proponentStatus)="{ value }">
          <VaChip size="small" color="primary">
            {{ value }}
          </VaChip>
        </template>

        <template #cell(actions)="{ rowIndex }">
          <VaButton
            preset="plain"
            icon="close"
            color="danger"
            class="ml-3"
            @click="showRejectModal(approvedProponents[rowIndex])"
          />
          <VaModal v-model="rejectModal" ok-text="Reject" @ok="rejectProponent(selectedRowIndex)">
            <h3 class="va-h3">Reject Proponent</h3>
            <p>Are you sure you want to reject this proponent?</p>
          </VaModal>
        </template>
      </VaDataTable>

      <VaDataTable
        v-if="currentTable === 'disapproved'"
        class="table-crud"
        :items="disapprovedProponents"
        :columns="columns"
        striped
        :loading="isLoading"
        :filter="filter"
        :filter-method="customFilteringFn"
        @filtered="filteredCount = $event.items.length"
        ><template #bodyAppend>
          <tr>
            <td colspan="12">
              <div class="flex justify-center mt-4">
                <VaPagination
                  v-model="disapprovedCurrentPage"
                  :pages="disapprovedProponentTotalPages"
                  :visible-pages="7"
                  boundary-numbers
                  direction-links
                />
              </div>
            </td>
          </tr>
        </template>
        <template #cell(createdAt)="{ value }">
          {{ formatDate(value) }}
        </template>
        <template #cell(proponentStatus)="{ value }">
          <VaChip size="small" color="danger">
            {{ value }}
          </VaChip>
        </template>
        <template #cell(actions)="{ rowIndex }">
          <VaButton preset="plain" icon="check" @click="showApproveModal(disapprovedProponents[rowIndex])" />
          <VaModal v-model="approveModal" ok-text="Approve" @ok="approvedProponent(selectedRowIndex)">
            <h3 class="va-h3">Approve Proponent</h3>
            <p>Are you sure you want to approve this proponent?</p>
          </VaModal>
        </template>
      </VaDataTable>
    </VaCardContent>
  </VaCard>
</template>

<script>
import { defineComponent, ref } from 'vue'
import debounce from 'lodash/debounce.js'
import { proponentsRepository } from '../../../repository/proponentsRepository'
import { useToast } from 'vuestic-ui'
const { init } = useToast()

const defaultProponent = {
  proponentId: '',
  departmentId: '',
  proponentType: '',
  proponentStatus: '',
  fullName: '',
  email: '',
  createdAt: '',
}

export default defineComponent({
  data() {
    const proponents = []
    const pendingProponents = []
    const approvedProponents = []
    const disapprovedProponents = []

    const columns = [
      { key: 'actions', label: 'Actions', width: 80 },
      { key: 'proponentId', label: 'Proponent ID', sortable: true },
      { key: 'proponentType', label: 'Proponent Type', sortable: true },
      { key: 'proponentStatus', label: 'Proponent Status', sortable: true },
      { key: 'fullName', label: 'Full Name', sortable: true },
      { key: 'email', label: 'Email', sortable: true },
      { key: 'createdAt', label: 'Created At', sortable: true },
    ]

    const input = ''

    return {
      currentTable: 'pending',
      proponents,
      columns,
      approveModal: false,
      rejectModal: false,
      selectedRowIndex: null,
      editedProponentId: null,
      editedProponent: null,
      createdProponent: { ...defaultProponent },
      currentTable: 'pending',
      pendingProponents,
      approvedProponents,
      disapprovedProponents,
      selectedProponentId: null,
      isLoading: false,

      pendingCurrentPage: 1,
      pendingProponentTotalPages: 1,

      approvedCurrentPage: 1,
      approvedProponentTotalPages: 1,

      disapprovedCurrentPage: 1,
      disapprovedProponentTotalPages: 1,

      input,
      filter: input,
      isDebounceInput: true,
      isCustomFilteringFn: false,
      filteredCount: proponents.length,
    }
  },

  computed: {
    isNewData() {
      return Object.keys(this.createdProponent).every((key) => !!this.createdProponent[key])
    },

    customFilteringFn() {
      return this.isCustomFilteringFn ? this.filterExact : undefined
    },
  },

  watch: {
    input(newValue) {
      if (this.isDebounceInput) {
        this.debouncedUpdateFilter(newValue)
      } else {
        this.updateFilter(newValue)
      }
    },

    currentTable(newValue) {
      if (newValue === 'pending') {
        this.loadPendingProponents()
      } else if (newValue === 'approved') {
        this.loadApprovedProponents()
      } else if (newValue === 'disapproved') {
        this.loadRejectedProponents()
      }
    },

    pendingCurrentPage(newPage, oldPage) {
      if (this.currentTable === 'pending' && newPage !== oldPage) {
        this.loadPendingProponents()
      }
    },

    approvedCurrentPage(newPage, oldPage) {
      if (this.currentTable === 'pending' && newPage !== oldPage) {
        this.loadApprovedProponents()
      }
    },

    dissaprovedCurrentPage(newPage, oldPage) {
      if (this.currentTable === 'pending' && newPage !== oldPage) {
        this.loadRejectedProponents()
      }
    },
  },

  mounted() {
    this.isLoading = true
    try {
      this.loadPendingProponents()
    } catch (error) {
      console.error('Failed to load proponents:', error)
    } finally {
      this.isLoading = false
    }
  },

  beforeDestroy() {
    if (this.debouncedUpdateFilter) {
      this.debouncedUpdateFilter.cancel()
    }
  },

  methods: {
    filterExact(source) {
      if (this.filter === '') {
        return true
      }
      return source?.toString?.() === this.filter
    },

    updateFilter(filter) {
      this.filter = filter
    },

    debouncedUpdateFilter: debounce(function (filter) {
      this.updateFilter(filter)
      const shouldResetPage = filter !== this.lastUsedFilter
      if (this.currentTable === 'pending') {
        if (shouldResetPage) this.pendingCurrentPage = 1
        this.loadPendingProponents()
      } else if (this.currentTable === 'approved') {
        if (shouldResetPage) this.approvedCurrentPage = 1
        this.loadApprovedProponents()
      } else if (this.currentTable === 'disapproved') {
        if (shouldResetPage) this.disapprovedCurrentPage = 1
        this.loadRejectedProponents()
      }
      this.lastUsedFilter = filter
    }, 600),

    formatDate(date) {
      if (!date) return 'N/A'
      return new Date(date).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      })
    },

    async loadPendingProponents() {
      this.isLoading = true
      try {
        const currentPage = this.pendingCurrentPage || 1
        const data = await proponentsRepository.getPendingProponents(currentPage, this.filter)
        this.pendingProponents = data.Proponents
        this.pendingCurrentPage = data.CurrentPage
        this.pendingProponentTotalPages = data.TotalPages
      } catch (error) {
        console.error('Failed to load proponents:', error)
      } finally {
        this.isLoading = false
      }
    },

    async loadApprovedProponents() {
      this.isLoading = true
      try {
        const currentPage = this.approvedCurrentPage || 1
        const data = await proponentsRepository.getApprovedProponents(currentPage, this.filter)
        this.approvedProponents = data.Proponents
        this.approvedCurrentPage = data.CurrentPage
        this.approvedProponentTotalPages = data.TotalPages
      } catch (error) {
        console.error('Failed t o load proponents:', error)
      } finally {
        this.isLoading = false
      }
    },

    async loadRejectedProponents() {
      this.isLoading = true
      try {
        const currentPage = this.approvedCurrentPage || 1
        const data = await proponentsRepository.getRejectedProponents(currentPage, this.filter)
        this.disapprovedProponents = data.Proponents
        this.dissaprovedCurrentPage = data.CurrentPage
        this.disapprovedProponentTotalPages = data.TotalPages
      } catch (error) {
        console.error('Failed t o load proponents:', error)
      } finally {
        this.isLoading = false
      }
    },

    showApproveModal(item) {
      console.log('Selected Proponent ID:', item.id)
      this.selectedProponentId = item.id
      this.approveModal = true
    },

    showRejectModal(item) {
      console.log('Selected Proponent ID:', item.id)
      this.selectedProponentId = item.id
      this.rejectModal = true
    },

    async approvedProponent() {
      this.isLoading = true
      try {
        await proponentsRepository.approveProponent(this.selectedProponentId)
        init({ message: 'Proponent has been approved', color: 'success' })
      } catch (error) {
        console.error('Failed to approve proponent:', error)
        init({ message: 'Failed to approve proponent', color: 'danger' })
      } finally {
        this.approveModal = false
        this.selectedProponentId = null
        try {
          await this.loadPendingProponents()
        } catch (error) {
          console.error('Failed to load proponents:', error)
        } finally {
          this.isLoading = false
        }
      }
    },

    async rejectProponent() {
      try {
        await proponentsRepository.rejectProponent(this.selectedProponentId)
        init({ message: 'Proponent has been rejected', color: 'success' })
      } catch (error) {
        console.error('Failed to reject proponent:', error)
        init({ message: 'Failed to reject proponent', color: 'danger' })
      } finally {
        this.rejectModal = false
        this.selectedProponentId = null
        try {
          await this.loadPendingProponents()
        } catch (error) {
          console.error('Failed to load proponents:', error)
        } finally {
          this.isLoading = false
        }
      }
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
