<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import DashboardLayout from '@/components/layout/DashboardLayout.vue'
import ConversationList from '@/components/conversations/ConversationList.vue'
import ChatView from '@/components/conversations/ChatView.vue'
import KnowledgeVault from '@/components/conversations/KnowledgeVault.vue'
import { conversationsApi } from '@/services/api'
import type { Session, Message, KnowledgeVaultItem, PaginatedResponse } from '@/types'

const PAGE_SIZE = 10

const conversations = ref<PaginatedResponse<Session>>({
  data: [],
  total: 0,
  page: 1,
  pageSize: PAGE_SIZE,
  totalPages: 0,
})
const selectedConversation = ref<Session | null>(null)
const messages = ref<Message[]>([])
const knowledgeVault = ref<KnowledgeVaultItem[]>([])
const showVault = ref(true)
const loading = ref(true)
const conversationLoading = ref(false)
const searchQuery = ref('')

const fetchConversations = async (page: number = 1, search?: string) => {
  try {
    loading.value = true
    if (search && search.length >= 3) {
      conversations.value = await conversationsApi.search(search, page, PAGE_SIZE)
    } else if (!search) {
      conversations.value = await conversationsApi.list(page, PAGE_SIZE)
    }
  } catch (err) {
    console.error('Failed to fetch conversations:', err)
  } finally {
    loading.value = false
  }
}

const debouncedSearch = useDebounceFn((query: string) => {
  if (query.length >= 3 || query.length === 0) {
    fetchConversations(1, query || undefined)
  }
}, 300)

const selectConversation = async (session: Session) => {
  try {
    conversationLoading.value = true
    selectedConversation.value = session
    const data = await conversationsApi.getById(session.id)
    messages.value = data.messages
    knowledgeVault.value = data.knowledgeVault
  } catch (err) {
    console.error('Failed to fetch conversation details:', err)
  } finally {
    conversationLoading.value = false
  }
}

const handleSearch = (query: string) => {
  searchQuery.value = query
  debouncedSearch(query)
}

const handlePageChange = (page: number) => {
  fetchConversations(page, searchQuery.value || undefined)
}

const toggleVault = () => {
  showVault.value = !showVault.value
}

onMounted(() => {
  fetchConversations()
})
</script>

<template>
  <DashboardLayout>
    <div class="flex h-full overflow-hidden">
      <ConversationList
        :conversations="conversations"
        :selected-id="selectedConversation?.id"
        :loading="loading"
        @select="selectConversation"
        @search="handleSearch"
        @page-change="handlePageChange"
      />

      <div class="flex flex-1 flex-col min-w-0 overflow-hidden">
        <ChatView
          :session="selectedConversation"
          :messages="messages"
          :loading="conversationLoading"
          :show-vault-toggle="true"
          :vault-open="showVault"
          @toggle-vault="toggleVault"
        />
      </div>

      <KnowledgeVault
        v-if="showVault && selectedConversation"
        :items="knowledgeVault"
        :loading="conversationLoading"
        @close="toggleVault"
      />
    </div>
  </DashboardLayout>
</template>
