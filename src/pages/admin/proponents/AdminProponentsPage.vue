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
      </div>

      <VaDataTable
        v-if="currentTable === 'pending'"
        class="table-crud"
        :items="pendingProponents"
        :columns="columns"
        striped
        :loading="isLoading"
      >
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
          <VaModal v-model="approveModal" ok-text="Approve" @ok="approveProponent(selectedRowIndex)">
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
        v-if="currentTable === 'approved'"
        class="table-crud"
        :items="approvedProponents"
        :columns="columns"
        striped
        :loading="isLoading"
      >
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
      >
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
          <VaModal v-model="approveModal" ok-text="Approve" @ok="approveProponent(selectedRowIndex)">
            <h3 class="va-h3">Approve Proponent</h3>
            <p>Are you sure you want to approve this proponent?</p>
          </VaModal>
        </template>
      </VaDataTable>
    </VaCardContent>
  </VaCard>
</template>

<script>
import { defineComponent } from 'vue'
import { proponentsRepository } from '../../../repository/proponentsRepository'
import { sleep } from '../../../services/utils'
import { useToast } from 'vuestic-ui'
const { init } = useToast()

const defaultProponent = {
  proponentId: '',
  departmentId: '',
  proponentType: '',
  proponentStatus: '',
  fullName: '',
  userName: '',
  email: '',
  createdAt: '',
}

export default defineComponent({
  data() {
    const proponents = []

    const columns = [
      { key: 'actions', label: 'Actions', width: 80 },
      { key: 'proponentId', label: 'Proponent ID', sortable: true },
      // { key: 'department.departmentId', label: 'Department ID', sortable: true },
      { key: 'proponentType', label: 'Proponent Type', sortable: true },
      { key: 'proponentStatus', label: 'Proponent Status', sortable: true },
      { key: 'fullName', label: 'Full Name', sortable: true },
      { key: 'userName', label: 'User Name', sortable: true },
      { key: 'email', label: 'Email', sortable: true },
      { key: 'createdAt', label: 'Created At', sortable: true },
      // { key: 'department.departmentName', label: 'Department Name', sortable: true },
      // { key: 'department.campus.campusName', label: 'Campus Name', sortable: true },
      // { key: 'department.campus.campusAddress', label: 'Campus Address', sortable: true },
    ]

    return {
      proponents,
      columns,
      approveModal: false,
      rejectModal: false,
      selectedRowIndex: null,
      editedProponentId: null,
      editedProponent: null,
      createdProponent: { ...defaultProponent },
      currentTable: 'pending',
      pendingProponents: [],
      approvedProponents: [],
      disapprovedProponents: [],
      isLoading: true,
    }
  },

  computed: {
    isNewData() {
      return Object.keys(this.createdProponent).every((key) => !!this.createdProponent[key])
    },
  },

  mounted() {
    this.loadProponents()
  },

  methods: {
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

    async loadProponents() {
      this.isLoading = true
      await sleep(1000)
      try {
        const data = await proponentsRepository.getProponents()
        this.proponents = data

        this.pendingProponents = data.filter((proponent) => proponent.proponentStatus === 'Pending')
        this.approvedProponents = data.filter((proponent) => proponent.proponentStatus === 'Approved')
        this.disapprovedProponents = data.filter((proponent) => proponent.proponentStatus === 'Rejected')
      } catch (error) {
        console.error('Failed to load proponents:', error)
        alert(error.message)
      } finally {
        this.isLoading = false
      }
    },

    showApproveModal(item) {
      this.selectedRowIndex = this.proponents.findIndex((proponent) => proponent.proponentId === item.proponentId)
      this.approveModal = true
    },

    showRejectModal(item) {
      this.selectedRowIndex = this.proponents.findIndex((proponent) => proponent.proponentId === item.proponentId)
      this.rejectModal = true
    },

    async approveProponent() {
      if (this.selectedRowIndex !== null) {
        try {
          this.isLoading = true
          init({ message: 'Proponent has been approved', color: 'success' })
          const item = this.proponents[this.selectedRowIndex]
          await proponentsRepository.approveProponent(item.id)
        } catch (error) {
          console.error('Failed to approve proponent:', error)
          init({ message: 'Failed to approve proponent', color: 'danger' })
        } finally {
          this.approveModal = false
          try {
            await this.loadProponents()
          } catch (error) {
            console.error('Failed to load proponents:', error)
          } finally {
            this.isLoading = false
          }
        }
      }
    },

    async rejectProponent() {
      if (this.selectedRowIndex !== null) {
        try {
          this.isLoading = true
          init({ message: 'Proponent has been rejected', color: 'success' })
          const item = this.proponents[this.selectedRowIndex]
          await proponentsRepository.rejectProponent(item.id)
        } catch (error) {
          console.error('Failed to reject proponent:', error)
          init({ message: 'Failed to reject proponent', color: 'danger' })
        } finally {
          this.rejectModal = false
          try {
            await this.loadProponents()
          } catch (error) {
            console.error('Failed to load proponents:', error)
          } finally {
            this.isLoading = false
          }
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
