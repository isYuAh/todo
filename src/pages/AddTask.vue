<script setup lang="ts">
import {inject, ref} from 'vue'
import TaskEdit from "@/components/TaskEdit.vue";
import {useRoute} from "vue-router";
import router from "@/router";
import {AxiosInstance} from "axios";
import {useUserStore} from "@/store/useUserStore.ts";
import {Message} from "@arco-design/web-vue";

let form = ref({
  id: '',
  title: '',
  brief: '',
  tags: <string[]>[],
  tagInputVal: '',
  type: 'markdown',
  content: '',
  deadline: '',
  submitItems: []
})

let serverAxios: AxiosInstance = inject('serverAxios')!;
let route = useRoute();
if (!route.query.GROUP) {
  router.back();
}

function addTaskTrigger() {
  serverAxios.post('/api/task/create', {
    task: form.value,
    token: useUserStore().token,
    group: parseInt(<string>route.query.GROUP)
  }).then((res: any) => {
    if (res.data.code === 200) {
      Message.info('添加成功')
    }
  })
}

</script>

<template>
<TaskEdit :loading="false" v-model="form">
  <a-form-item>
    <a-button style="margin-top: 15px" type="primary" @click="addTaskTrigger">添加任务</a-button>
  </a-form-item>
</TaskEdit>
</template>

<style scoped>

</style>