export interface Session {
  id: string
  phoneNumber: string
  email?: string
  name?: string
  startedAt: string
  endedAt?: string
  messageCount: number
  transferred: boolean
  status?: number
}

export interface Message {
  id: string
  sessionId: string
  role: 'user' | 'agent'
  content: string
  timestamp: string
}

export interface KnowledgeVaultItem {
  id: string
  sessionId: string
  category: string
  key: string
  value: string
}

export interface MetricsSummary {
  totalConversations: number
  transferredLeads: number
  qualificationRate: number
  avgMessagesPerSession: number
}

export interface TimelineDataPoint {
  month: string
  totalConversations: number
  transferredLeads: number
  qualificationRate: number
}

export interface ConversationWithMessages extends Session {
  messages: Message[]
  knowledgeVault: KnowledgeVaultItem[]
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface ApiError {
  error: string
  code: string
}
