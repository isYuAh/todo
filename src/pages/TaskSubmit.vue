<script setup lang="ts">
import type {task} from "@/types";
import {inject, ref} from "vue";
import {AxiosInstance} from "axios";
import {Message} from "@arco-design/web-vue";

let props = defineProps<{
  item: task
}>()
let submitForm = ref<Record<string, any>>(props.item.submitItems.reduce<Record<string, any>>((acc, field) => {
  if (field.type === 'text') {
    acc[field.name] = ""
  }
  return acc
}, {}))
let serverAxios: AxiosInstance = inject('serverAxios')!;

function submit() {
  serverAxios.post('/api/task/submit', {
    group: props.item.origin,
    data: submitForm.value,
    taskid: props.item.id,
  }).then((res: any) => {
    if (res.data.code === 200) {
      Message.success('提交成功！')
    }else {
      Message.error(res.data.status);
    }
  })
}
</script>

<template>
  <a-form layout="vertical" :model="submitForm" class="submitForm" direction="vertical">
    <a-form-item :field="titem.name" :label="titem.name" v-for="titem in item.submitItems" class="item">
      <a-textarea v-model="submitForm[titem.name]" class="content" v-if="titem.type = 'text'" :placeholder="titem.description"></a-textarea>
    </a-form-item>
    <a-form-item>
      <a-popconfirm @ok="submit" content="请确认信息无误后提交">
        <a-button type="primary">提交</a-button>
      </a-popconfirm>
    </a-form-item>
  </a-form>
</template>

<style scoped>
.submitForm {
  max-width: 700px;
}
</style>