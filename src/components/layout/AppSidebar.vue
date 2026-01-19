<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useUser, useClerk } from '@clerk/vue'
import { BarChart3, MessageSquare, LogOut } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

const route = useRoute()
const { user } = useUser()
const clerk = useClerk()

const navigation = [
  { name: 'Metrics Dashboard', href: '/metrics', icon: BarChart3 },
  { name: 'Conversations Log', href: '/conversations', icon: MessageSquare },
]

const userInitials = computed(() => {
  if (!user.value) return ''
  const first = user.value.firstName?.[0] || ''
  const last = user.value.lastName?.[0] || ''
  return (first + last).toUpperCase() || user.value.primaryEmailAddress?.emailAddress?.[0]?.toUpperCase() || 'U'
})

const userImageUrl = computed(() => user.value?.imageUrl || '')
const userDisplayName = computed(() => user.value?.fullName || 'User')

const handleSignOut = () => {
  clerk.value?.signOut()
}
</script>

<template>
  <aside class="flex h-screen w-64 flex-col border-r bg-background">
    <div class="flex h-16 items-center border-b px-6">
      <h1 class="text-lg font-semibold text-foreground">ELETTRA</h1>
    </div>

    <nav class="flex-1 space-y-1 px-3 py-4">
      <RouterLink
        v-for="item in navigation"
        :key="item.name"
        :to="item.href"
        :class="cn(
          'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
          route.path === item.href
            ? 'bg-secondary text-secondary-foreground'
            : 'text-muted-foreground hover:bg-secondary hover:text-secondary-foreground'
        )"
      >
        <component :is="item.icon" class="h-5 w-5" />
        {{ item.name }}
      </RouterLink>
    </nav>

    <div class="border-t p-4">
      <div class="flex items-center gap-3">
        <Avatar class="h-9 w-9">
          <AvatarImage :src="userImageUrl" :alt="userDisplayName" />
          <AvatarFallback>{{ userInitials }}</AvatarFallback>
        </Avatar>
        <div class="flex-1 min-w-0">
          <p class="truncate text-sm font-medium text-foreground">
            {{ user?.fullName || user?.primaryEmailAddress?.emailAddress }}
          </p>
        </div>
        <Button variant="ghost" size="icon" @click="handleSignOut" title="Sign out">
          <LogOut class="h-4 w-4" />
        </Button>
      </div>
    </div>
  </aside>
</template>
