<template>
  <h1 class="page-title">Create Document for Evaluation</h1>
  <div class="flex flex-wrap -mx-2">
    <div class="w-full md:w-1/2 px-2 mb-4">
      <h3 class="text-lg font-semibold mb-2">Main Information</h3>
      <p class="mb-1"><span class="font-medium">Document No:</span> {{ editedSubmission?.submissionId }}</p>
      <p class="mb-1"><span class="font-medium">Date Needed:</span> {{ editedSubmission?.date }}</p>
    </div>
    <div class="w-full md:w-1/2 px-2 mb-4">
      <h3 class="text-lg font-semibold mb-2">Other Information</h3>
      <p class="mb-1"><span class="font-medium">Project Proposal:</span> {{ editedSubmission?.proposal }}</p>
      <p class="mb-1"><span class="font-medium">Date Needed:</span> {{ editedSubmission?.date }}</p>
      <p class="mb-1"><span class="font-medium">Project Description:</span> {{ editedSubmission?.description }}</p>
      <p class="mb-1"><span class="font-medium">File Type:</span> {{ editedSubmission?.fileType }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Submission {
  submissionId: string
  date: string
  proposal: string
  description: string
  fileType: string
}

const editedSubmission = ref<Submission | null>(null)
</script>
