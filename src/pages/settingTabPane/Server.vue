<template>
<settingPane>
<settingPanePart defaultEmptyMessage="必须先登出" title="服务器">
    <template #content>
        <!-- <a-space direction="vertical"> -->
            <!-- <div class="div">
                <span>服务器地址</span>
                <a-input fill v-model="settingsStore.server.url"></a-input>
            </div> -->
            <LabelAboveInput label="服务器地址" v-model="settingsStore.server.url">
                <a-input-search search-button :loading="testConnectionButton.loading" @search="testConnectionButton.click" v-model="settingsStore.server.url">
                    <template #button-default>
                        测试连接
                    </template>
                </a-input-search>
            </LabelAboveInput>
            <!-- <a-button :loading="testConnectionButton.loading" @click="testConnectionButton.click">测试连接</a-button> -->
        <!-- </a-space> -->
    </template>
</settingPanePart>
</settingPane>
</template>

<script setup lang='ts'>
import settingPane from '@/components/settingTab/settingPane.vue';
import settingPanePart from '@/components/settingTab/settingPanePart.vue';
import LabelAboveInput from '@/components/LabelAboveInput.vue';
import {Notification} from '@arco-design/web-vue'
import '@arco-design/web-vue/lib/notification/style/index.css'
import { useSettingsStore } from '@/store/useSettingsStore';
import { AxiosInstance, AxiosResponse } from 'axios';
import { inject, reactive, watchEffect } from 'vue';
let settingsStore = useSettingsStore()
watchEffect(() => {
    localStorage.setItem('server', settingsStore.server.url)
})
let serverAxios = inject('serverAxios') as AxiosInstance;
const testConnectionButton = reactive({
    loading: false,
    click: function () {
        testConnectionButton.loading = true;
        serverAxios.get('/api/test').then((res: AxiosResponse) => {
            if (res.data.status! === 'success') {
                Notification.success({
                    title: '成功',
                    content: '服务器连接测试成功'
                })
            }else {
                Notification.warning({
                    title: '警告',
                    content: `服务器联通，但返回数据不符合格式\nstatus: ${res.data.status}`
                })
            }
        }).finally(() => {
            testConnectionButton.loading = false;
        })
    }
})
</script>

<style scoped>
</style>