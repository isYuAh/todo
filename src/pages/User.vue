<template>
<div class="container">
    <a-tabs default-active-key="overview">
        <a-tab-pane key="overview" title="总览">
            <div class="layout">
                <div v-if="settingsStore.mode === 'online' && userStore.basicInfo.avatar" class="left">
                    <div class="avatar">
                        <a-upload
                        :auto-upload="false"
                        :show-file-list="false"
                        @change="uploadAvatar"
                        >
                            <template #upload-button>
                                <a-tooltip content="编辑头像" position="bottom">
                                    <a-avatar :image-url="userStore.basicInfo.avatar" class="forbidSelect avatarIMG" :size="256">
                                        <span v-if="!userStore.basicInfo.avatar">{{ userStore.basicInfo.nickname.substring(0, 3) }}</span>
                                    </a-avatar>
                                </a-tooltip>
                            </template>
                        </a-upload>
                    </div>
                    <div class="nickname">
                        {{ userStore.basicInfo.nickname }}
                    </div>
                    <div class="account">
                        {{ userStore.account }}
                    </div>
                </div>
                <div class="right">
                    <a-space>
                        <a-card style="min-width: 250px;">
                            <a-statistic title="总待办数" :value="todoStore.todos.length" show-group-separator />
                        </a-card>
                        <a-card style="min-width: 250px;">
                            <a-statistic title="已完成" :value="todoStore.todos.filter((todo) => todo.status === 'success').length" show-group-separator />
                        </a-card>
                        <a-card style="min-width: 250px;">
                            <a-statistic title="处理中" :value="todoStore.todos.filter((todo) => todo.status === 'processing').length" show-group-separator />
                        </a-card>
                    </a-space>
                </div>
            </div>
        </a-tab-pane>
        <a-tab-pane v-if="settingsStore.mode === 'online'" key="group" title="小组">

        </a-tab-pane>
    </a-tabs>
</div>
</template>

<script setup lang='ts'>

// // 验证登录
import { useUserStore } from "@/store/useUserStore"
// import { vaildLogin } from '@/plugins/utils_user';
import { useSettingsStore } from "@/store/useSettingsStore";
import { FileItem } from "@arco-design/web-vue";
let settingsStore = useSettingsStore();
let userStore = useUserStore();

// if (settingsStore.mode === 'online') {
//   vaildLogin({account: userStore.account});
// }
// // END 验证登陆状态

import { useTodoStore } from "@/store/useTodoStore";
let todoStore = useTodoStore()

function uploadAvatar(_: any, current: FileItem) {
    console.log(current);
}
</script>

<style scoped>
.container {
    margin: 0 auto;
    width: 80vw;
    min-width: 784px;
    max-width: 100%;
}
.layout {
    display: flex;
    margin-top: 30px;
}
.layout .left {
    width: 256px;
    margin: 0 20px;
}
.avatar .avatarIMG {
    transition: filter .2s;
}
.avatar .avatarIMG:hover {
    filter: brightness(0.75);
}
.nickname {
    margin-top: 5px;
    font-size: 24px;
    text-align: center;
    color: #18191C;
}
.account {
    text-align: center;
    font-size: 18px;
    color: #61666D;
}
.layout .right {
    margin: 0 40px;
}
</style>