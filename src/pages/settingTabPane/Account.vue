<template>
<settingPane>
<settingPanePart title="账户操作">
    <template #content>
        <a-space>
            <a-button><RouterLink :to="{name: 'account-login'}">登录</RouterLink></a-button>
            <a-button><RouterLink :to="{name: 'account-register'}">注册</RouterLink></a-button>
            <a-button v-if="userStore.token && settingsStore.mode === 'online'" @click="logout">登出</a-button>
            <a-button v-if="userStore.token && settingsStore.mode === 'online'" >切换账户</a-button>
        </a-space>
    </template>
</settingPanePart>
<settingPanePart v-if="userStore.token !== ''" defaultEmptyMessage="未登录" title="基本信息">
    <template #content>
        <a-descriptions class="allowTextSelect" :column="1" :data="accountDetail"></a-descriptions>
    </template>
</settingPanePart>
</settingPane>
</template>

<script setup lang='ts'>
import { RouterLink } from 'vue-router';
import settingPane from '@/components/settingTab/settingPane.vue';
import settingPanePart from '@/components/settingTab/settingPanePart.vue';
import { DescData, Notification } from '@arco-design/web-vue';
import '@arco-design/web-vue/lib/notification/style/index.css'
import { useSettingsStore } from '@/store/useSettingsStore';
let settingsStore = useSettingsStore()
import { useUserStore } from '@/store/useUserStore';
let userStore = useUserStore();
import { inject, ref } from 'vue';
import { simpleResponse, userLogoutInjectionKey } from '@/types';

let accountDetail = ref<DescData[]>([{
        label: '账号',
        value: userStore.account,
    },{
        label: '昵称',
        value: userStore.basicInfo.nickname,
    },])

let userLogout = inject(userLogoutInjectionKey)!;

function logout() {
    userLogout().then((res: simpleResponse) => {
        if (res.code === 200) {
            Notification.success('登出成功')
            settingsStore.mode = 'offline'
        }
    })
}


</script>

<style scoped>

</style>