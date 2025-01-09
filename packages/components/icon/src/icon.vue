<template>
  <div>
    hello it is icon
  </div>
</template>

<script lang="ts" setup>
  import { iconProps, IconOptions } from './icon'

  defineOptions({
    name: 'x-icon'
  })

  const props = defineProps(iconProps)
</script>

<style lang="scss" scoped>

</style>