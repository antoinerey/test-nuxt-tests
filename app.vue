<template>
  <div>
    <NuxtWelcome />
  </div>
</template>

<script setup lang="ts">
await useAsyncData(() => {
  return 'Hello'
})
</script>