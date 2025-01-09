<template>
  <i :class="root.b('')" :style="style">
    <slot></slot>
  </i>
</template>

<script lang="ts" setup>
  import { computed } from 'vue'
  import { iconProps, IconOptions } from './icon'
  import createNamespace from '@xc/utils/createClass'

  const root = createNamespace('icon')
  defineOptions({
    name: 'x-icon'
  })

  const props = defineProps(iconProps)

  const style = computed(() => {
    return {
      color: props.color || '',
      ...(props.size ? { fontSize: `${props.size}px` } : {})
    }
  })
</script>

<style lang="scss" scoped>

</style>