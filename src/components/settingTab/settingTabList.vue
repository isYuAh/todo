<template>
<div ref="yuTablist" class="yu-tablist">
    <div v-for="tab in tabs" :key="tab.id" class="yu-tab">
        <settingSingleTab @click="toggleActive($event, tab.id)" :tabId="tab.id" :activeTab="activeTab" :toParmas="tab.routerLink">{{ tab.title }}</settingSingleTab>
    </div>
    <div ref="yuTabBorder" class="yu-tabBorder"></div>
    <div class="yu-tabBorderLine"></div>
</div>
</template>

<script setup lang='ts'>
import { yuTab } from '@/types/settings';
import settingSingleTab from './settingSingleTab.vue';
import { onMounted, ref } from 'vue';

let props = defineProps<{
    tabs: yuTab[],
    defaultActiveTab: string
}>()
let yuTabBorder = ref<HTMLDivElement>();
let yuTablist = ref<HTMLDivElement>();
let activeTab = ref(props.defaultActiveTab || '')
function refreshBorder(top: number) {
    if (yuTabBorder.value) {
        yuTabBorder.value!.style.top = top + 'px';
    }
}
function toggleActive(e: Event, id: string) {
    activeTab.value = id;
    refreshBorder((e.target as any).offsetTop)
}
onMounted(() => {
    (yuTabBorder.value as any).style.height = (yuTablist.value as any).querySelector(`[tabid=${activeTab.value}]`).offsetHeight + 'px';
    (yuTablist.value as any).querySelector(`[tabid=${activeTab.value}]`).click()
})
</script>

<style scoped>
.yu-tablist {
    display: flex;
    flex-direction: column;
    position: relative;
}
.yu-tab {
    padding: 0 5px;
    text-wrap: nowrap;
    margin: 5px 0;
}
.yu-tabBorder {
    position: absolute;
    right: -2px;
    background-color: #4080FF;
    width: 2px;
    height: 20px;
    top: 0;
    transition: top .2s ease;
}
.yu-tabBorderLine {
    position: absolute;
    right: -2px;
    height: 100%;
    background-color: #e2e3e5;
    width: 1px;
    z-index: -1;
    top: 0;
    transition: top .2s ease;
}
</style>