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
        :loading="isLoading"
      >
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
        :loading="isLoading"
      >
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
        :loading="isLoading"
      >
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
        :loading="isLoading"
      >
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

            <p class="mb-1"><span class="font-medium">Project Description:</span> {{ loadedSubmission.description }}</p>
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
              <VaSidebarItem
                :active="isActive"
                active-color="#C0C0C0"
                @click="downloadSubmission(loadedSubmission.resourcesLink, loadedSubmission.fileType)"
              >
                <VaSidebarItemContent
                  ><VaIcon name="download" />
                  <VaSidebarItemTitle>
                    {{ loadedSubmission.proposalTitle }}
                  </VaSidebarItemTitle></VaSidebarItemContent
                >
              </VaSidebarItem>
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
                  :options="EvaluatorOptions"
                  outer-label
                  selected-top-shown
                  multiple
                  :loading="isVaSelectLoading"
                  track-by="value"
                  text-by="text"
                  value-by="value"
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

                <div class="flex justify-between">
                  <VaButton
                    :disabled="EvaluatorsValue.length === 0"
                    class="mt-4 mb-2"
                    @click="assignEvaluatorToSubmission()"
                  >
                    Assign Evaluator
                  </VaButton>
                  <VaButton class="mt-4 mb-2" @click="processSubmission()">Process Submission</VaButton>
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
                  <VaButton class="mr-2" color="success" @click="approveSubmission()">Approved</VaButton>
                  <VaButton class="mr-2" color="danger" @click="forCorrectionSubmission()">For Correction</VaButton>
                  <VaButton class="mr-2" color="active" @click="closeProcessSubmissionmodal()">Close Modal</VaButton>
                </div>
              </VaModal>
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
import { useToast } from 'vuestic-ui'
import { ref } from 'vue'

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
      EvaluatorsValue: [],
      EvaluatorOptions: [],
      AssignedEvaluator: [],
      isLoading: true,
      isVaSelectLoading,
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

    async assignEvaluatorToSubmission() {
      try {
        await submissionRepository.assignEvaluatorToSubmission(this.loadedSubmission.id, this.EvaluatorsValue)
      } catch (error) {
        toast.init({
          message: error.response?.data?.message || 'Failed to assign evaluator',
          color: 'danger',
        })
      } finally {
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
