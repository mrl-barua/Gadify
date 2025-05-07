<template>
  <h1 class="page-title">Evaluation</h1>

  <VaCard>
    <VaCardContent>
      <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between">
        <div class="flex flex-col md:flex-row gap-2 justify-start">
          <VaButtonToggle
            v-model="currentTable"
            color="background-element"
            border-color="background-element"
            :options="[
              { label: 'For Evaluation', value: 'evaluation' },
              { label: 'Completed', value: 'completed' },
            ]"
          />
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
                <VaPagination
                  v-model="onHoldCurrentPage"
                  :pages="onHoldTotalPages"
                  :visible-pages="7"
                  boundary-numbers
                  direction-links
                />
              </div>
            </td>
          </tr>
        </template>
        <template #cell(submission.proposalTitle)="{ value }">
          {{ truncateText(value, 25) }}
        </template>
        <template #cell(submission.createdAt)="{ value }">
          {{ formatDate(value) }}
        </template>
        <template #cell(submission.fileType)="{ value }">
          <VaChip v-if="value === 'File'" size="small" color="primary">
            {{ value }}
          </VaChip>
          <VaChip v-if="value === 'Link'" size="small" color="success">
            {{ value }}
          </VaChip>
        </template>

        <template #cell(submission.submissionStatus)="{ value }">
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
                <VaPagination
                  v-model="evaluationCurrentPage"
                  :pages="evaluationTotalPages"
                  :visible-pages="7"
                  boundary-numbers
                  direction-links
                />
              </div>
            </td>
          </tr>
        </template>
        <template #cell(submission.proposalTitle)="{ value }">
          {{ truncateText(value, 25) }}
        </template>
        <template #cell(submission.createdAt)="{ value }">
          {{ formatDate(value) }}
        </template>
        <template #cell(submission.fileType)="{ value }">
          <VaChip v-if="value === 'File'" size="small" color="primary">
            {{ value }}
          </VaChip>
          <VaChip v-if="value === 'Link'" size="small" color="success">
            {{ value }}
          </VaChip>
        </template>
        <template #cell(submission.submissionStatus)="{ value }">
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
                <VaPagination
                  v-model="completedCurrentPage"
                  :pages="completedTotalPages"
                  :visible-pages="7"
                  boundary-numbers
                  direction-links
                />
              </div>
            </td>
          </tr>
        </template>
        <template #cell(submission.proposalTitle)="{ value }">
          {{ truncateText(value, 25) }}
        </template>
        <template #cell(submission.createdAt)="{ value }">
          {{ formatDate(value) }}
        </template>
        <template #cell(submission.fileType)="{ value }">
          <VaChip v-if="value === 'File'" size="small" color="primary">
            {{ value }}
          </VaChip>
          <VaChip v-if="value === 'Link'" size="small" color="success">
            {{ value }}
          </VaChip>
        </template>
        <template #cell(submission.submissionStatus)="{ value }">
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
                <VaPagination
                  v-model="forCorrectionCurrentPage"
                  :pages="forCorrectionTotalPages"
                  :visible-pages="7"
                  boundary-numbers
                  direction-links
                />
              </div>
            </td>
          </tr>
        </template>
        <template #cell(submission.proposalTitle)="{ value }">
          {{ truncateText(value, 25) }}
        </template>
        <template #cell(submission.createdAt)="{ value }">
          {{ formatDate(value) }}
        </template>
        <template #cell(submission.fileType)="{ value }">
          <VaChip v-if="value === 'File'" size="small" color="primary">
            {{ value }}
          </VaChip>
          <VaChip v-if="value === 'Link'" size="small" color="success">
            {{ value }}
          </VaChip>
        </template>
        <template #cell(submission.submissionStatus)="{ value }">
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
                v-model="modalTable"
                color="background-element"
                border-color="background-element"
                :options="filteredOptions"
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

        <div v-if="modalTable === 'submissionEvaluation'" @click="getEvaluators()">
          <VaCard>
            <VaCardContent>
              <section>
                <h4 class="va-h6 mb-3">Evaluation</h4>
                <VaDivider />
                <VaForm ref="form" class="flex flex-col gap-2 mb-2" @submit.prevent="submitEvaluation">
                  <section class="1.0 mb-3">
                    <div class="mb-3 va-text-bold">1.0 Involvement of women and men(max score: 2; 1 for each item)</div>
                  </section>
                  <section class="1.1 mb-3">
                    <div class="mb-3">
                      1.1 Participation of women and men in beneficiary groups in problem identification (possible
                      scores: 0, 0.5, 1.0)<span style="color: red"> *</span>
                    </div>

                    <VaRadio
                      v-model="submissionEvaluation.genderAssessments[1].selectedOption"
                      class="mb-3"
                      :rules="[rules.required]"
                      :options="['No', 'Partly', 'Yes']"
                      @update:modelValue="updateGenderAssessment(1, $event)"
                    >
                    </VaRadio>

                    <div class="mb-3">Score</div>

                    <VaInput
                      v-model="submissionEvaluation.genderAssessments[1].comments"
                      label="Comment"
                      name="Comment"
                    />
                  </section>

                  <section class="1.2 mb-3">
                    <div class="mb-3">
                      1.2 Participation of women and men in beneficiary groups in project design (possible scores: 0,
                      0.5, 1.0)<span style="color: red"> *</span>
                    </div>

                    <VaRadio
                      v-model="submissionEvaluation.genderAssessments[2].selectedOption"
                      class="mb-3"
                      :rules="[rules.required]"
                      :options="['No', 'Partly', 'Yes']"
                      @update:modelValue="updateGenderAssessment(2, $event)"
                    />
                    <div class="mb-3">Score</div>
                    <VaInput
                      v-model="submissionEvaluation.genderAssessments[2].comments"
                      label="Comment"
                      name="Comment"
                    />
                  </section>
                  <VaDivider />
                  <section class="2.0 mb-3">
                    <div class="mb-3 va-text-bold">
                      2.0 Collection of sex-disaggregated data and gender-related information (possible scores: 0, 1.0,
                      2.0)<span style="color: red"> *</span>
                    </div>

                    <VaRadio
                      v-model="submissionEvaluation.genderAssessments[3].selectedOption"
                      class="mb-3"
                      :rules="[rules.required]"
                      :options="['No', 'Partly', 'Yes']"
                      @update:modelValue="updateGenderAssessment(3, $event)"
                    />
                    <div class="mb-3">Score</div>
                    <VaInput
                      v-model="submissionEvaluation.genderAssessments[3].comments"
                      label="Comment"
                      name="Comment"
                    />
                  </section>
                  <VaDivider />
                  <section class="3.0 mb-3">
                    <div class="mb-3 va-text-bold">
                      3.0 Conduct of gender analysis and identification of gender issues (max score: 2; 1 for each item)
                    </div>
                  </section>
                  <section class="3.1 mb-3">
                    <div class="mb-3">
                      3.1 Analysis of gender gaps and inequalities related to gender roles, perspectives and needs, or
                      access to and control of resources (possible scores: 0, 0.5, 1.0)<span style="color: red">
                        *</span
                      >
                    </div>

                    <VaRadio
                      v-model="submissionEvaluation.genderAssessments[5].selectedOption"
                      class="mb-3"
                      :rules="[rules.required]"
                      :options="['No', 'Partly', 'Yes']"
                      @update:modelValue="updateGenderAssessment(5, $event)"
                    />
                    <div class="mb-3">Score</div>
                    <VaInput
                      v-model="submissionEvaluation.genderAssessments[5].comments"
                      label="Comment"
                      name="Comment"
                    />
                  </section>
                  <VaDivider />
                  <section class="3.2 mb-3">
                    <div class="mb-3">
                      3.2 Analysis of constraints and opportunities related to women and men’s participation in the
                      project (possible scores: 0, 0.5, 1.0)<span style="color: red"> *</span>
                    </div>

                    <VaRadio
                      v-model="submissionEvaluation.genderAssessments[6].selectedOption"
                      class="mb-3"
                      :rules="[rules.required]"
                      :options="['No', 'Partly', 'Yes']"
                      @update:modelValue="updateGenderAssessment(6, $event)"
                    />
                    <div class="mb-3">Score</div>
                    <VaInput
                      v-model="submissionEvaluation.genderAssessments[6].comments"
                      label="Comment"
                      name="Comment"
                    />
                  </section>
                  <VaDivider />
                  <section class="4.0 mb-3">
                    <div class="mb-3 va-text-bold">
                      4.0 Gender equality goals, outcomes, and outputs (possible scores: 0, 1.0, 2.0) - Does the project
                      have clearly stated gender equality goals, objectives, outcomes, or outputs?<span
                        style="color: red"
                      >
                        *</span
                      >
                    </div>

                    <VaRadio
                      v-model="submissionEvaluation.genderAssessments[7].selectedOption"
                      class="mb-3"
                      :rules="[rules.required]"
                      :options="['No', 'Partly', 'Yes']"
                      @update:modelValue="updateGenderAssessment(7, $event)"
                    />
                    <div class="mb-3">Score</div>
                    <VaInput
                      v-model="submissionEvaluation.genderAssessments[7].comments"
                      label="Comment"
                      name="Comment"
                    />
                  </section>
                  <VaDivider />
                  <section class="1.0 mb-3">
                    <div class="mb-3 va-text-bold">
                      5.0 Matching of strategies with gender issues (possible scores: 0, 1.0, 2.0) - Do the strategies
                      and activities match the gender issues and gender equality goals identified?<span
                        style="color: red"
                      >
                        *</span
                      >
                    </div>

                    <VaRadio
                      v-model="submissionEvaluation.genderAssessments[8].selectedOption"
                      class="mb-3"
                      :rules="[rules.required]"
                      :options="['No', 'Partly', 'Yes']"
                      @update:modelValue="updateGenderAssessment(8, $event)"
                    />
                    <div class="mb-3">Score</div>
                    <VaInput
                      v-model="submissionEvaluation.genderAssessments[8].comments"
                      label="Comment"
                      name="Comment"
                    />
                  </section>
                  <VaDivider />
                  <section class="6.0 mb-3">
                    <div class="mb-3 va-text-bold">
                      6.0 Gender analysis of likely impacts of the project (max score: 2; for each item or question,
                      0.67)
                    </div>
                  </section>

                  <section class="6.1 mb-3">
                    <div class="mb-3">
                      6.1 Are women and girl children among the direct or indirect beneficiaries? (Possible scores: 0,
                      0.33, 0.67)<span style="color: red"> *</span>
                    </div>

                    <VaRadio
                      v-model="submissionEvaluation.genderAssessments[10].selectedOption"
                      class="mb-3"
                      :rules="[rules.required]"
                      :options="['No', 'Partly', 'Yes']"
                      @update:modelValue="updateGenderAssessment(10, $event)"
                    />
                    <div class="mb-3">Score</div>
                    <VaInput
                      v-model="submissionEvaluation.genderAssessments[10].comments"
                      label="Comment"
                      name="Comment"
                    />
                  </section>
                  <VaDivider />
                  <section class="6.2 mb-3">
                    <div class="mb-3">
                      6.2 Has the project considered its long-term impact on women’s socioeconomic status and
                      empowerment? (Possible scores: 0, 0.33, 0.67)<span style="color: red"> *</span>
                    </div>

                    <VaRadio
                      v-model="submissionEvaluation.genderAssessments[11].selectedOption"
                      class="mb-3"
                      :rules="[rules.required]"
                      :options="['No', 'Partly', 'Yes']"
                      @update:modelValue="updateGenderAssessment(11, $event)"
                    />
                    <div class="mb-3">Score</div>
                    <VaInput
                      v-model="submissionEvaluation.genderAssessments[11].comments"
                      label="Comment"
                      name="Comment"
                    />
                  </section>
                  <VaDivider />
                  <section class="6.3 mb-3">
                    <div class="mb-3">
                      6.3 Has the project included strategies for avoiding or minimizing negative impact on women’s
                      status and welfare? (Possible scores: 0, 0.33, 0.67)<span style="color: red"> *</span>
                    </div>

                    <VaRadio
                      v-model="submissionEvaluation.genderAssessments[12].selectedOption"
                      class="mb-3"
                      :rules="[rules.required]"
                      :options="['No', 'Partly', 'Yes']"
                      @update:modelValue="updateGenderAssessment(12, $event)"
                    />
                    <div class="mb-3">Score</div>
                    <VaInput
                      v-model="submissionEvaluation.genderAssessments[12].comments"
                      label="Comment"
                      name="Comment"
                    />
                  </section>
                  <VaDivider />
                  <section class="7.0 mb-3">
                    <div class="mb-3 va-text-bold">
                      7.0 Monitoring targets and indicators (possible scores: 0, 1.0, 2.0)<span style="color: red">
                        *</span
                      >
                    </div>

                    <VaRadio
                      v-model="submissionEvaluation.genderAssessments[13].selectedOption"
                      class="mb-3"
                      :rules="[rules.required]"
                      :options="['No', 'Partly', 'Yes']"
                      @update:modelValue="updateGenderAssessment(13, $event)"
                    />
                    <div class="mb-3">Score</div>
                    <VaInput
                      v-model="submissionEvaluation.genderAssessments[13].comments"
                      label="Comment"
                      name="Comment"
                    />
                  </section>
                  <VaDivider />
                  <section class="8.0 mb-3">
                    <div class="mb-3 va-text-bold">
                      8.0 Sex-disaggregated database requirement (possible scores: 0, 1.0, 2.0)<span style="color: red">
                        *</span
                      >
                    </div>

                    <VaRadio
                      v-model="submissionEvaluation.genderAssessments[14].selectedOption"
                      class="mb-3"
                      :rules="[rules.required]"
                      :options="['No', 'Partly', 'Yes']"
                      @update:modelValue="updateGenderAssessment(14, $event)"
                    />
                    <div class="mb-3">Score</div>
                    <VaInput
                      v-model="submissionEvaluation.genderAssessments[14].comments"
                      label="Comment"
                      name="Comment"
                    />
                  </section>
                  <VaDivider />
                  <section class="9.0 mb-3">
                    <div class="mb-3 va-text-bold">9.0 Resources (max score: 2; for each question, 1)</div>
                  </section>

                  <section class="9.1 mb-3">
                    <div class="mb-3">
                      9.1 Is the project’s budget allotment sufficient for gender equality promotion or integration? OR
                      will the project tap counterpart funds from LGUs/partners for its GAD efforts? (Possible scores:
                      0, 0.5, 1.0)<span style="color: red"> *</span>
                    </div>

                    <VaRadio
                      v-model="submissionEvaluation.genderAssessments[16].selectedOption"
                      class="mb-3"
                      :rules="[rules.required]"
                      :options="['No', 'Partly', 'Yes']"
                      @update:modelValue="updateGenderAssessment(16, $event)"
                    />
                    <div class="mb-3">Score</div>
                    <VaInput
                      v-model="submissionEvaluation.genderAssessments[16].comments"
                      label="Comment"
                      name="Comment"
                    />
                  </section>
                  <VaDivider />
                  <section class="9.2 mb-3">
                    <div class="mb-3">
                      9.2 Does the project have the expertise in promoting gender equality and women’s empowerment? OR
                      does the project commit itself to investing project staff time in building capacities within the
                      project to integrate GAD or promote gender equality? (Possible scores: 0, 0.5, 1.0)<span
                        style="color: red"
                      >
                        *</span
                      >
                    </div>

                    <VaRadio
                      v-model="submissionEvaluation.genderAssessments[17].selectedOption"
                      class="mb-3"
                      :rules="[rules.required]"
                      :options="['No', 'Partly', 'Yes']"
                      @update:modelValue="updateGenderAssessment(17, $event)"
                    />
                    <div class="mb-3">Score</div>
                    <VaInput
                      v-model="submissionEvaluation.genderAssessments[17].comments"
                      label="Comment"
                      name="Comment"
                    />
                  </section>
                  <VaDivider />
                  <section class="10.0 mb-3">
                    <div class="mb-3 va-text-bold">
                      10.0 Relationship with the agency’s GAD efforts (max score: 2; for each question or item, 0.67"
                    </div>
                  </section>
                  <section class="10.1 mb-3">
                    <div class="mb-3">
                      10.1 Will the project build on or strengthen the agency/ NCRFW/ government’s commitment to the
                      empowerment of women? (Possible scores: 0, 0.33, 0.67) IF THE AGENCY HAS NO GAD PLAN: Will the
                      project help in the formulation of the implementing agency’s GAD plan?<span style="color: red">
                        *</span
                      >
                    </div>

                    <VaRadio
                      v-model="submissionEvaluation.genderAssessments[19].selectedOption"
                      class="mb-3"
                      :rules="[rules.required]"
                      :options="['No', 'Partly', 'Yes']"
                      @update:modelValue="updateGenderAssessment(19, $event)"
                    />
                    <div class="mb-3">Score</div>
                    <VaInput
                      v-model="submissionEvaluation.genderAssessments[19].comments"
                      label="Comment"
                      name="Comment"
                    />
                  </section>
                  <VaDivider />
                  <section class="10.2 mb-3">
                    <div class="mb-3">
                      10.2 Will the project build on the initiatives or actions of other organizations in the area?
                      (Possible scores: 0, 0.33, 0.67)<span style="color: red"> *</span>
                    </div>

                    <VaRadio
                      v-model="submissionEvaluation.genderAssessments[20].selectedOption"
                      class="mb-3"
                      :rules="[rules.required]"
                      :options="['No', 'Partly', 'Yes']"
                      @update:modelValue="updateGenderAssessment(20, $event)"
                    />
                    <div class="mb-3">Score</div>
                    <VaInput
                      v-model="submissionEvaluation.genderAssessments[20].comments"
                      label="Comment"
                      name="Comment"
                    />
                  </section>
                  <VaDivider />
                  <section class="10.3 mb-3">
                    <div class="mb-3">
                      10.3 Does the project have an exit plan that will ensure the sustainability of GAD efforts and
                      benefits? (Possible scores: 0, 0.33, 0.67)<span style="color: red"> *</span>
                    </div>

                    <VaRadio
                      v-model="submissionEvaluation.genderAssessments[21].selectedOption"
                      class="mb-3"
                      :rules="[rules.required]"
                      :options="['No', 'Partly', 'Yes']"
                      @update:modelValue="updateGenderAssessment(21, $event)"
                    />
                    <div class="mb-3">Score</div>
                    <VaInput
                      v-model="submissionEvaluation.genderAssessments[21].comments"
                      label="Comment"
                      name="Comment"
                    />
                  </section>
                </VaForm>
                <VaButton color="primary" @click="submitEvaluation()">Submit Evaluation</VaButton>
              </section>
            </VaCardContent>
          </VaCard>
        </div>
      </VaModal>
    </VaCardContent>
  </VaCard>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import { useForm } from 'vuestic-ui'
import { evaluatorsRepository } from '../../../repository/evaluatorRepository'
import { submissionRepository } from '../../../repository/submissionRepository'
import { useToast } from 'vuestic-ui'
import { useJwtStore } from '../../../stores/jwtHandler'

const toast = useToast()
const jwtStore = useJwtStore()

export default {
  setup() {
    const { validate } = useForm('form')
    const submissions = ref([])
    const onHoldSubmissions = ref([])
    const evaluationSubmissions = ref([])
    const completedSubmissions = ref([])
    const forCorrectionSubmissions = ref([])

    const EvaluatorsValue = ref([])
    const EvaluatorOptions = ref([])
    const AssignedEvaluator = ref([])

    const perPage = ref(10)
    const onHoldCurrentPage = ref(1)
    const onHoldTotalPages = ref(1)

    const evaluationCurrentPage = ref(1)
    const evaluationTotalPages = ref(1)

    const completedCurrentPage = ref(1)
    const completedTotalPages = ref(1)

    const forCorrectionCurrentPage = ref(1)
    const forCorrectionTotalPages = ref(1)
    const filter = ref('')

    const filteredOnHold = computed(() => onHoldSubmissions.value)
    const filteredEvaluation = computed(() => evaluationSubmissions.value)
    const filteredCompleted = computed(() => completedSubmissions.value)
    const filteredForCorrection = computed(() => forCorrectionSubmissions.value)

    const columns = [
      { key: 'submission.fileType', label: 'File Type', sortable: true },
      { key: 'submission.createdAt', label: 'Date Filed', sortable: true },
      { key: 'submissionId', label: 'Document No.', sortable: true },
      { key: 'submission.proponent.fullName', label: 'Proponent', sortable: true },
      { key: 'submission.proponent.department.departmentName', label: 'Department', sortable: true },
      { key: 'submission.proposalTitle', label: 'Proposal Title', sortable: true },
      { key: 'submission.submissionStatus', label: 'Status', sortable: true },
      { key: 'actions', label: 'Actions', width: 80 },
    ]
    const rules = {
      required: (value) => !!value || 'This field is required',
    }

    const sentDocumentForEvaluationModal = ref(false)
    const documentRoutingLogModal = ref(false)
    const processSubmissionModal = ref(false)
    const selectedRowIndex = ref(null)
    const isLoading = ref(true)
    const isVaSelectLoading = ref(false)

    const totalsubmissionEvaluationScore = ref(0)
    const submissionEvaluation = reactive({
      submissionId: 0,
      evaluatorId: 0,
      genderAssessments: [
        {
          sectionId: 1,
          doneNo: false,
          donePartly: false,
          doneYes: false,
          score: 0,
          comments: '',
        },
        {
          sectionId: 2,
          doneNo: false,
          donePartly: false,
          doneYes: false,
          score: 0,
          comments: '',
        },
        {
          sectionId: 3,
          doneNo: false,
          donePartly: false,
          doneYes: false,
          score: 0,
          comments: '',
        },
        {
          sectionId: 4,
          doneNo: false,
          donePartly: false,
          doneYes: false,
          score: 0,
          comments: '',
        },
        {
          sectionId: 5,
          doneNo: false,
          donePartly: false,
          doneYes: false,
          score: 0,
          comments: '',
        },
        {
          sectionId: 6,
          doneNo: false,
          donePartly: false,
          doneYes: false,
          score: 0,
          comments: '',
        },
        {
          sectionId: 7,
          doneNo: false,
          donePartly: false,
          doneYes: false,
          score: 0,
          comments: '',
        },
        {
          sectionId: 8,
          doneNo: false,
          donePartly: false,
          doneYes: false,
          score: 0,
          comments: '',
        },
        {
          sectionId: 9,
          doneNo: false,
          donePartly: false,
          doneYes: false,
          score: 0,
          comments: '',
        },
        {
          sectionId: 10,
          doneNo: false,
          donePartly: false,
          doneYes: false,
          score: 0,
          comments: '',
        },
        {
          sectionId: 11,
          doneNo: false,
          donePartly: false,
          doneYes: false,
          score: 0,
          comments: '',
        },
        {
          sectionId: 12,
          doneNo: false,
          donePartly: false,
          doneYes: false,
          score: 0,
          comments: '',
        },
        {
          sectionId: 13,
          doneNo: false,
          donePartly: false,
          doneYes: false,
          score: 0,
          comments: '',
        },
        {
          sectionId: 14,
          doneNo: false,
          donePartly: false,
          doneYes: false,
          score: 0,
          comments: '',
        },
        {
          sectionId: 15,
          doneNo: false,
          donePartly: false,
          doneYes: false,
          score: 0,
          comments: '',
        },
        {
          sectionId: 16,
          doneNo: false,
          donePartly: false,
          doneYes: false,
          score: 0,
          comments: '',
        },
        {
          sectionId: 17,
          doneNo: false,
          donePartly: false,
          doneYes: false,
          score: 0,
          comments: '',
        },
        {
          sectionId: 18,
          doneNo: false,
          donePartly: false,
          doneYes: false,
          score: 0,
          comments: '',
        },
        {
          sectionId: 19,
          doneNo: false,
          donePartly: false,
          doneYes: false,
          score: 0,
          comments: '',
        },
        {
          sectionId: 20,
          doneNo: false,
          donePartly: false,
          doneYes: false,
          score: 0,
          comments: '',
        },
        {
          sectionId: 21,
          doneNo: false,
          donePartly: false,
          doneYes: false,
          score: 0,
          comments: '',
        },
        {
          sectionId: 22,
          doneNo: false,
          donePartly: false,
          doneYes: false,
          score: 0,
          comments: '',
        },
      ],
    })

    const loadedSubmission = reactive({
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
    })

    const defaultSubmission = {
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
    }

    const createdSubmission = reactive({ ...defaultSubmission })
    const currentTable = ref('evaluation')
    const modalTable = ref('attachments')

    const filteredOptions = computed(() => {
      const options = [
        { label: 'Attachments', value: 'attachments' },
        { label: 'Remarks', value: 'remarks' },
        { label: 'Logs', value: 'logs' },
        { value: 'submissionEvaluation', label: 'Submission Evaluation' },
      ]
      return loadedSubmission.submissionStatus === 'Completed'
        ? options.filter((option) => option.value !== 'submissionEvaluation')
        : options
    })

    const isNewData = computed(() => Object.keys(createdSubmission).every((key) => !!createdSubmission[key]))

    const evaluationPages = computed(() => {
      return perPage.value && perPage.value !== 0
        ? Math.ceil(filteredEvaluation.value.length / perPage.value)
        : filteredEvaluation.value.length
    })

    const completedPages = computed(() => {
      return perPage.value && perPage.value !== 0
        ? Math.ceil(filteredCompleted.value.length / perPage.value)
        : filteredCompleted.value.length
    })

    const updateGenderAssessment = (index, value) => {
      const section = submissionEvaluation.genderAssessments[index]
      section.doneNo = section.donePartly = section.doneYes = false

      if (value === 'No') section.doneNo = true
      else if (value === 'Partly') section.donePartly = true
      else if (value === 'Yes') section.doneYes = true
    }

    const truncateText = (text, length) => (text.length > length ? text.substring(0, length) + '...' : text)

    const formatDate = (date) => {
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
    }

    const deleteChip = (chipId) => {
      EvaluatorsValue.value = EvaluatorsValue.value.filter((v) => v !== chipId)
    }

    const processSubmission = async () => {
      processSubmissionModal.value = true
    }

    const getAssignedEvaluator = async (id) => {
      try {
        const data = await submissionRepository.getSubmissionEvaluatorsById(id)
        AssignedEvaluator.value = data.evaluators.map((evaluator) => ({
          fullName: evaluator.fullName,
        }))
      } catch (error) {
        AssignedEvaluator.value = []
        console.error('Failed to load assigned evaluator:', error)
      }
    }

    const getEvaluators = async () => {
      isVaSelectLoading.value = true
      try {
        const data = await evaluatorsRepository.getEvaluators()
        EvaluatorOptions.value = data.map((evaluator) => ({
          text: evaluator.fullName,
          value: evaluator.id,
        }))
      } catch (error) {
        console.error('Failed to load evaluators:', error)
      } finally {
        isVaSelectLoading.value = false
      }
    }

    const downloadSubmission = async (link, fileType) => {
      try {
        if (fileType === 'Link') {
          window.open(link, '_blank')
        } else if (fileType === 'File') {
          await submissionRepository.getSubmissionFiles(link, fileType)
        }
      } catch (error) {
        console.error('Failed to download submission:', error)
      }
    }

    const showSentDocumentForEvaluationModal = (item) => {
      if (item) {
        getAssignedEvaluator(item.submissionId)
        selectedRowIndex.value = submissions.value.findIndex(
          (submission) => submission.submissionId === item.submissionId,
        )
        Object.assign(loadedSubmission, item)
        sentDocumentForEvaluationModal.value = true
        loadSubmissionById(item.submissionId)
      }
    }

    const loadSubmissionById = async (id) => {
      try {
        const data = await submissionRepository.getSubmissionById(id)
        Object.assign(loadedSubmission, {
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
        })
        sentDocumentForEvaluationModal.value = true
      } catch (error) {
        console.error('Failed to load submission:', error)
      }
    }

    const loadSubmissionsToBeEvaluated = async () => {
      isLoading.value = true
      try {
        const evaluatorId = jwtStore.getUserId
        const data = await evaluatorsRepository.getSubmissionToBeEvaluatedByEvaluatorId(evaluatorId)
        submissions.value = data
        onHoldSubmissions.value = data.filter((item) => item.submission.submissionStatus === 'OnHold')
        evaluationSubmissions.value = data.filter((item) => item.submission.submissionStatus === 'Evaluation')
        completedSubmissions.value = data.filter((item) => item.submission.submissionStatus === 'Completed')
        forCorrectionSubmissions.value = data.filter((item) => item.submission.submissionStatus === 'ForCorrection')
      } catch (error) {
        console.error('Failed to load submissions:', error)
      } finally {
        isLoading.value = false
      }
    }

    const submitEvaluation = async () => {
      const isValid = await validate()
      if (!isValid) {
        toast.init({
          message: 'Please fill in all required fields.',
          color: 'danger',
        })
        return
      }
      if (isValid) {
        try {
          calculateGenderAssessment()
          await evaluatorsRepository.evaluateSubmission(
            loadedSubmission.id,
            jwtStore.getUserId,
            submissionEvaluation.genderAssessments,
          )

          await submissionRepository.updateSubmissionTotalScore(
            loadedSubmission.id,
            totalsubmissionEvaluationScore.value,
          )

          toast.init({
            message: 'Evaluation submitted successfully!',
            color: 'success',
          })

          sentDocumentForEvaluationModal.value = false
          loadSubmissionsToBeEvaluated()
        } catch (error) {
          console.error('Failed to submit evaluation:', error)
          toast.init({
            message: error?.response?.data?.message || 'Failed to submit evaluation',
            color: 'danger',
          })
        }
      }
    }

    const calculateGenderAssessment = async () => {
      submissionEvaluation.genderAssessments.forEach((assessment, index) => {
        let score = 0
        switch (index) {
          case 1: // ID 2: 1.1 Participation of women and men in beneficiary groups in problem identification (possible scores: 0, 0.5, 1.0)
          case 2: // ID 3: 1.2 Participation of women and men in beneficiary groups in project design (possible scores: 0, 0.5, 1.0)
          case 5: // ID 6: 3.1 Analysis of gender gaps and inequalities related to gender roles, perspectives and needs, or access to and control of resources (possible scores: 0, 0.5, 1.0)
          case 6: // ID 7: 3.2 Analysis of constraints and opportunities related to women and men’s participation in the project (possible scores: 0, 0.5, 1.0)
          case 16: // ID 17: 9.1 Is the project’s budget allotment sufficient for gender equality promotion or integration? (possible scores: 0, 0.5, 1.0)
          case 17: // ID 18: Does the project have the expertise in promoting gender equality and women’s empowerment? (possible scores: 0, 0.5, 1.0)
            score = assessment.doneYes ? 1.0 : assessment.donePartly ? 0.5 : 0
            break
          case 3: // ID 4: 2.0 Collection of sex-disaggregated data and gender-related information (possible scores: 0, 1.0, 2.0)
          case 7: // ID 8: 4.0 Gender equality goals, outcomes, and outputs (possible scores: 0, 1.0, 2.0)
          case 8: // ID 9: 5.0 Matching of strategies with gender issues (possible scores: 0, 1.0, 2.0)
          case 13: // ID 14: 7.0 Monitoring targets and indicators (possible scores: 0, 1.0, 2.0)
          case 14: // ID 15: 8.0 Sex-disaggregated database requirement (possible scores: 0, 1.0, 2.0)
            score = assessment.doneYes ? 2.0 : assessment.donePartly ? 1.0 : 0
            break
          case 10: // ID 11: 6.1 Are women and girl children among the direct or indirect beneficiaries? (possible scores: 0, 0.33, 0.67)
          case 11: // ID 12: Has the project considered its long-term impact on women’s socioeconomic status and empowerment? (possible scores: 0, 0.33, 0.67)
          case 12: // ID 13: Has the project included strategies for avoiding or minimizing negative impact on women’s status and welfare? (possible scores: 0, 0.33, 0.67)
          case 19: // ID 20: Will the project build on or strengthen the agency/ NCRFW/ government’s commitment to the empowerment of women? (possible scores: 0, 0.33, 0.67)
          case 20: // ID 21: Will the project build on the initiatives or actions of other organizations in the area? (possible scores: 0, 0.33, 0.67)
          case 21: // ID 22: Does the project have an exit plan that will ensure the sustainability of GAD efforts and benefits? (possible scores: 0, 0.33, 0.67)
            score = assessment.doneYes ? 0.67 : assessment.donePartly ? 0.33 : 0
            break
          default:
            score = 0
        }
        assessment.score = score
      })

      submissionEvaluation.genderAssessments[0].score =
        submissionEvaluation.genderAssessments[1].score + submissionEvaluation.genderAssessments[2].score

      submissionEvaluation.genderAssessments[4].score =
        submissionEvaluation.genderAssessments[5].score + submissionEvaluation.genderAssessments[6].score

      submissionEvaluation.genderAssessments[9].score = Math.min(
        submissionEvaluation.genderAssessments[10].score +
          submissionEvaluation.genderAssessments[11].score +
          submissionEvaluation.genderAssessments[12].score,
        2,
      )

      submissionEvaluation.genderAssessments[15].score =
        submissionEvaluation.genderAssessments[16].score + submissionEvaluation.genderAssessments[17].score

      submissionEvaluation.genderAssessments[18].score = Math.min(
        submissionEvaluation.genderAssessments[19].score +
          submissionEvaluation.genderAssessments[20].score +
          submissionEvaluation.genderAssessments[21].score,
        2,
      )

      totalsubmissionEvaluationScore.value =
        submissionEvaluation.genderAssessments[0].score +
        submissionEvaluation.genderAssessments[3].score +
        submissionEvaluation.genderAssessments[4].score +
        submissionEvaluation.genderAssessments[7].score +
        submissionEvaluation.genderAssessments[8].score +
        submissionEvaluation.genderAssessments[9].score +
        submissionEvaluation.genderAssessments[13].score +
        submissionEvaluation.genderAssessments[14].score +
        submissionEvaluation.genderAssessments[15].score +
        submissionEvaluation.genderAssessments[18].score
    }

    onMounted(() => {
      loadSubmissionsToBeEvaluated()
    })

    return {
      calculateGenderAssessment,
      validate,
      submissions,
      onHoldSubmissions,
      evaluationSubmissions,
      completedSubmissions,
      forCorrectionSubmissions,
      submissionEvaluation,
      columns,
      rules,
      sentDocumentForEvaluationModal,
      documentRoutingLogModal,
      processSubmissionModal,
      selectedRowIndex,
      loadedSubmission,
      createdSubmission,
      currentTable,
      modalTable,
      EvaluatorsValue,
      EvaluatorOptions,
      AssignedEvaluator,
      isLoading,
      isVaSelectLoading,
      perPage,
      onHoldCurrentPage,
      evaluationCurrentPage,
      completedCurrentPage,
      forCorrectionCurrentPage,
      filter,
      filteredOnHold,
      filteredEvaluation,
      filteredCompleted,
      filteredForCorrection,
      filteredOptions,
      isNewData,
      evaluationPages,
      completedPages,
      updateGenderAssessment,
      truncateText,
      formatDate,
      deleteChip,
      processSubmission,
      getAssignedEvaluator,
      getEvaluators,
      downloadSubmission,
      showSentDocumentForEvaluationModal,
      loadSubmissionById,
      submitEvaluation,
    }
  },
}
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
