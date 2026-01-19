<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Search, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import type { Session, PaginatedResponse } from '@/types'

interface Props {
  conversations: PaginatedResponse<Session>
  selectedId?: string
  loading?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  select: [session: Session]
  search: [query: string]
  pageChange: [page: number]
}>()

const searchInput = ref('')

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-PT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Emit search on every change (parent handles debouncing)
watch(searchInput, (newValue) => {
  emit('search', newValue)
})

const canGoPrevious = computed(() => props.conversations.page > 1)
const canGoNext = computed(() => props.conversations.page < props.conversations.totalPages)

const displayName = (session: Session) => {
  if (session.name) return session.name
  if (session.phoneNumber && session.phoneNumber !== 'Unknown') return session.phoneNumber
  if (session.email) return session.email
  return 'Unknown Contact'
}
</script>

<template>
  <div class="flex w-80 flex-col border-r bg-background h-full overflow-hidden">
    <div class="border-b p-4 shrink-0">
      <div class="relative">
        <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          v-model="searchInput"
          placeholder="Search phone or email (min 3 chars)..."
          class="pl-9"
        />
      </div>
      <p v-if="searchInput.length > 0 && searchInput.length < 3" class="mt-1 text-xs text-muted-foreground">
        Type at least 3 characters to search
      </p>
    </div>

    <div class="flex-1 overflow-hidden">
      <ScrollArea class="h-full">
        <div v-if="loading" class="space-y-2 p-2">
          <Skeleton v-for="i in 5" :key="i" class="h-20 w-full" />
        </div>
        <div v-else-if="conversations.data.length === 0" class="p-4 text-center text-muted-foreground">
          No conversations found
        </div>
        <div v-else class="space-y-1 p-2">
          <button
            v-for="session in conversations.data"
            :key="session.id"
            :class="cn(
              'w-full rounded-md p-3 text-left transition-colors',
              selectedId === session.id
                ? 'bg-secondary'
                : 'hover:bg-secondary/50'
            )"
            @click="emit('select', session)"
          >
            <div class="flex items-start justify-between gap-2">
              <div class="min-w-0 flex-1">
                <p class="truncate text-sm font-medium text-foreground">
                  {{ displayName(session) }}
                </p>
                <p v-if="session.email && session.name" class="truncate text-xs text-muted-foreground">
                  {{ session.email }}
                </p>
              </div>
              <Badge v-if="session.transferred" variant="success" class="shrink-0">
                Transferred
              </Badge>
            </div>
            <div class="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
              <span>{{ formatDate(session.startedAt) }}</span>
              <span class="text-foreground/60">{{ session.messageCount }} msgs</span>
            </div>
          </button>
        </div>
      </ScrollArea>
    </div>

    <div class="flex items-center justify-between border-t p-2 shrink-0">
      <Button
        variant="ghost"
        size="sm"
        :disabled="!canGoPrevious"
        @click="emit('pageChange', conversations.page - 1)"
      >
        <ChevronLeft class="h-4 w-4" />
      </Button>
      <span class="text-sm text-muted-foreground">
        {{ conversations.page }} / {{ conversations.totalPages || 1 }}
      </span>
      <Button
        variant="ghost"
        size="sm"
        :disabled="!canGoNext"
        @click="emit('pageChange', conversations.page + 1)"
      >
        <ChevronRight class="h-4 w-4" />
      </Button>
    </div>
  </div>
</template>
