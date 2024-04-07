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
let settingsStore = useSettingsStore();
</script>

<style scoped>
</style>