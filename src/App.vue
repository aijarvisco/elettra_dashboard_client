<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useAuth } from '@clerk/vue'
import { initApiAuth } from '@/services/api'

// Initialize API auth with Clerk's getToken
const { getToken } = useAuth()
initApiAuth(async () => {
  const token = await getToken.value?.()
  return token ?? null
})
</script>

<template>
  <RouterView />
</template>
