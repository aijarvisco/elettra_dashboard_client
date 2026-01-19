<script setup lang="ts">
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { Component } from 'vue'

interface Props {
  title: string
  value: string | number
  loading?: boolean
  icon?: Component
  highlight?: 'success' | 'warning' | 'info' | 'default'
}

withDefaults(defineProps<Props>(), {
  highlight: 'default',
})

const highlightClasses = {
  success: 'text-success',
  warning: 'text-warning',
  info: 'text-info',
  default: 'text-foreground',
}
</script>

<template>
  <Card>
    <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle class="text-sm font-medium text-muted-foreground">
        {{ title }}
      </CardTitle>
      <component
        v-if="icon"
        :is="icon"
        :class="cn('h-4 w-4', highlight !== 'default' ? highlightClasses[highlight] : 'text-muted-foreground')"
      />
    </CardHeader>
    <CardContent>
      <Skeleton v-if="loading" class="h-8 w-24" />
      <div v-else :class="cn('text-2xl font-bold', highlightClasses[highlight])">
        {{ value }}
      </div>
    </CardContent>
  </Card>
</template>
