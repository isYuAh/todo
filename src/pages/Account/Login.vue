<template>
    <a-form class="form" :model="loginParmas">
        <a-form-item label="账号">
            <a-input v-model="loginParmas.account"></a-input>
        </a-form-item>
        <a-form-item label="密码">
            <a-input type="password" v-model="loginParmas.pwd"></a-input>
        </a-form-item>
        <a-form-item>
            <a-button :loading="loading" @click="login" type="primary">登录</a-button>
        </a-form-item>
    </a-form>
</template>

<script setup lang='ts'>
import { loginResponse, type loginParams } from '@/types';
import { inject, reactive, ref } from 'vue';
import {Notification} from '@arco-design/web-vue'
import '@arco-design/web-vue/lib/notification/style/index.css'
import { useUserStore } from '@/store/useUserStore';
import { AxiosInstance, AxiosResponse } from 'axios'
//@ts-ignore
import sha1 from 'sha1'
import { useRouter } from 'vue-router';
import { useSettingsStore } from '@/store/useSettingsStore';

let userStore = useUserStore()
let settingsStore = useSettingsStore();
let serverAxios: AxiosInstance = inject('serverAxios')!;
let router = useRouter();

// let UserStore = useUserStore();
let loginParmas = reactive<loginParams>({
    account: '',
    pwd: '',
})
let loading = ref(false);
let salt = 'Etp22xL3Ie39xrD'
function login() {
    loading.value = true;
    serverAxios.post('/api/user/login', {
        account: loginParmas.account,
        pwd: sha1(salt + loginParmas.pwd),
    }).then((res: AxiosResponse<loginResponse>) => {
        if (res.data.code === 200) {
            console.log(res.data);
            Notification.success({
                title: `登录成功, ${(res.data as any).data.basicInfo.nickname}`,
                content: ''
            })
            userStore.account = loginParmas.account;
            userStore.token = (res.data as any).data.token;
            userStore.basicInfo = (res.data as any).data.basicInfo;
            settingsStore.mode = 'online';
            router.back();
            console.log(userStore)
        }else {
            Notification.error({
                title: '登录失败',
                content: res.data.status
            })
        }
        loading.value = false;
    }).catch((err: Error) => {
      Notification.error({
        title: '登录失败',
        content: err.message
      })
      loading.value = false;
    })
}

</script>

<style scoped>
.form {
    display: flex;
    margin: 20vh auto 0;
    max-width: 500px;
}
</style>