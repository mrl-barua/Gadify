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
              { label: 'For Correction', value: 'forCorrection' },
              { label: 'Completed', value: 'completed' },
            ]"
          />
        </div>
        <div class="flex flex-col md:flex-row gap-2 justify-end">
          <VaInput v-model="input" placeholder="Filter..." class="w-full" />
        </div>
      </div>

      <VaDataTable
        v-if="currentTable === 'onHold'"
        striped
        class="table-crud"
        :items="onHoldSubmissions"
        :columns="columns"
        :loading="isLoading"
        :per-page="perPage"
        :current-page="onHoldCurrentPage"
        :filter="filter"
        :filter-method="customFilteringFn"
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
        <template #cell(createdAt)="{ value }">
          {{ formatDate(value) }}
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
        striped
        class="table-crud"
        :items="evaluationSubmissions"
        :columns="columns"
        :loading="isLoading"
        :per-page="perPage"
        :current-page="evaluationCurrentPage"
        :filter="filter"
        :filter-method="customFilteringFn"
        @filtered="filteredEvaluation = $event.items"
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
        <template #cell(createdAt)="{ value }">
          {{ formatDate(value) }}
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
        striped
        class="table-crud"
        :items="completedSubmissions"
        :columns="columns"
        :loading="isLoading"
        :per-page="perPage"
        :current-page="completedCurrentPage"
        :filter="filter"
        :filter-method="customFilteringFn"
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
        <template #cell(createdAt)="{ value }">
          {{ formatDate(value) }}
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
        striped
        class="table-crud"
        :items="forCorrectionSubmissions"
        :columns="columns"
        :loading="isLoading"
        :per-page="perPage"
        :current-page="forCorrectionCurrentPage"
        :filter="filter"
        :filter-method="customFilteringFn"
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
        <template #cell(createdAt)="{ value }">
          {{ formatDate(value) }}
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

        <div v-if="modalTable === 'receivingDivision'" @click="getEvaluators()">
          <VaCard>
            <VaCardContent>
              <section>
                <h4 class="va-h6">Currently Assigned Evaluator</h4>
                <VaDataTable class="mb-3" :items="AssignedEvaluator"></VaDataTable>

                <VaSelect
                  v-model="EvaluatorsValue"
                  placeholder=""
                  label="Select Evaluator"
                  outer-label
                  selected-top-shown
                  multiple
                  track-by="value"
                  text-by="text"
                  value-by="value"
                  :options="EvaluatorOptions"
                  :loading="isVaSelectLoading"
                >
                  <template #content="{ value }">
                    <VaChip
                      v-for="v in value"
                      :key="v"
                      class="mr-2"
                      size="small"
                      closeable
                      @update:modelValue="deleteChip(v.value)"
                    >
                      {{ v.text }}
                    </VaChip>
                  </template>
                </VaSelect>

                <div class="flex justify-between mt-4 mb-2">
                  <div class="flex gap-2">
                    <VaButton
                      :loading="isButtonLoading"
                      :disabled="EvaluatorsValue.length === 0"
                      @click="assignEvaluatorToSubmission()"
                    >
                      Assign Evaluator
                    </VaButton>
                    <VaButton
                      :loading="isButtonLoading"
                      :disabled="AssignedEvaluator.length === 0"
                      @click="clearEvaluator()"
                    >
                      Clear Evaluator
                    </VaButton>
                  </div>

                  <VaButton @click="processSubmission()">Process Submission</VaButton>
                </div>
              </section>

              <VaModal v-model="processSubmissionModal" size="small" hide-default-actions>
                <h3 class="va-h3">Sent Document for Evaluation</h3>
                <template>
                  <div class="my-8">
                    <VaDivider />
                  </div>
                </template>
                <VaInput v-model="loadedSubmission.remarks" label="Remarks" placeholder="Enter remarks here" />
                <div class="mt-4">
                  <VaButton class="mr-2" color="warning" @click="forEvaluationSubmission()">For Evaluation</VaButton>
                  <VaButton class="mr-2" color="danger" @click="forCorrectionSubmission()">For Correction</VaButton>
                  <VaButton class="mr-2" color="active" @click="closeProcessSubmissionmodal()">Close</VaButton>
                </div>
              </VaModal>
            </VaCardContent>
          </VaCard>
        </div>
      </VaModal>
    </VaCardContent>
  </VaCard>
</template>

<script>
import { defineComponent, ref } from 'vue'
import debounce from 'lodash/debounce.js'
import { submissionRepository } from '../../../repository/submissionRepository'
import { evaluatorsRepository } from '../../../repository/evaluatorRepository'
import { useToast } from 'vuestic-ui'

const toast = useToast()

const isVaSelectLoading = ref(false)
const isButtonLoading = ref(false)

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
    const input = ''

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
      selectedRowIndex: null,

      loadedSubmission: {
        id: '',
        submissionId: '',
        createdAt: '',
        proposalTitle: '',
        proposalDescription: '',
        fileType: '',
        submissionStatus: '',
        proponent: '',
        evaluator: '',
        remarks: '',
        submissionFiles: [],
      },

      createdSubmission: { ...defaultSubmission },
      currentTable: 'onHold',
      modalTable: 'attachments',

      EvaluatorsValue: [],
      EvaluatorOptions: [],
      AssignedEvaluator: [],
      isLoading: true,
      isVaSelectLoading,
      isButtonLoading,

      perPage: 10,
      onHoldCurrentPage: 1,
      evaluationCurrentPage: 1,
      completedCurrentPage: 1,
      forCorrectionCurrentPage: 1,
      filter: '',
      input,
      filter: input,
      isDebounceInput: true,
      isCustomFilteringFn: false,
      filteredCount: submissions.length,

      filteredOnHold: onHoldSubmissions,
      filteredEvaluation: evaluationSubmissions,
      filteredCompleted: completedSubmissions,
      filteredForCorrection: forCorrectionSubmissions,
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
    customFilteringFn() {
      return this.isCustomFilteringFn ? this.filterExact : undefined
    },
  },

  mounted() {
    this.loadSubmissions()
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
    }, 600),
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

    async approveSubmission() {
      try {
        const data = await submissionRepository.approveSubmission(this.loadedSubmission.id)
        toast.init({
          message: data.message,
          color: 'success',
        })
      } catch (error) {
        console.error('Failed to approve submission:', error)
        toast.init({
          message: error.response?.data?.message || 'Failed to approve submission',
          color: 'danger',
        })
      } finally {
        this.loadSubmissions()
        this.processSubmissionModal = false
      }
    },

    async forEvaluationSubmission() {
      if (this.AssignedEvaluator.length === 0) {
        toast.init({
          message: 'Cannot Evaluate Submission without Evaluator',
          color: 'warning',
        })
        return
      }
      isButtonLoading.value = true
      try {
        const data = await submissionRepository.forEvaluationSubmission(this.loadedSubmission.id)
        toast.init({
          message: data.message,
          color: 'success',
        })
      } catch (error) {
        console.error('Failed to approve submission:', error)
        toast.init({
          message: error.response?.data?.message || 'Failed to approve submission',
          color: 'danger',
        })
      } finally {
        isButtonLoading.value = false
        this.loadSubmissions()
        this.processSubmissionModal = false
        this.sentDocumentForEvaluationModal = false
      }
    },

    async forCorrectionSubmission() {
      if (this.AssignedEvaluator.length !== 0) {
        toast.init({
          message: 'Please clear the evaluator before sending for correction',
          color: 'warning',
        })
        return
      }

      isButtonLoading.value = true
      try {
        const data = await submissionRepository.forCorrectionSubmission(this.loadedSubmission.id)
        toast.init({
          message: data.message,
          color: 'success',
        })
      } catch (error) {
        console.error('Failed to approve submission:', error)
        toast.init({
          message: error.response?.data?.message || 'Failed to approve submission',
          color: 'danger',
        })
      } finally {
        isButtonLoading.value = false
        this.loadSubmissions()
        this.processSubmissionModal = false
        this.sentDocumentForEvaluationModal = false
      }
    },

    closeProcessSubmissionmodal() {
      this.processSubmissionModal = false
    },

    async clearEvaluator() {
      try {
        this.EvaluatorsValue = []
        this.AssignedEvaluator = []
        await submissionRepository.assignEvaluatorToSubmission(this.loadedSubmission.id, this.EvaluatorsValue)
        toast.init({
          message: 'Evaluators cleared successfully',
          color: 'success',
        })
      } catch (error) {
        toast.init({
          message: error.response?.data?.message || 'Failed to clear evaluators',
          color: 'danger',
        })
      } finally {
        isButtonLoading.value = false
        this.getAssignedEvaluator(this.loadedSubmission.id)
      }
    },

    async assignEvaluatorToSubmission() {
      isButtonLoading.value = true
      if (this.EvaluatorsValue.length === 0) {
        toast.init({
          message: 'Please select at least one evaluator',
          color: 'warning',
        })
        return
      }
      try {
        await submissionRepository.assignEvaluatorToSubmission(this.loadedSubmission.id, this.EvaluatorsValue)
      } catch (error) {
        toast.init({
          message: error.response?.data?.message || 'Failed to assign evaluator',
          color: 'danger',
        })
      } finally {
        isButtonLoading.value = false
        this.AssignedEvaluator = []
        this.EvaluatorsValue = []
        this.getAssignedEvaluator(this.loadedSubmission.id)
        toast.init({
          message: 'Evaluator assigned successfully',
          color: 'success',
        })
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

    async fetchSubmissionFile(link, fileType) {
      try {
        const data = await submissionRepository.getSubmissionFiles(link, fileType)
        console.log('Downloaded submission:', data)
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
          resourcesLink: data.resourcesLink,
          submissionStatus: data.submissionStatus,
          proponent: data.proponent,
          evaluator: data.evaluator,
          remarks: data.remarks,
          submissionFiles: data.submissionFiles,
        }
        this.sentDocumentForEvaluationModal = true
      } catch (error) {
        console.error('Failed to load submission:', error)
      }
    },

    async loadSubmissions() {
      this.isLoading = true
      try {
        const data = await submissionRepository.getSubmissions()
        this.submissions = data
        this.onHoldSubmissions = data
          .filter((submission) => submission.submissionStatus === 'OnHold')
          .map((submission) => ({
            ...submission,
            submissionStatus: 'On Hold',
          }))
        this.evaluationSubmissions = data.filter((submission) => submission.submissionStatus === 'Evaluation')
        this.completedSubmissions = data.filter((submission) => submission.submissionStatus === 'Completed')
        this.forCorrectionSubmissions = data
          .filter((submission) => submission.submissionStatus === 'ForCorrection')
          .map((submission) => ({
            ...submission,
            submissionStatus: 'For Correction',
          }))
      } catch (error) {
        console.error('Failed to load submissions:', error)
      } finally {
        this.isLoading = false
      }
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
