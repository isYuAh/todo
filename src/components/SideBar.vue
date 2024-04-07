<template>
<div class="menu">
    <a-menu
        :style="{ height: '100%', width: '256px' }"
        :default-selected-keys="selectedKeys"
        :default-collapsed="true"
        v-model:collapsed="sidebar_collapsed"
        :show-collapse-button="true"
        @collapse="(collapsed) => {saveCollapse(collapsed)}"
    >
        <a-menu-item @click="redirect('todo')" key="todo">
            <template #icon><icon-apps /></template>
            待办
        </a-menu-item>
        <a-menu-item @click="redirect('addTodo')" key="addTodo">
            <template #icon><icon-plus /></template>
            添加待办
        </a-menu-item>
        <a-menu-item @click="redirect('user')" key="user">
            <template #icon><icon-user /></template>
            用户
        </a-menu-item>
        <a-menu-item @click="redirect('settings')" key="settings">
            <template #icon><icon-settings /></template>
            设置
        </a-menu-item>
        <div v-show="false"><a-sub-menu key="document" title="文档">
            <template #icon><icon-file /></template>
            <a-menu-item @click="redirect('document-usage')" key="document_usage">使用说明</a-menu-item>
            <a-menu-item @click="redirect('document-about')" key="document_about">关于</a-menu-item>
        </a-sub-menu></div>
    </a-menu>
</div>
</template>

<script setup lang='ts'>
import {ref} from 'vue'
import { useRouter } from "vue-router";
import { IconApps, IconFile, IconPlus, IconSettings, IconUser } from '@arco-design/web-vue/es/icon'
// import { useSettingsStore } from '@/store/useSettingsStore';
// let settingsStore = useSettingsStore();
const router = useRouter();
// console.log(2, Boolean(localStorage.getItem('sidebar-collapsed')), Boolean(localStorage.getItem('sidebar-collapsed')) || false);
let sidebar_collapsed = ref(localStorage.getItem('sidebar-collapsed') === 'true')
let selectedKeys = ref<string[]>([window.location.pathname.split('/')[1] || 'todo'])
function redirect(name: string) {
    router.push({name})
}
function saveCollapse(collapsed: boolean) {
    // console.log(collapsed, String(collapsed));
    localStorage.setItem('sidebar-collapsed', String(collapsed))
    // console.log(1, localStorage.getItem('sidebar-collapsed'));
}
defineProps(['setMargin'])

</script>

<style scoped>
.menu {
    height: calc(100vh - 64px);
}
</style>