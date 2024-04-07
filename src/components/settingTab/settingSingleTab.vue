<template>
    <RouterLink :tabid="tabId" :class="{tabLink: true, active: activeTab === tabId}" :to="toParmas"><slot></slot></RouterLink>
</template>

<script setup lang='ts'>
import { RouteLocationRaw, RouterLink } from 'vue-router';
defineProps<{
    toParmas: RouteLocationRaw,
    activeTab: string,
    tabId: string
}>()
</script>

<style scoped>
.tabLink {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    text-decoration: none;
    /* height: 20px; */
    /* line-height: 20px; */
    color: #18191C;
    padding: 5px 10px;
    transition: color .3s ease,
                background .3s ease;
}
.tabLink:hover {
    background-color: #f2f3f5;
    color: #4080FF;
}
</style>