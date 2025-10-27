<script setup lang="ts">
import type {task_submitItems} from "@/types";
import {inject, ref} from "vue";
import {AxiosInstance} from "axios";

let props = defineProps<{
  items: task_submitItems
}>()
let submitForm = ref<Record<string, any>>(props.items.reduce<Record<string, any>>((acc, field) => {
  if (field.type === 'text') {
    acc[field.name] = ""
  }
  return acc
}, {}))
let serverAxios: AxiosInstance = inject('serverAxios')!;

function submit() {
  serverAxios.get('api/')
}
</script>

<template>
  <a-form layout="vertical" :model="submitForm" class="submitForm" direction="vertical">
    <a-form-item :field="item.name" :label="item.name" v-for="item in items" class="item">
      <a-textarea v-model="submitForm[item.name]" class="content" v-if="item.type = 'text'" :placeholder="item.description"></a-textarea>
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