<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import DashboardLayout from '@/components/layout/DashboardLayout.vue'
import ConversationList from '@/components/conversations/ConversationList.vue'
import ChatView from '@/components/conversations/ChatView.vue'
import KnowledgeVault from '@/components/conversations/KnowledgeVault.vue'
import { contactsApi } from '@/services/api'
import type { Contact, SessionMetadata, Message, KnowledgeVaultItem, Document, PaginatedResponse } from '@/types'

const PAGE_SIZE = 10

const contacts = ref<PaginatedResponse<Contact>>({
  data: [],
  total: 0,
  page: 1,
  pageSize: PAGE_SIZE,
  totalPages: 0,
})
const selectedContact = ref<Contact | null>(null)
const sessions = ref<SessionMetadata[]>([])
const messages = ref<Message[]>([])
const knowledgeVault = ref<KnowledgeVaultItem[]>([])
const documents = ref<Document[]>([])
const showVault = ref(true)
const loading = ref(true)
const conversationLoading = ref(false)
const searchQuery = ref('')

const fetchContacts = async (page: number = 1, search?: string) => {
  try {
    loading.value = true
    if (search && search.length >= 3) {
      contacts.value = await contactsApi.search(search, page, PAGE_SIZE)
    } else if (!search) {
      contacts.value = await contactsApi.list(page, PAGE_SIZE)
    }
  } catch (err) {
    console.error('Failed to fetch contacts:', err)
  } finally {
    loading.value = false
  }
}

const debouncedSearch = useDebounceFn((query: string) => {
  if (query.length >= 3 || query.length === 0) {
    fetchContacts(1, query || undefined)
  }
}, 300)

const selectContact = async (contact: Contact) => {
  try {
    conversationLoading.value = true
    selectedContact.value = contact
    const data = await contactsApi.getById(contact.id)
    sessions.value = data.sessions
    messages.value = data.messages
    knowledgeVault.value = data.knowledgeVault
    documents.value = data.documents
  } catch (err) {
    console.error('Failed to fetch contact details:', err)
  } finally {
    conversationLoading.value = false
  }
}

const handleSearch = (query: string) => {
  searchQuery.value = query
  debouncedSearch(query)
}

const handlePageChange = (page: number) => {
  fetchContacts(page, searchQuery.value || undefined)
}

const toggleVault = () => {
  showVault.value = !showVault.value
}

onMounted(() => {
  fetchContacts()
})
</script>

<template>
  <DashboardLayout>
    <div class="flex h-full overflow-hidden">
      <ConversationList
        :contacts="contacts"
        :selected-id="selectedContact?.id"
        :loading="loading"
        @select="selectContact"
        @search="handleSearch"
        @page-change="handlePageChange"
      />

      <div class="flex flex-1 flex-col min-w-0 overflow-hidden">
        <ChatView
          :contact="selectedContact"
          :sessions="sessions"
          :messages="messages"
          :loading="conversationLoading"
          :show-vault-toggle="true"
          :vault-open="showVault"
          @toggle-vault="toggleVault"
        />
      </div>

      <KnowledgeVault
        v-if="showVault && selectedContact"
        :items="knowledgeVault"
        :documents="documents"
        :loading="conversationLoading"
        @close="toggleVault"
      />
    </div>
  </DashboardLayout>
</template>
