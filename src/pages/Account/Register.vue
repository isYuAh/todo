<template>
    <a-form class="form" :model="registerParams">
        <a-form-item label="账号">
            <a-input v-model="registerParams.account"></a-input>
        </a-form-item>
        <a-form-item label="昵称">
            <a-input v-model="registerParams.basicInfo.nickname"></a-input>
        </a-form-item>
        <a-form-item label="密码">
            <a-input type="password" v-model="registerParams.pwd"></a-input>
        </a-form-item>
        <a-form-item>
            <a-button :loading="loading" @click="register" type="primary">注册</a-button>
        </a-form-item>
    </a-form>
</template>

<script setup lang='ts'>
import { user_basicInfo, type registerParams, registerResponse } from '@/types';
import { AxiosInstance, AxiosResponse } from 'axios';
import sha1 from 'sha1';
import { inject, ref } from 'vue';
import { useRouter } from 'vue-router';
import { Notification } from '@arco-design/web-vue';
import '@arco-design/web-vue/lib/notification/style/index.css'

let registerParams = ref<registerParams>({
    account: '',
    pwd: '',
    basicInfo: {
        avatar: '',
        nickname: '',
    }
})
let serverAxios: AxiosInstance = inject('serverAxios')!;
let router = useRouter();
let loading = ref(false);
let salt = 'Etp22xL3Ie39xrD';
function register() {
    loading.value = true;
    serverAxios.post('/api/user/register', {
        account: registerParams.value.account,
        pwd: sha1(salt + registerParams.value.pwd),
        basicInfo: <user_basicInfo>{
            nickname: registerParams.value.basicInfo.nickname,
            avatar: registerParams.value.basicInfo.avatar
        }

    }).then((res: AxiosResponse<registerResponse>) => {
        if (res.data.code === 200) {
            Notification.success({
                title: `${registerParams.value.account}, 注册成功`,
                content: '现在转到登录页面'
            })
            router.push({
                name: 'account-login'
            })
        }else {
            Notification.error({
                title: `注册失败`,
                content: res.data.status
            })
        }
    }).finally(() => {
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