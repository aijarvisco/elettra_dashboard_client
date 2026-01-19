<script setup lang="ts">
import { SignIn, useAuth } from '@clerk/vue'
import { useRouter } from 'vue-router'
import { watch } from 'vue'

const { isSignedIn, isLoaded } = useAuth()
const router = useRouter()

watch([isSignedIn, isLoaded], ([signedIn, loaded]) => {
  if (loaded && signedIn) {
    router.push('/metrics')
  }
})
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-background">
    <div class="w-full max-w-md px-4">
      <div class="mb-8 text-center">
        <h1 class="text-3xl font-bold text-foreground">ELETTRA</h1>
        <p class="mt-2 text-muted-foreground">Assistente Virtual GoCharge</p>
      </div>
      <SignIn
        :routing="'hash'"
        :appearance="{
          elements: {
            rootBox: 'mx-auto',
            card: 'shadow-none border',
            headerTitle: 'text-foreground',
            headerSubtitle: 'text-muted-foreground',
            socialButtonsBlockButton: 'border-input',
            formFieldInput: 'border-input',
            footerActionLink: 'text-foreground hover:text-foreground/80',
          },
        }"
      />
    </div>
  </div>
</template>
