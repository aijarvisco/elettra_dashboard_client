<script setup lang="ts">
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { TimelineDataPoint } from '@/types'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

interface Props {
  data: TimelineDataPoint[]
  loading?: boolean
}

const props = defineProps<Props>()

const chartData = computed(() => ({
  labels: props.data.map((d) => d.month),
  datasets: [
    {
      label: 'Total Conversations',
      data: props.data.map((d) => d.totalConversations),
      borderColor: 'hsl(240 5.9% 10%)',
      backgroundColor: 'hsl(240 5.9% 10% / 0.1)',
      tension: 0.3,
    },
    {
      label: 'Transferred Leads',
      data: props.data.map((d) => d.transferredLeads),
      borderColor: 'hsl(240 4.8% 45%)',
      backgroundColor: 'hsl(240 4.8% 45% / 0.1)',
      tension: 0.3,
    },
    {
      label: 'Qualification Rate (%)',
      data: props.data.map((d) => d.qualificationRate),
      borderColor: 'hsl(240 3.8% 65%)',
      backgroundColor: 'hsl(240 3.8% 65% / 0.1)',
      tension: 0.3,
      yAxisID: 'y1',
    },
  ],
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index' as const,
    intersect: false,
  },
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        usePointStyle: true,
        padding: 20,
      },
    },
  },
  scales: {
    y: {
      type: 'linear' as const,
      display: true,
      position: 'left' as const,
      title: {
        display: true,
        text: 'Count',
      },
    },
    y1: {
      type: 'linear' as const,
      display: true,
      position: 'right' as const,
      title: {
        display: true,
        text: 'Rate (%)',
      },
      grid: {
        drawOnChartArea: false,
      },
      min: 0,
      max: 100,
    },
  },
}
</script>

<template>
  <Card class="p-4">
    <CardContent class="h-[400px]">
      <div v-if="loading" class="flex h-full items-center justify-center">
        <Skeleton class="h-full w-full" />
      </div>
      <div v-else-if="data.length === 0" class="flex h-full items-center justify-center">
        <p class="text-muted-foreground">No data available</p>
      </div>
      <Line v-else :data="chartData" :options="chartOptions" />
    </CardContent>
  </Card>
</template>
