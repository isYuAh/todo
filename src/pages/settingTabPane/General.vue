<template>
<a-space>
    <a-typography-text>模式: </a-typography-text>
    <a-switch v-model="settingsStore.mode" checked-value="online" unchecked-value="offline">
        <template #checked>
        在线
        </template>
        <template #unchecked>
        离线
        </template>
    </a-switch>
</a-space>
</template>

<script setup lang='ts'>
import { useSettingsStore } from '@/store/useSettingsStore';
import {watchEffect} from "vue";
let settingsStore = useSettingsStore();

watchEffect(() => {
  localStorage.setItem('mode', settingsStore.mode)
})

</script>

<style scoped>
</style>