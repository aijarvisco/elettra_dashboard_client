<script setup lang="ts">
import { ScrollAreaRoot, ScrollAreaViewport, type ScrollAreaRootProps } from 'radix-vue'
import ScrollBar from './ScrollBar.vue'
import { cn } from '@/lib/utils'

interface Props extends ScrollAreaRootProps {
  class?: string
}

const props = defineProps<Props>()
</script>

<template>
  <ScrollAreaRoot :class="cn('relative overflow-hidden', props.class)">
    <ScrollAreaViewport class="h-full w-full rounded-[inherit]">
      <slot />
    </ScrollAreaViewport>
    <ScrollBar />
    <ScrollAreaCorner />
  </ScrollAreaRoot>
</template>

<script lang="ts">
import { ScrollAreaCorner } from 'radix-vue'
</script>
