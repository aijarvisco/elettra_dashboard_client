<script setup lang="ts">
import { computed } from 'vue'
import { X, ExternalLink } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { KnowledgeVaultItem, Document } from '@/types'

interface Props {
  items: KnowledgeVaultItem[]
  documents?: Document[]
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  documents: () => []
})
const emit = defineEmits<{
  close: []
}>()

const groupedItems = computed(() => {
  const groups: Record<string, KnowledgeVaultItem[]> = {}
  for (const item of props.items) {
    const category = item.category || 'Info'
    if (!groups[category]) {
      groups[category] = []
    }
    groups[category].push(item)
  }
  return groups
})

const categoryOrder = computed(() => Object.keys(groupedItems.value).sort())

const hasContent = computed(() => props.items.length > 0 || props.documents.length > 0)
</script>

<template>
  <div class="w-80 border-l bg-background h-full overflow-hidden flex flex-col">
    <div class="flex items-center justify-between border-b px-4 py-3 shrink-0">
      <h3 class="text-sm font-medium text-foreground">Knowledge Vault</h3>
      <Button variant="ghost" size="icon" class="h-8 w-8" @click="emit('close')">
        <X class="h-4 w-4" />
      </Button>
    </div>

    <div class="flex-1 overflow-hidden">
      <ScrollArea class="h-full">
        <div class="p-4">
          <div v-if="loading" class="space-y-4">
            <Skeleton v-for="i in 4" :key="i" class="h-24 w-full" />
          </div>
          <div v-else-if="!hasContent" class="py-8 text-center text-muted-foreground">
            No data collected
          </div>
          <div v-else class="space-y-4">
            <!-- Knowledge Vault Items -->
            <div v-for="category in categoryOrder" :key="category">
              <Badge variant="outline" class="mb-2">{{ category }}</Badge>
              <div class="space-y-2">
                <div
                  v-for="item in groupedItems[category]"
                  :key="item.id"
                  class="rounded-md border bg-card p-3"
                >
                  <p class="text-xs font-medium text-muted-foreground">{{ item.key }}</p>
                  <p class="mt-1 text-sm text-foreground">{{ item.value }}</p>
                </div>
              </div>
            </div>

            <!-- Images & Documents Section -->
            <div v-if="documents.length > 0">
              <Badge variant="outline" class="mb-2">Images & Documents</Badge>
              <div class="space-y-2">
                <a
                  v-for="doc in documents"
                  :key="doc.id"
                  :href="doc.link"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center gap-2 rounded-md border bg-card p-3 hover:bg-secondary/50 transition-colors"
                >
                  <ExternalLink class="h-4 w-4 text-muted-foreground shrink-0" />
                  <span class="text-sm text-foreground truncate">{{ doc.imageId }}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  </div>
</template>
