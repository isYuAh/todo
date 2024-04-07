<template>
<div class="container">
    <settingTab :defaultActiveTab="defaultActiveTab" :tabs="tabs"></settingTab>
</div>
</template>

<script setup lang='ts'>
import settingTab from '@/components/settingTab/settingTab.vue';
import { yuTab } from '@/types/settings';
import { reactive } from 'vue';
let defaultActiveTab = location.pathname.split('/').reverse()[0];
const tabs = reactive<yuTab[]>([{
    id: 'general',
    routerLink: {
        name: 'settings-general',
    },
    title: '常规设置',
    value: 'general'
},{
    id: 'backup',
    routerLink: {
        name: 'settings-backup',
    },
    title: '备份 & 同步',
    value: 'backup'
},{
    id: 'account',
    routerLink: {
        name: 'settings-account',
    },
    title: '账户',
    value: 'account'
},{
    id: 'server',
    routerLink: {
        name: 'settings-server',
    },
    title: '服务器',
    value: 'server'
}])
</script>

<style scoped>
.container {
    padding: 20px;
    height: 100%;
}
</style>