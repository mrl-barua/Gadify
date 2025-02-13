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
        <template #cell(actions)="{ rowIndex }">
          <VaButton
            preset="plain"
            icon="view_timeline"
            @click="showSentDocumentForEvaluationModal(onHoldSubmissions[rowIndex])"
          />
          <VaButton
            preset="plain"
            icon="clear_all"
            color="danger"
            class="ml-3"
            @click="documentRoutingLogModal = !documentRoutingLogModal"
          />
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
          <VaButton
            preset="plain"
            icon="view_timeline"
            @click="showSentDocumentForEvaluationModal(evaluationSubmissions[rowIndex])"
          />
          <VaButton
            preset="plain"
            icon="clear_all"
            color="danger"
            class="ml-3"
            @click="documentRoutingLogModal = !documentRoutingLogModal"
          />
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
          <VaButton
            preset="plain"
            icon="view_timeline"
            @click="showSentDocumentForEvaluationModal(completedSubmissions[rowIndex])"
          />
          <VaButton
            preset="plain"
            icon="clear_all"
            color="danger"
            class="ml-3"
            @click="documentRoutingLogModal = !documentRoutingLogModal"
          />
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
          <VaButton
            preset="plain"
            icon="view_timeline"
            @click="showSentDocumentForEvaluationModal(forCorrection[rowIndex])"
          />
          <VaButton
            preset="plain"
            icon="clear_all"
            color="danger"
            class="ml-3"
            @click="documentRoutingLogModal = !documentRoutingLogModal"
          />
        </template>
      </VaDataTable>

      <VaModal v-model="sentDocumentForEvaluationModal" size="large">
        <h3 class="va-h3">Sent Document for Evaluation</h3>
        <div class="flex flex-wrap -mx-2">
          <div class="w-full md:w-1/2 px-2 mb-4">
            <h3 class="text-lg font-semibold mb-2">Main Information</h3>
            <p class="mb-1"><span class="font-medium">Document No:</span> {{ editedSubmission.id }}</p>
            <p class="mb-1"><span class="font-medium">Date Created:</span> {{ editedSubmission.createdAt }}</p>
          </div>
          <div class="w-full md:w-1/2 px-2 mb-4">
            <h3 class="text-lg font-semibold mb-2">Other Information</h3>
            <p class="mb-1"><span class="font-medium">Project Proposal:</span> {{ editedSubmission.proposalTitle }}</p>

            <p class="mb-1"><span class="font-medium">Project Description:</span> {{ editedSubmission.description }}</p>
            <p class="mb-1"><span class="font-medium">File Type:</span> {{ editedSubmission.fileType }}</p>
          </div>
        </div>

        <VaCardContent>
          <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between">
            <div class="flex flex-col md:flex-row gap-2 justify-start">
              <VaButtonToggle
                v-model="modalTable"
                color="background-element"
                border-color="background-element"
                :options="[
                  { label: 'Attachments', value: 'attachments' },
                  { label: 'Receiving Division', value: 'receivingDivision' },
                ]"
              />
            </div>
          </div>
        </VaCardContent>

        <div v-if="modalTable === 'attachments'">
          <VaCard>
            <VaCardContent>
              <VaSidebarItem
                :active="isActive"
                active-color="#C0C0C0"
                @click="downloadSubmission(editedSubmission.resourcesLink, editedSubmission.fileType)"
              >
                <VaSidebarItemContent class="hover-always">
                  <VaIcon name="download" />
                  <VaFlex vertical class="ml-2">
                    <VaSidebarItemTitle>
                      {{ editedSubmission.proposalTitle }}
                    </VaSidebarItemTitle>

                    <VaSidebarItemSubtitle>
                      uploaded by: {{ editedSubmission.proponent.fullName }} uploaded on:
                      {{ editedSubmission.createdAt }}
                    </VaSidebarItemSubtitle>
                  </VaFlex>
                </VaSidebarItemContent>
              </VaSidebarItem>
            </VaCardContent>
          </VaCard>
        </div>

        <div v-if="modalTable === 'receivingDivision'" @click="getEvaluators()">
          <VaCard>
            <VaCardContent>
              <VaSelect
                v-model="EvaluatorsValue"
                placeholder="Colored"
                label="Login As"
                :options="EvaluatorList"
                outer-label
              />
            </VaCardContent>
          </VaCard>
        </div>
      </VaModal>

      <VaModal v-model="documentRoutingLogModal" size="large">
        <h3 class="va-h3">Document Routing Log</h3>

        <p class="va-text">Select users to go to a party.</p>

        <VaDataTable
          :items="[
            { name: 'Marcus Claus', email: 'marcus@epicmax.co', status: 'verified', balance: '$34.15' },
            { name: 'Moo Farah', email: 'moo@epicmax.co', status: 'pending', balance: '$199.0' },
            { name: 'Stan Brass', email: 'stan@epicmax.co', status: 'blocked', balance: '$0.00' },
            { name: 'Usan Jahallah', email: 'usan@epicmax.co', status: 'verified', balance: '$23 000.00' },
          ]"
        >
          <template #cell(status)="{ rowData }">
            <VaChip
              :color="
                {
                  verified: 'primary',
                  pending: 'secondary',
                  blocked: 'danger',
                }[rowData.status]
              "
              class="va-text-uppercase"
              size="small"
              square
            >
              {{ rowData.status }}
            </VaChip>
          </template>
        </VaDataTable>
      </VaModal>
    </VaCardContent>
  </VaCard>
</template>

<script>
import { defineComponent } from 'vue'
import { submissionRepository } from '../../../repository/submissionRepository'
import { evaluatorsRepository } from '../../../repository/evaluatorRepository'

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
      sentDocumentForEvaluationModal: false,
      documentRoutingLogModal: false,
      selectedRowIndex: null,
      editedSubmission: {
        id: '',
        submissionId: '',
        createdAt: '',
        proposalTitle: '',
        proposalDescription: '',
        fileType: '',
        resourcesLink: '',
        submissionStatus: '',
        proponent: '',
        evaluator: '',
        remarks: '',
      },
      createdSubmission: { ...defaultSubmission },
      currentTable: 'onHold',
      modalTable: 'attachments',
      onHoldSubmissions: [],
      evaluationSubmissions: [],
      completedSubmissions: [],
      forCorrectionSubmissions: [],
      EvaluatorsValue: '',
      EvaluatorList: [],
    }
  },

  computed: {
    isNewData() {
      return Object.keys(this.createdSubmission).every((key) => !!this.createdSubmission[key])
    },
  },

  mounted() {
    this.loadSubmissions()
  },

  methods: {
    async getEvaluators() {
      try {
        const data = await evaluatorsRepository.getEvaluators()
        this.EvaluatorList = data.map((evaluator) => evaluator.fullName) // Extracts all names
      } catch (error) {
        console.error('Failed to load evaluators:', error)
      }
    },

    async downloadSubmission(link, fileType) {
      try {
        const data = await submissionRepository.getSubmissionFiles(link, fileType)
        console.log('Downloaded submission:', data)
      } catch (error) {
        console.error('Failed to download submission:', error)
      }
    },

    showSentDocumentForEvaluationModal(item) {
      if (item) {
        this.selectedRowIndex = this.submissions.findIndex((submission) => submission.id === item.id)
        this.editedSubmission = item
        this.sentDocumentForEvaluationModal = true

        // Ensure data is declared properly
        this.loadSubmissionById(item.id)
      } else {
        console.error('Item is undefined or null')
      }
    },

    async loadSubmissionById(Id) {
      try {
        const data = await submissionRepository.getSubmissionById(Id)
        this.editedSubmission = {
          id: data.id,
          submissionId: data.submissionId,
          createdAt: new Date(data.createdAt).toLocaleString(),
          proposalTitle: data.proposalTitle,
          proposalDescription: data.proposalDescription,
          fileType: data.fileType,
          resourcesLink: data.resourcesLink,
          submissionStatus: data.submissionStatus,
          proponent: data.proponent,
          evaluator: data.evaluator,
          remarks: data.remarks,
        }
        this.sentDocumentForEvaluationModal = true
      } catch (error) {
        console.error('Failed to load submission:', error)
      }
    },

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
        console.error('Failed to load submissions:', error)
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
