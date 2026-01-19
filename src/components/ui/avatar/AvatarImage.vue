<script setup lang="ts">
import { AvatarImage, type AvatarImageProps } from 'radix-vue'
import { cn } from '@/lib/utils'

interface Props extends AvatarImageProps {
  class?: string
}

const props = defineProps<Props>()
</script>

<template>
  <AvatarImage :class="cn('aspect-square h-full w-full', props.class)" v-bind="props" />
</template>
