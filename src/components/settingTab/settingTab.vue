<template>
<div class="container forbidSelect">
    <div class="tabs">
        <settingTabList :defaultActiveTab="defaultActiveTab" :tabs="tabs"></settingTabList>
    </div>
    <div class="paneView">
        <RouterView></RouterView>
    </div>
</div>
</template>

<script setup lang='ts'>
import { yuTab } from '@/types/settings';
import { RouterView } from 'vue-router';

defineProps<{
    tabs: yuTab[],
    defaultActiveTab:string
}>()
</script>

<style scoped>
.tabs {
    position: relative;
    height: 100%;
}
.container {
    display: flex;
}
.paneView {
    margin-left: 2px;
    flex: 1; 
    padding: 20px 20px 0;
    height: 100%;
    overflow: auto;
}
</style>