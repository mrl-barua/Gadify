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
          <VaTextarea class="w-full" v-model="editedSubmission.proposalDescription" label="Proposal Description" />
          <VaInput v-if="editedSubmission.fileType === 'Link'" v-model="editedSubmission.fileLink" label="File Link" />
          <VaFileUpload v-else v-model="submissionFile" dropzone />
        </VaForm>
      </VaModal>

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
        striped
        class="table-crud"
        :items="evaluationSubmissions"
        :columns="columns"
        :loading="isLoading"
        :per-page="perPage"
        :current-page="evaluationCurrentPage"
        :filter="filter"
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
        striped
        class="table-crud"
        :items="completedSubmissions"
        :columns="columns"
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
        striped
        class="table-crud"
        :items="forCorrectionSubmissions"
        :columns="columns"
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

      <VaModal v-model="sentDocumentForEvaluationModal" hide-default-actions size="large">
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
                v-if="currentTable === 'forCorrection' || currentTable === 'evaluation'"
                v-model="modalTable"
                color="background-element"
                border-color="background-element"
                :options="[
                  { label: 'Attachments', value: 'attachments' },
                  { label: 'Remarks', value: 'remarks' },
                  { label: 'Logs', value: 'logs' },
                ]"
              />
              <VaButtonToggle
                v-else
                v-model="modalTable"
                color="background-element"
                border-color="background-element"
                :options="[
                  { label: 'Attachments', value: 'attachments' },
                  { label: 'Logs', value: 'logs' },
                ]"
              />
            </div>
          </div>
        </VaCardContent>

        <div v-if="modalTable === 'attachments'">
          <VaCard>
            <div class="flex items-center justify-between p-4">
              <VaCardTitle>Attachments</VaCardTitle>
              <VaButton
                v-if="currentTable !== 'completed' && currentTable !== 'evaluation'"
                size="medium"
                color="primary"
                @click="isAttachmentInEditingMode = !isAttachmentInEditingMode"
              >
                {{ isAttachmentInEditingMode ? 'Cancel' : 'Modify' }}
              </VaButton>
            </div>

            <VaCardContent>
              <div v-if="isAttachmentInEditingMode">
                <VaForm>
                  <VaSelect v-model="loadedSubmission.fileType" label="File Type" :options="['File', 'Link']" />

                  <VaInput v-model="loadedSubmission.proposalTitle" label="Proposal Title" />

                  <VaTextarea
                    class="w-full"
                    v-model="loadedSubmission.proposalDescription"
                    label="Proposal Description"
                  />

                  <div v-if="loadedSubmission.fileType === 'Link'">
                    <div v-for="(file, index) in loadedSubmission.submissionFiles" :key="index" class="mb-4">
                      <VaInput
                        v-model="file.resourcesLink"
                        :label="'File Link ' + (index + 1)"
                        :placeholder="'Enter link ' + (index + 1)"
                      />
                    </div>
                  </div>

                  <div v-else>
                    <VaFileUpload v-model="submissionFile" dropzone multiple />

                    <div v-if="loadedSubmission.submissionFiles?.length" class="mt-4">
                      <p class="font-semibold mb-2">Existing Files:</p>
                      <div class="flex flex-col gap-2">
                        <div
                          v-for="(file, index) in loadedSubmission.submissionFiles"
                          :key="index"
                          class="flex items-center gap-2 bg-gray-100 p-2 rounded"
                        >
                          <VaIcon name="insert_drive_file" color="primary" />
                          <span>{{ file.resourcesLink }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </VaForm>
                <div class="flex items-center justify-end p-4">
                  <VaButton size="medium" color="primary" @click="updateSubmission()"> Update </VaButton>
                </div>
              </div>
              <div v-else>
                <div v-if="loadedSubmission?.submissionFiles?.length" class="flex flex-col gap-4">
                  <div
                    v-for="(attachment, index) in loadedSubmission.submissionFiles"
                    :key="index"
                    class="flex items-center gap-3 cursor-pointer hover:bg-gray-100 p-2 rounded transition"
                    @click="downloadSubmission(attachment.resourcesLink, loadedSubmission.fileType)"
                  >
                    <VaIcon name="attach_file" color="primary" />
                    <div class="flex flex-col">
                      <p class="font-semibold">{{ loadedSubmission.proposalTitle }} - Attachment {{ index + 1 }}</p>
                      <small class="text-gray-500 truncate max-w-[250px]">
                        {{ attachment.resourcesLink }}
                      </small>
                    </div>
                  </div>
                </div>

                <div v-else class="text-center text-gray-500 py-4">No attachments available</div>
              </div>
            </VaCardContent>
          </VaCard>
        </div>

        <div v-if="modalTable === 'remarks'">
          <VaCard>
            <VaCardTitle>Submission Remarks</VaCardTitle>
            <VaCardContent>
              <div v-if="loadedSubmission?.remarks?.length" class="flex flex-col gap-4">
                <div v-for="(remark, index) in loadedSubmission.remarks" :key="index" class="flex items-start gap-3">
                  <VaIcon name="timeline" size="small" color="primary" />
                  <div class="flex flex-col">
                    <p class="font-semibold">{{ remark.remarks }}</p>
                    <small class="text-gray-500">
                      {{ formatDate(remark.timestamp) }}
                    </small>
                  </div>
                </div>
              </div>

              <div v-else class="text-center text-gray-500 py-4">No Remarks for this Submission</div>
            </VaCardContent>
          </VaCard>
        </div>

        <div v-if="modalTable === 'logs'">
          <VaCard>
            <VaCardTitle>Submission History</VaCardTitle>
            <VaCardContent>
              <div v-if="loadedSubmission?.submissionHistory?.length" class="flex flex-col gap-4">
                <div
                  v-for="(history, index) in loadedSubmission.submissionHistory"
                  :key="history.id"
                  class="flex items-start gap-3"
                >
                  <VaIcon name="timeline" size="small" color="primary" />
                  <div class="flex flex-col">
                    <p class="font-semibold">{{ history.description }}</p>
                    <small class="text-gray-500">
                      {{ formatDate(history.timestamp) }} — Changed by {{ history.changedBy }}
                    </small>
                  </div>
                </div>
              </div>

              <div v-else class="text-center text-gray-500 py-4">No History Logs for this Submission</div>
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
const isAttachmentInEditingMode = ref(false)

const defaultSubmission = {
  fileType: 'File',
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
        id: null,
        submissionId: null,
        createdAt: null,
        proposalTitle: null,
        proposalDescription: null,
        fileType: null,
        fileLink: null,
        submissionStatus: null,
        proponent: null,
        evaluator: null,
        remarks: [],
        submissionFiles: null,
        submissionHistory: [],
      },

      editedSubmission: {
        id: null,
        submissionId: null,
        proponentId: null,
        fileType: null,
        fileLink: null,
        proposalTitle: null,
        proposalDescription: null,
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
      isAttachmentInEditingMode,

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

  watch: {
    sentDocumentForEvaluationModal(newValue) {
      if (newValue === false) {
        this.isAttachmentInEditingMode = false
      }
    },
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
        const { fileType, fileLink } = this.editedSubmission

        if (fileType === 'File') {
          const uploadedFiles = await this.uploadSubmissionFile(this.submissionFile)
          this.editedSubmission.submissionFiles = uploadedFiles
        } else if (fileType === 'Link') {
          this.editedSubmission.submissionFiles = [fileLink]
        }

        const token = jwtStore.getDecodedToken
        this.editedSubmission.proponentId = token ? token.id : null

        await submissionRepository.createSubmission(this.editedSubmission)
        this.submissionFile = null

        toast.init({
          message: 'Submission created successfully',
          color: 'success',
        })

        this.loadSubmissions()
      } catch (error) {
        const message = error.response?.data?.message || 'Failed to create submission'

        toast.init({
          message,
          color: 'danger',
        })

        console.error('Error creating submission:', message)
      } finally {
        this.resetSubmissionForm()
        console.log('Reset the submission form and closed modal.')
      }
    },

    async updateSubmission() {
      try {
        const { fileType } = this.loadedSubmission

        if (fileType === 'File') {
          const uploadedFiles = await this.uploadSubmissionFile(this.submissionFile)

          console.log(uploadedFiles)

          this.loadedSubmission.submissionFiles = uploadedFiles.map((file) => {
            return {
              resourcesLink: file,
            }
          })
        }

        await submissionRepository.updateSubmission(
          this.loadedSubmission.id,
          this.loadedSubmission.submissionId,
          this.loadedSubmission.fileType,
          this.loadedSubmission.proposalTitle,
          this.loadedSubmission.proposalDescription,
          this.loadedSubmission.submissionStatus,
          this.loadedSubmission.submissionFiles,
          jwtStore.getUsername,
        )

        toast.init({
          message: 'Submission updated successfully',
          color: 'success',
        })

        this.sentDocumentForEvaluationModal = false

        this.loadSubmissions()
      } catch (error) {
        const message = error.response?.data?.message || 'Failed to update submission'

        toast.init({
          message,
          color: 'danger',
        })

        console.error('Error updating submission:', message)
      } finally {
        this.resetSubmissionForm()
      }
    },

    resetSubmissionForm() {
      this.addSubmissionModal = false
      this.editedSubmission = {
        fileType: 'File',
        proposalTitle: '',
        proposalDescription: '',
        submissionFiles: null,
        submissionStatus: 'OnHold',
      }
    },

    async uploadSubmissionFile(submissionFiles) {
      try {
        const data = await submissionRepository.uploadSubmissionFile(submissionFiles)
        if (!data) {
          throw new Error('No data returned from the server')
        }
        console.log('Uploaded submission file:', data)
        return data
      } catch (error) {
        console.error('Failed to upload submission file:', error)
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
          resourcesLink: data.resourcesLink,
          submissionStatus: data.submissionStatus,
          proponent: data.proponent,
          evaluator: data.evaluator,
          remarks: data.remarks,
          submissionFiles: data.submissionFiles,
          submissionHistory: data.submissionHistory,
        }
        this.sentDocumentForEvaluationModal = true
      } catch (error) {
        console.error('Failed to load submission:', error)
      }
    },

    async loadSubmissions() {
      this.isLoading = true
      try {
        const userId = jwtStore.getUserId
        const data = await submissionRepository.getSubmissionByUserId(userId)
        console.log('Loaded submissions:', data)
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
