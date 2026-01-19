<script setup lang="ts">
import { PanelRightClose, PanelRightOpen } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import type { Session, Message } from '@/types'

interface Props {
  session: Session | null
  messages: Message[]
  loading?: boolean
  showVaultToggle?: boolean
  vaultOpen?: boolean
}

defineProps<Props>()
const emit = defineEmits<{
  toggleVault: []
}>()

const formatTime = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleTimeString('pt-PT', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-PT', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}
</script>

<template>
  <div class="flex flex-1 flex-col bg-background h-full overflow-hidden">
    <div v-if="session" class="flex items-center justify-between border-b px-6 py-4 shrink-0">
      <div>
        <div class="flex items-center gap-2">
          <h2 class="text-lg font-medium text-foreground">
            {{ session.name || session.phoneNumber }}
          </h2>
          <Badge v-if="session.transferred" variant="success">Transferred</Badge>
        </div>
        <p v-if="session.email" class="text-sm text-muted-foreground">{{ session.email }}</p>
        <p class="text-xs text-muted-foreground">{{ formatDate(session.startedAt) }}</p>
      </div>
      <Button
        v-if="showVaultToggle"
        variant="ghost"
        size="icon"
        @click="emit('toggleVault')"
        :title="vaultOpen ? 'Hide Knowledge Vault' : 'Show Knowledge Vault'"
      >
        <PanelRightClose v-if="vaultOpen" class="h-5 w-5" />
        <PanelRightOpen v-else class="h-5 w-5" />
      </Button>
    </div>

    <div class="flex-1 overflow-hidden">
      <ScrollArea class="h-full">
        <div class="p-6">
          <div v-if="!session" class="flex h-full items-center justify-center py-20">
            <p class="text-muted-foreground">Select a conversation to view</p>
          </div>
          <div v-else-if="loading" class="space-y-4">
            <Skeleton v-for="i in 5" :key="i" :class="cn('h-16', i % 2 === 0 ? 'ml-auto w-2/3' : 'w-2/3')" />
          </div>
          <div v-else-if="messages.length === 0" class="flex h-full items-center justify-center py-20">
            <p class="text-muted-foreground">No messages in this conversation</p>
          </div>
          <div v-else class="space-y-4">
            <div
              v-for="message in messages"
              :key="message.id"
              :class="cn(
                'max-w-[75%] rounded-lg px-4 py-3',
                message.role === 'agent'
                  ? 'bg-secondary text-secondary-foreground'
                  : 'ml-auto bg-primary text-primary-foreground'
              )"
            >
              <p class="text-sm whitespace-pre-wrap">{{ message.content }}</p>
              <p
                :class="cn(
                  'mt-1 text-xs',
                  message.role === 'agent' ? 'text-muted-foreground' : 'text-primary-foreground/70'
                )"
              >
                {{ formatTime(message.timestamp) }}
              </p>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  </div>
</template>
