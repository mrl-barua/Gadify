<template>
  <h1 class="page-title">Manage Request</h1>

  <VaCard>
    <VaCardContent>
      <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between">
        <div class="flex flex-col md:flex-row gap-2 justify-start">
          <VaButtonToggle
            v-model="currentTable"
            color="background-element"
            border-color="background-element"
            :options="[
              { label: 'On Hold', value: 'onHold' },
              { label: 'Evaluation', value: 'evaluation' },
              { label: 'Completed', value: 'completed' },
              { label: 'For Correction', value: 'forCorrection' },
            ]"
          />
        </div>
      </div>

      <VaDataTable
        v-if="currentTable === 'onHold'"
        class="table-crud"
        :items="onHoldSubmissions"
        :columns="columns"
        striped
      >
        <template #cell(actions)>
          <VaButton preset="plain" icon="view_timeline" />
          <VaButton preset="plain" icon="clear_all" color="danger" class="ml-3" />
        </template>
      </VaDataTable>

      <VaDataTable
        v-if="currentTable === 'evaluation'"
        class="table-crud"
        :items="evaluationSubmissions"
        :columns="columns"
        striped
      >
        <template #cell(actions)="{ rowIndex }">
          <VaButton preset="plain" icon="view_timeline" />
          <VaButton preset="plain" icon="clear_all" color="danger" class="ml-3" />
        </template>
      </VaDataTable>

      <VaDataTable
        v-if="currentTable === 'completed'"
        class="table-crud"
        :items="completedSubmissions"
        :columns="columns"
        striped
      >
        <template #cell(actions)="{ rowIndex }">
          <VaButton preset="plain" icon="view_timeline" />
          <VaButton preset="plain" icon="clear_all" color="danger" class="ml-3" />
        </template>
      </VaDataTable>

      <VaDataTable
        v-if="currentTable === 'forCorrection'"
        class="table-crud"
        :items="forCorrectionSubmissions"
        :columns="columns"
        striped
      >
        <template #cell(actions)="{ rowIndex }">
          <VaButton preset="plain" icon="view_timeline" />
          <VaButton preset="plain" icon="clear_all" color="danger" class="ml-3" />
        </template>
      </VaDataTable>
    </VaCardContent>
  </VaCard>
</template>

<script>
import { defineComponent } from 'vue'
import { submissionRepository } from './repository/ManageRequestRepository'

const defaultSubmission = {
  fileType: '',
  date: '',
  docNo: '',
  submission: '',
  office: '',
  proposal: '',
  fileLink: '',
  status: '',
}

export default defineComponent({
  data() {
    const submissions = []

    const columns = [
      { key: 'fileType', label: 'File Type', sortable: true },
      { key: 'createdAt', label: 'Date Filed', sortable: true },
      { key: 'submissionId', label: 'Document No.', sortable: true },
      { key: 'submissionStatus', label: 'Proponent', sortable: true },
      { key: 'proponent.fullName', label: 'Department', sortable: true },
      { key: 'proposalTitle', label: 'Proposal Title', sortable: true },
      { key: 'resourcesLink', label: 'File Link', sortable: true },
      { key: 'submissionStatus', label: 'Status', sortable: true },

      { key: 'actions', label: 'Actions', width: 80 },
    ]

    return {
      submissions,
      columns,
      approveModal: false,
      rejectModal: false,
      selectedRowIndex: null,
      editedSubmissionId: null,
      editedSubmission: null,
      createdSubmission: { ...defaultSubmission },
      currentTable: 'onHold',
      onHoldSubmissions: [],
      evaluationSubmissions: [],
      completedSubmissions: [],
      forCorrectionSubmissions: [],
    }
  },

  mounted() {
    this.loadSubmissions()
  },

  computed: {
    isNewData() {
      return Object.keys(this.createdSubmission).every((key) => !!this.createdSubmission[key])
    },
  },

  methods: {
    async loadSubmissions() {
      try {
        const data = await submissionRepository.getSubmissions()
        this.submissions = data
        // Categorize submissions based on status using string comparison
        this.onHoldSubmissions = data.filter((submission) => submission.submissionStatus === 'OnHold')
        this.evaluationSubmissions = data.filter((submission) => submission.submissionStatus === 'Evaluation')
        this.completedSubmissions = data.filter((submission) => submission.submissionStatus === 'Completed')
        this.forCorrectionSubmissions = data.filter((submission) => submission.submissionStatus === 'ForCorrection')
      } catch (error) {
        // console.error('Failed to load submissions:', error)
      }
    },

    showApproveModal(item) {
      this.selectedRowIndex = this.submissions.findIndex((submission) => submission.submissionId === item.submissionId)
      this.approveModal = true
    },

    showRejectModal(item) {
      this.selectedRowIndex = this.submissions.findIndex((submission) => submission.submissionId === item.submissionId)
      this.rejectModal = true
    },

    async approveSubmission() {
      if (this.selectedRowIndex !== null) {
        // const item = this.submissions[this.selectedRowIndex]
        // await submissionsRepository.approveSubmission(item.id)
        this.approveModal = false
        this.loadSubmissions()
      }
    },
    async rejectSubmission() {
      if (this.selectedRowIndex !== null) {
        const item = this.submissions[this.selectedRowIndex]
        // await submissionsRepository.rejectSubmission(item.id)
        this.rejectModal = false
        this.loadSubmissions()
      }
    },

    reseteditedSubmission() {
      this.editedSubmission = null
      this.editedSubmissionId = null
    },
    resetcreatedSubmission() {
      this.createdSubmission = { ...defaultSubmission }
    },
    deleteItemById(id) {
      this.submissions = [...this.submissions.slice(0, id), ...this.submissions.slice(id + 1)]
    },
    addNewItem() {
      this.submissions = [...this.submissions, { ...this.createdSubmission }]
      this.resetcreatedSubmission()
    },
    editItem() {
      this.submissions = [
        ...this.submissions.slice(0, this.editedSubmissionId),
        { ...this.editedSubmission },
        ...this.submissions.slice(this.editedSubmissionId + 1),
      ]
      this.reseteditedSubmission()
    },
    openModalToEditItemById(id) {
      this.editedSubmissionId = id
      this.editedSubmission = { ...this.submissions[id] }
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
