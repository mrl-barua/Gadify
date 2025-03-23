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
              { label: 'On Evaluation', value: 'evaluation' },
              { label: 'For Correction', value: 'forCorrection' },
              { label: 'Completed', value: 'completed' },
            ]"
          />
        </div>
        <VaButton class="justify-end" @click="addSubmissionModal = !addSubmissionModal">Add Submission</VaButton>
      </div>

      <VaModal v-model="addSubmissionModal" ok-text="Save" size="large" @ok="createSubmission()">
        <h3 class="va-h3">Add New Submission</h3>
        <VaForm>
          <VaSelect v-model="editedSubmission.fileType" label="File Type" :options="['File', 'Link']" />
          <VaInput v-model="editedSubmission.proposalTitle" label="Proposal Title" />
          <VaInput v-model="editedSubmission.proposalDescription" label="Proposal Description" />
          <VaInput v-if="editedSubmission.fileType === 'Link'" v-model="editedSubmission.fileLink" label="File Link" />
          <VaFileUpload v-else v-model="submissionFile" dropzone />
        </VaForm>
      </VaModal>

      <VaDataTable
        v-if="currentTable === 'onHold'"
        class="table-crud"
        :items="onHoldSubmissions"
        :columns="columns"
        striped
        :loading="isLoading"
        :per-page="perPage"
        :current-page="onHoldCurrentPage"
        :filter="filter"
        @filtered="filteredOnHold = $event.items"
      >
        <template #bodyAppend>
          <tr>
            <td colspan="12">
              <div class="flex justify-center mt-4">
                <VaPagination v-model="onHoldCurrentPage" :pages="onHoldPages" />
              </div>
            </td>
          </tr>
        </template>
        <template #cell(proposalTitle)="{ value }">
          {{ truncateText(value, 25) }}
        </template>
        <template #cell(fileType)="{ value }">
          <VaChip v-if="value === 'File'" size="small" color="primary">
            {{ value }}
          </VaChip>
          <VaChip v-if="value === 'Link'" size="small" color="success">
            {{ value }}
          </VaChip>
        </template>
        <template #cell(submissionStatus)="{ value }">
          <VaChip size="small" color="warning">
            {{ value }}
          </VaChip>
        </template>
        <template #cell(createdAt)="{ value }">
          {{ formatDate(value) }}
        </template>
        <template #cell(actions)="{ rowIndex }">
          <VaButton
            class="ml-3"
            preset="plain"
            icon="view_timeline"
            @click="showSentDocumentForEvaluationModal(onHoldSubmissions[rowIndex])"
          />
        </template>
      </VaDataTable>

      <VaDataTable
        v-if="currentTable === 'evaluation'"
        class="table-crud"
        :items="evaluationSubmissions"
        :columns="columns"
        striped
        :loading="isLoading"
        :per-page="perPage"
        :current-page="evaluationCurrentPage"
        :filter="filteredEvaluation"
        @filtered="filtered = $event.items"
      >
        <template #bodyAppend>
          <tr>
            <td colspan="12">
              <div class="flex justify-center mt-4">
                <VaPagination v-model="evaluationCurrentPage" :pages="evaluationPages" />
              </div>
            </td>
          </tr>
        </template>
        <template #cell(proposalTitle)="{ value }">
          {{ truncateText(value, 25) }}
        </template>
        <template #cell(fileType)="{ value }">
          <VaChip v-if="value === 'File'" size="small" color="primary">
            {{ value }}
          </VaChip>
          <VaChip v-if="value === 'Link'" size="small" color="success">
            {{ value }}
          </VaChip>
        </template>
        <template #cell(submissionStatus)="{ value }">
          <VaChip size="small" color="warning">
            {{ value }}
          </VaChip>
        </template>
        <template #cell(createdAt)="{ value }">
          {{ formatDate(value) }}
        </template>
        <template #cell(actions)="{ rowIndex }">
          <VaButton
            class="ml-3"
            preset="plain"
            icon="view_timeline"
            @click="showSentDocumentForEvaluationModal(evaluationSubmissions[rowIndex])"
          />
        </template>
      </VaDataTable>

      <VaDataTable
        v-if="currentTable === 'completed'"
        class="table-crud"
        :items="completedSubmissions"
        :columns="columns"
        striped
        :loading="isLoading"
        :per-page="perPage"
        :current-page="completedCurrentPage"
        :filter="filter"
        @filtered="filteredCompleted = $event.items"
      >
        <template #bodyAppend>
          <tr>
            <td colspan="12">
              <div class="flex justify-center mt-4">
                <VaPagination v-model="completedCurrentPage" :pages="completedPages" />
              </div>
            </td>
          </tr>
        </template>
        <template #cell(proposalTitle)="{ value }">
          {{ truncateText(value, 25) }}
        </template>
        <template #cell(fileType)="{ value }">
          <VaChip v-if="value === 'File'" size="small" color="primary">
            {{ value }}
          </VaChip>
          <VaChip v-if="value === 'Link'" size="small" color="success">
            {{ value }}
          </VaChip>
        </template>
        <template #cell(submissionStatus)="{ value }">
          <VaChip size="small" color="primary">
            {{ value }}
          </VaChip>
        </template>
        <template #cell(createdAt)="{ value }">
          {{ formatDate(value) }}
        </template>
        <template #cell(actions)="{ rowIndex }">
          <VaButton
            class="ml-3"
            preset="plain"
            icon="view_timeline"
            @click="showSentDocumentForEvaluationModal(completedSubmissions[rowIndex])"
          />
        </template>
      </VaDataTable>

      <VaDataTable
        v-if="currentTable === 'forCorrection'"
        class="table-crud"
        :items="forCorrectionSubmissions"
        :columns="columns"
        striped
        :loading="isLoading"
        :per-page="perPage"
        :current-page="forCorrectionCurrentPage"
        :filter="filter"
        @filtered="filteredForCorrection = $event.items"
      >
        <template #bodyAppend>
          <tr>
            <td colspan="12">
              <div class="flex justify-center mt-4">
                <VaPagination v-model="forCorrectionCurrentPage" :pages="forCorrectionpages" />
              </div>
            </td>
          </tr>
        </template>
        <template #cell(proposalTitle)="{ value }">
          {{ truncateText(value, 25) }}
        </template>
        <template #cell(fileType)="{ value }">
          <VaChip v-if="value === 'File'" size="small" color="primary">
            {{ value }}
          </VaChip>
          <VaChip v-if="value === 'Link'" size="small" color="success">
            {{ value }}
          </VaChip>
        </template>
        <template #cell(submissionStatus)="{ value }">
          <VaChip size="small" color="danger">
            {{ value }}
          </VaChip>
        </template>
        <template #cell(createdAt)="{ value }">
          {{ formatDate(value) }}
        </template>
        <template #cell(actions)="{ rowIndex }">
          <VaButton
            class="ml-3"
            preset="plain"
            icon="view_timeline"
            @click="showSentDocumentForEvaluationModal(forCorrectionSubmissions[rowIndex])"
          />
        </template>
      </VaDataTable>

      <VaModal v-model="sentDocumentForEvaluationModal" hide-default-actions="true" size="large">
        <h3 class="va-h3">Sent Document for Evaluation</h3>
        <div class="flex flex-wrap -mx-2">
          <div class="w-full md:w-1/2 px-2 mb-4">
            <h3 class="text-lg font-semibold mb-2">Main Information</h3>
            <p class="mb-1"><span class="font-medium">Document No:</span> {{ loadedSubmission.id }}</p>
            <p class="mb-1"><span class="font-medium">Date Created:</span> {{ loadedSubmission.createdAt }}</p>
            <p class="mb-1">
              <span class="font-medium">Submission Status:</span> {{ loadedSubmission.submissionStatus }}
            </p>
          </div>
          <div class="w-full md:w-1/2 px-2 mb-4">
            <h3 class="text-lg font-semibold mb-2">Other Information</h3>
            <p class="mb-1"><span class="font-medium">Project Proposal:</span> {{ loadedSubmission.proposalTitle }}</p>

            <p class="mb-1">
              <span class="font-medium">Project Description:</span> {{ loadedSubmission.proposalDescription }}
            </p>
            <p class="mb-1"><span class="font-medium">File Type:</span> {{ loadedSubmission.fileType }}</p>
          </div>
        </div>

        <VaCardContent>
          <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between">
            <div class="flex flex-col md:flex-row gap-2 justify-start">
              <VaButtonToggle
                v-model="modalTable"
                color="background-element"
                border-color="background-element"
                :options="[{ label: 'Attachments', value: 'attachments' }]"
              />
            </div>
          </div>
        </VaCardContent>

        <div v-if="modalTable === 'attachments'">
          <VaCard>
            <VaCardContent>
              <div
                v-if="loadedSubmission && loadedSubmission.submissionFiles && loadedSubmission.submissionFiles.length"
              >
                <VaSidebarItem
                  v-for="(attachment, index) in loadedSubmission.submissionFiles"
                  :key="index"
                  :active="isActive"
                  active-color="#C0C0C0"
                  @click="downloadSubmission(attachment.resourcesLink, loadedSubmission.fileType)"
                >
                  <VaSidebarItemContent>
                    <VaIcon name="download" />
                    <VaSidebarItemTitle>
                      {{ loadedSubmission.proposalTitle }} - Attachment {{ index + 1 }}
                    </VaSidebarItemTitle>
                  </VaSidebarItemContent>
                </VaSidebarItem>
              </div>
              <div v-else>
                <p>No attachments available</p>
              </div>
            </VaCardContent>
          </VaCard>
        </div>
      </VaModal>
    </VaCardContent>
  </VaCard>
</template>

<script>
import { defineComponent } from 'vue'
import { submissionRepository } from '../../../repository/submissionRepository'
import { evaluatorsRepository } from '../../../repository/evaluatorRepository'
import { useToast } from 'vuestic-ui'
import { ref } from 'vue'
import { useJwtStore } from '../../../stores/jwtHandler'

const jwtStore = useJwtStore()
const toast = useToast()

const isVaSelectLoading = ref(false)

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
    const onHoldSubmissions = []
    const evaluationSubmissions = []
    const completedSubmissions = []
    const forCorrectionSubmissions = []

    const columns = [
      { key: 'fileType', label: 'File Type', sortable: true },
      { key: 'createdAt', label: 'Date Filed', sortable: true },
      { key: 'submissionId', label: 'Document No.', sortable: true },
      { key: 'proponent.fullName', label: 'Proponent', sortable: true },
      { key: 'proponent.department.departmentName', label: 'Department', sortable: true },
      { key: 'proposalTitle', label: 'Proposal Title', sortable: true },
      { key: 'submissionStatus', label: 'Status', sortable: true },
      { key: 'actions', label: 'Actions', width: 80 },
    ]

    return {
      submissions,
      onHoldSubmissions,
      evaluationSubmissions,
      completedSubmissions,
      forCorrectionSubmissions,
      columns,

      sentDocumentForEvaluationModal: false,
      documentRoutingLogModal: false,
      processSubmissionModal: false,
      addSubmissionModal: false,
      selectedRowIndex: null,

      loadedSubmission: {
        id: '',
        submissionId: '',
        createdAt: '',
        proposalTitle: '',
        proposalDescription: '',
        fileType: '',
        submissionFiles: '',
        submissionStatus: '',
        proponent: '',
        evaluator: '',
        remarks: '',
      },

      editedSubmission: {
        id: 0,
        submissionId: '',
        proponentId: null,
        fileType: '',
        proposalTitle: '',
        proposalDescription: '',
        submissionFiles: null,
        submissionStatus: 'OnHold',
      },

      createdSubmission: { ...defaultSubmission },
      currentTable: 'onHold',
      modalTable: 'attachments',

      EvaluatorsValue: [],
      EvaluatorOptions: [],
      AssignedEvaluator: [],
      isLoading: true,
      isVaSelectLoading,

      perPage: 10,
      onHoldCurrentPage: 1,
      evaluationCurrentPage: 1,
      completedCurrentPage: 1,
      forCorrectionCurrentPage: 1,
      filter: '',

      filteredOnHold: onHoldSubmissions,
      filteredEvaluation: evaluationSubmissions,
      filteredCompleted: completedSubmissions,
      filteredForCorrection: forCorrectionSubmissions,

      submissionFile: [],
    }
  },

  computed: {
    isNewData() {
      return Object.keys(this.createdSubmission).every((key) => !!this.createdSubmission[key])
    },
    onHoldPages() {
      return this.perPage && this.perPage !== 0
        ? Math.ceil(this.filteredOnHold.length / this.perPage)
        : this.filteredOnHold.length
    },
    evaluationPages() {
      return this.perPage && this.perPage !== 0
        ? Math.ceil(this.filteredEvaluation.length / this.perPage)
        : this.filteredEvaluation.length
    },
    completedPages() {
      return this.perPage && this.perPage !== 0
        ? Math.ceil(this.filteredCompleted.length / this.perPage)
        : this.filteredCompleted.length
    },
    forCorrectionpages() {
      return this.perPage && this.perPage !== 0
        ? Math.ceil(this.filteredForCorrection.length / this.perPage)
        : this.filteredForCorrection.length
    },
  },

  mounted() {
    this.loadSubmissions()
  },

  methods: {
    truncateText(text, length) {
      if (text.length > length) {
        return text.substring(0, length) + '...'
      }
      return text
    },

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

    deleteChip(chipId) {
      this.EvaluatorsValue = this.EvaluatorsValue.filter((v) => v !== chipId)
    },

    async processSubmission() {
      this.processSubmissionModal = true
    },

    approveSubmission() {
      this.processSubmissionModal = false
    },

    forCorrectionSubmission() {
      this.processSubmissionModal = false
    },

    closeProcessSubmissionmodal() {
      this.processSubmissionModal = false
    },

    async createSubmission() {
      try {
        let data
        if (this.editedSubmission.fileType === 'File') {
          data = await this.uploadSubmissionFile()
          this.editedSubmission.submissionFiles = data
        } else if (this.editedSubmission.fileType === 'Link') {
          this.editedSubmission.submissionFiles = [this.editedSubmission.fileLink]
        }
        this.editedSubmission.proponentId = jwtStore.getDecodedToken ? jwtStore.getDecodedToken.id : null

        await submissionRepository.createSubmission(this.editedSubmission)
        toast.init({
          message: 'Submission created successfully',
          color: 'success',
        })
        this.loadSubmissions()
      } catch (error) {
        toast.init({
          message: error.response?.data?.message || 'Failed to create submission',
          color: 'danger',
        })
        console.log('Error creating submission: ' + (error.response?.data?.message || error.message))
      } finally {
        ;(this.addSubmissionModal = false(
          (this.editedSubmission = {
            fileType: '',
            proposalTitle: '',
            proposalDescription: '',
            submissionFiles: null,
            submissionStatus: 'OnHold',
          }),
        )),
          console.log('Reset the submission form and closed modal.')
      }
    },

    async uploadSubmissionFile() {
      try {
        const data = await submissionRepository.uploadSubmissionFile(this.submissionFile)
        console.log('Uploaded submission file:', data)
        return data
      } catch (error) {
        console.error('Failed to upload submission file:', error)
      }
    },

    async assignEvaluatorToSubmission() {
      try {
        const data = await submissionRepository.assignEvaluatorToSubmission(
          this.loadedSubmission.id,
          this.EvaluatorsValue,
        )

        console.log('Assigned evaluator to submission:', data)
        toast.init({
          message: 'Evaluator assigned successfully',
          color: 'success',
        })
      } catch (error) {
        console.error('Failed to assign evaluator to submission:', error)

        toast.init({
          message: error.response?.data?.message || 'Failed to assign evaluator',
          color: 'danger',
        })
      } finally {
        this.EvaluatorsValue = []
      }
    },

    async getAssignedEvaluator(id) {
      try {
        const data = await submissionRepository.getSubmissionEvaluatorsById(id)
        this.AssignedEvaluator = data.evaluators.map((evaluator) => ({ fullName: evaluator.fullName }))
      } catch (error) {
        this.AssignedEvaluator = []
        console.error('Failed to load assigned evaluator:', error)
      }
    },

    async getEvaluators() {
      isVaSelectLoading.value = true
      try {
        const data = await evaluatorsRepository.getEvaluators()
        this.EvaluatorOptions = data.map((evaluator) => ({
          text: evaluator.fullName,
          value: evaluator.id,
        }))
      } catch (error) {
        console.error('Failed to load evaluators:', error)
      } finally {
        isVaSelectLoading.value = false
      }
    },

    async downloadSubmission(link, fileType) {
      try {
        if (fileType === 'Link') {
          window.open(link, '_blank')
          return
        } else if (fileType === 'File') {
          const data = await submissionRepository.getSubmissionFiles(link, fileType)
          console.log('Downloaded submission:', data)
        }
      } catch (error) {
        console.error('Failed to download submission:', error)
      }
    },

    showSentDocumentForEvaluationModal(item) {
      if (item) {
        this.getAssignedEvaluator(item.id)
        this.selectedRowIndex = this.submissions.findIndex((submission) => submission.id === item.id)
        this.loadedSubmission = item
        this.sentDocumentForEvaluationModal = true

        this.loadSubmissionById(item.id)
      } else {
        console.error('Item is undefined or null')
      }
    },

    async loadSubmissionById(Id) {
      try {
        const data = await submissionRepository.getSubmissionById(Id)
        this.loadedSubmission = {
          id: data.id,
          submissionId: data.submissionId,
          createdAt: new Date(data.createdAt).toLocaleString(),
          proposalTitle: data.proposalTitle,
          proposalDescription: data.proposalDescription,
          fileType: data.fileType,
          submissionFiles: data.submissionFiles,
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
      this.isLoading = true
      try {
        const data = await submissionRepository.getSubmissionByUserId(1)
        this.submissions = data
        this.onHoldSubmissions = data.filter((submission) => submission.submissionStatus === 'OnHold')
        this.evaluationSubmissions = data.filter((submission) => submission.submissionStatus === 'Evaluation')
        this.completedSubmissions = data.filter((submission) => submission.submissionStatus === 'Completed')
        this.forCorrectionSubmissions = data.filter((submission) => submission.submissionStatus === 'ForCorrection')
      } catch (error) {
        console.error('Failed to load submissions:', error)
      } finally {
        this.isLoading = false
      }
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
