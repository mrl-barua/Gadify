<template>
  <h1 class="page-title">Manage Proponent Requests</h1>
  <VaButton preset="primary" class="mb-4" @click="addNewRequest">Add</VaButton>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const addNewRequest = () => {
  router.push({ name: 'proponent-create-document-for-evaluation' })
}
</script>
