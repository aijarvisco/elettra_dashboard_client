<script setup lang="ts">
import { computed } from 'vue'
import { PanelRightClose, PanelRightOpen } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import type { Contact, SessionMetadata, Message } from '@/types'

interface Props {
  contact: Contact | null
  sessions: SessionMetadata[]
  messages: Message[]
  loading?: boolean
  showVaultToggle?: boolean
  vaultOpen?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  toggleVault: []
}>()

// Group messages by session
const groupedMessages = computed(() => {
  const groups: { session: SessionMetadata; messages: Message[] }[] = []
  let currentSessionId: string | null = null
  let currentGroup: { session: SessionMetadata; messages: Message[] } | null = null

  for (const message of props.messages) {
    if (message.sessionId !== currentSessionId) {
      currentSessionId = message.sessionId
      const sessionMeta = props.sessions.find(s => s.id === message.sessionId)
      if (sessionMeta) {
        currentGroup = {
          session: sessionMeta,
          messages: []
        }
        groups.push(currentGroup)
      }
    }
    if (currentGroup) {
      currentGroup.messages.push(message)
    }
  }
  return groups
})

const formatTime = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleTimeString('pt-PT', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

const formatSessionDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-PT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<template>
  <div class="flex flex-1 flex-col bg-background h-full overflow-hidden">
    <div v-if="contact" class="flex items-center justify-between border-b px-6 py-4 shrink-0">
      <div>
        <div class="flex items-center gap-2">
          <h2 class="text-lg font-medium text-foreground">
            {{ contact.name || contact.phoneNumber }}
          </h2>
          <Badge v-if="contact.transferred" variant="success">Transferred</Badge>
        </div>
        <p v-if="contact.email" class="text-sm text-muted-foreground">{{ contact.email }}</p>
        <p class="text-xs text-muted-foreground">
          {{ contact.sessionCount }} {{ contact.sessionCount === 1 ? 'session' : 'sessions' }} · {{ contact.totalMessageCount }} messages
        </p>
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
          <div v-if="!contact" class="flex h-full items-center justify-center py-20">
            <p class="text-muted-foreground">Select a contact to view conversations</p>
          </div>
          <div v-else-if="loading" class="space-y-4">
            <Skeleton v-for="i in 5" :key="i" :class="cn('h-16', i % 2 === 0 ? 'ml-auto w-2/3' : 'w-2/3')" />
          </div>
          <div v-else-if="messages.length === 0" class="flex h-full items-center justify-center py-20">
            <p class="text-muted-foreground">No messages in this conversation</p>
          </div>
          <div v-else class="space-y-4">
            <template v-for="(group, groupIndex) in groupedMessages" :key="group.session.id">
              <!-- Session separator (WhatsApp-style) -->
              <div class="flex items-center gap-3 py-2" :class="{ 'pt-6': groupIndex > 0 }">
                <div class="flex-1 border-t border-border" />
                <div class="flex items-center gap-2 px-2">
                  <span class="text-xs text-muted-foreground whitespace-nowrap">
                    {{ formatSessionDate(group.session.createdAt) }}
                  </span>
                  <Badge v-if="group.session.transferred" variant="success" class="text-[10px] px-1.5 py-0">
                    Transferred
                  </Badge>
                </div>
                <div class="flex-1 border-t border-border" />
              </div>

              <!-- Messages in this session -->
              <div
                v-for="message in group.messages"
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
            </template>
          </div>
        </div>
      </ScrollArea>
    </div>
  </div>
</template>
