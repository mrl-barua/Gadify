<template>
  <VaLayout v-if="breakpoint.lgUp" class="h-screen bg-[var(--va-background-secondary)]">
    <template #left>
      <RouterLink
        class="h-full flex items-center justify-center relative overflow-hidden"
        style="width: 60vw"
        to="/"
        aria-label="Visit homepage"
      >
        <div
          class="absolute inset-0 bg-cover bg-center bg-no-repeat backdrop-blur-lg"
          style="background-image: url('/Gadify_Background.webp')"
        />

        <div class="image-background"></div>
        <VaImage
          fit="contain"
          class="relative z-10 w-full max-w-[600px] md:max-w-[400px] lg:max-w-[600px] sharpened-image"
          src="/login_image_3.png"
        />
      </RouterLink>
    </template>

    <template #content>
      <main class="h-full flex items-center justify-center mx-auto max-w-[420px]">
        <RouterView />
      </main>
    </template>
  </VaLayout>

  <VaLayout v-else class="h-screen bg-[var(--va-background-secondary)]">
    <template #content>
      <div class="p-4">
        <main class="h-full flex flex-row items-center justify-start mx-auto max-w-[420px]">
          <div class="flex flex-col items-start">
            <RouterLink class="py-4" to="/" aria-label="Visit homepage">
              <VuesticLogo class="mb-2" start="#0E41C9" />
            </RouterLink>
            <RouterView />
          </div>
        </main>
      </div>
    </template>
  </VaLayout>
</template>

<script lang="ts" setup>
import { useBreakpoint } from 'vuestic-ui'
import VuesticLogo from '../components/GadifyLogo.vue'

const breakpoint = useBreakpoint()
</script>

<style scoped>
.sharpened-image {
  filter: brightness(1.1) contrast(1.4) saturate(2.1);
}

.image-background {
  position: absolute;
  inset: 0;
  background: linear-gradient(360deg, white 0%, rgba(34, 2, 34, 0.5) 100%);
}
</style>
