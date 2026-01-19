<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DashboardLayout from '@/components/layout/DashboardLayout.vue'
import MetricCard from '@/components/metrics/MetricCard.vue'
import MetricsChart from '@/components/metrics/MetricsChart.vue'
import { ScrollArea } from '@/components/ui/scroll-area'
import { metricsApi } from '@/services/api'
import type { MetricsSummary, TimelineDataPoint } from '@/types'
import { MessageSquare, UserCheck, Percent, Hash } from 'lucide-vue-next'

const summary = ref<MetricsSummary | null>(null)
const timeline = ref<TimelineDataPoint[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const fetchMetrics = async () => {
  try {
    loading.value = true
    error.value = null
    const [summaryData, timelineData] = await Promise.all([
      metricsApi.getSummary(),
      metricsApi.getTimeline(),
    ])
    summary.value = summaryData
    timeline.value = timelineData
  } catch (err) {
    console.error('Failed to fetch metrics:', err)
    error.value = 'Failed to load metrics. Please try again.'
  } finally {
    loading.value = false
  }
}

onMounted(fetchMetrics)
</script>

<template>
  <DashboardLayout>
    <ScrollArea class="h-full">
      <div class="p-8">
        <h1 class="text-2xl font-semibold text-foreground">Performance Indicators</h1>

        <div v-if="error" class="mt-6 rounded-md border border-destructive/50 bg-destructive/10 p-4">
          <p class="text-sm text-destructive">{{ error }}</p>
        </div>

        <div class="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total Conversations"
            :value="summary?.totalConversations ?? 0"
            :loading="loading"
            :icon="MessageSquare"
            highlight="info"
          />
          <MetricCard
            title="Transferred Leads"
            :value="summary?.transferredLeads ?? 0"
            :loading="loading"
            :icon="UserCheck"
            highlight="success"
          />
          <MetricCard
            title="Qualification Rate"
            :value="`${summary?.qualificationRate ?? 0}%`"
            :loading="loading"
            :icon="Percent"
            highlight="success"
          />
          <MetricCard
            title="Avg. Messages/Session"
            :value="summary?.avgMessagesPerSession?.toFixed(1) ?? '0'"
            :loading="loading"
            :icon="Hash"
          />
        </div>

        <h2 class="mt-10 text-lg font-medium text-foreground">Indicators Progress Over Time</h2>
        <div class="mt-4">
          <MetricsChart :data="timeline" :loading="loading" />
        </div>
      </div>
    </ScrollArea>
  </DashboardLayout>
</template>
