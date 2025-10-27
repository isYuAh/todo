<script setup lang="ts">

import TaskEdit from "@/components/TaskEdit.vue";
import {inject, ref} from "vue";
import {AxiosInstance} from "axios";
import {useRoute} from "vue-router";
import router from "@/router";
import {Message} from "@arco-design/web-vue";
let loading = ref(true);
let form = ref({
  id: '',
  title: '',
  brief: '',
  tags: <string[]>[],
  tagInputVal: '',
  type: 'markdown',
  content: '',
  submitItems: []
})
let serverAxios: AxiosInstance = inject('serverAxios')!;
let route = useRoute();
if (!route.query.GROUP) {
  router.back();
}

function editTaskTrigger() {
  let tmp =  structuredClone(form.value);
  //@ts-ignore
  delete tmp.id;
  serverAxios.post('/api/task/edit', {
    task: tmp,
    group: parseInt(<string>route.query.GROUP)
  }).then((res: any) => {
    if (res.data.code === 200) {
      Message.info('添加成功')
    }
  })
}
</script>

<template>
  <TaskEdit :loading="loading" v-model="form">
    <a-form-item>
      <a-button style="margin-top: 15px" type="primary" @click="editTaskTrigger">添加任务</a-button>
    </a-form-item>
  </TaskEdit>
</template>

<style scoped>

</style>