import axios from 'axios'
import type {
  MetricsSummary,
  TimelineDataPoint,
  Session,
  Message,
  KnowledgeVaultItem,
  PaginatedResponse
} from '@/types'

// Use environment variable for API URL, fallback to /api for local dev with proxy
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Token getter function - will be set by initApiAuth()
let tokenGetter: (() => Promise<string | null>) | null = null

// Call this from a Vue component to set up auth token injection
export function initApiAuth(getToken: () => Promise<string | null>): void {
  tokenGetter = getToken
}

// Add auth token to requests
api.interceptors.request.use(async (config) => {
  // Get token from the stored getter and add as Authorization header
  if (tokenGetter) {
    try {
      const token = await tokenGetter()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    } catch {
      // If we can't get the token, continue without it
      // The server will return 401 if auth is required
    }
  }
  config.withCredentials = true
  return config
})

// Metrics API
export const metricsApi = {
  getSummary: async (): Promise<MetricsSummary> => {
    const { data } = await api.get<MetricsSummary>('/metrics/summary')
    return data
  },

  getTimeline: async (): Promise<TimelineDataPoint[]> => {
    const { data } = await api.get<TimelineDataPoint[]>('/metrics/timeline')
    return data
  },
}

// Conversations API
export const conversationsApi = {
  list: async (page: number = 1, pageSize: number = 10): Promise<PaginatedResponse<Session>> => {
    const { data } = await api.get<PaginatedResponse<Session>>('/conversations', {
      params: { page, pageSize },
    })
    return data
  },

  search: async (
    query: string,
    page: number = 1,
    pageSize: number = 10
  ): Promise<PaginatedResponse<Session>> => {
    const { data } = await api.get<PaginatedResponse<Session>>('/conversations/search', {
      params: { q: query, page, pageSize },
    })
    return data
  },

  getById: async (id: string): Promise<{
    session: Session
    messages: Message[]
    knowledgeVault: KnowledgeVaultItem[]
  }> => {
    const { data } = await api.get(`/conversations/${id}`)
    return data
  },
}

export default api
