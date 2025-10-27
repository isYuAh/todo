<template>
<div class="container">
  <a-drawer
      :visible="drawerVisible"
      placement="bottom"
      @ok="addNewSubmitRequest(toRaw(addTaskForm))"
      @cancel="drawerVisible=false"
  >
    <template #title>
      添加任务
    </template>
    <a-form :model="addTaskForm">
      <a-form-item label="名称">
        <a-input v-model="addTaskForm.name"></a-input>
      </a-form-item>
      <a-form-item label="类型">
        <a-select v-model="addTaskForm.type">
          <a-option value="text">文本</a-option>
        </a-select>
      </a-form-item>
      <a-form-item label="描述">
        <a-textarea v-model="addTaskForm.description"></a-textarea>
      </a-form-item>
    </a-form>
  </a-drawer>
    <a-spin style="display:block" :loading="loading">
      <a-steps changeable :current="currentStep" @change="(cur:number) => {currentStep = cur}">
        <a-step>基本信息</a-step>
        <a-step>内容编辑</a-step>
        <a-step>额外设置</a-step>
      </a-steps>
      <a-divider/>
      <a-form class="formContainer" :model="form" v-show="currentStep === 1">
        <a-form-item label="标题" class="basicItem">
          <a-input v-model="form.title" class="input"></a-input>
        </a-form-item>
        <a-form-item label="标签" class="basicItem">
          <a-input-tag @press-enter="form.tagInputVal = ''" @blur="tagInputBlur" v-model:input-value="form.tagInputVal" v-model="form.tags" :retain-input-value="true" class="input"></a-input-tag>
        </a-form-item>
        <a-form-item label="简略描述" class="basicItem">
          <a-textarea v-model="form.brief" class="input" ref="descriptionInput" placeholder="简略描述"></a-textarea>
        </a-form-item>
        <a-form-item class="basicItem" label="内容类型">
          <a-select v-model="form.type" class="input">
            <a-option :value="'text'">纯文字</a-option>
            <a-option :value="'markdown'">Markdown</a-option>
          </a-select>
        </a-form-item>
      </a-form>
      <div class="secondSetp" v-show="currentStep === 2">
        <MdEditor style="height: 600px;width: 100%;" editor-id="addTodo" previewTheme="vuepress" v-if="form.type==='markdown'" v-model="form.content" />
        <a-textarea v-if="form.type==='text'" v-model="form.content" placeholder="输入详细内容" :auto-size="{
            minRows: 10,
        }"/>
      </div>
      <div class="thirdSettings" v-show="currentStep === 3">
        <a-space style="margin-bottom: 15px">
          <a-button @click="drawerVisible=true" type="primary">添加提交</a-button>
        </a-space>
        <a-table :columns="columns" :data="form.submitItems"></a-table>
        <a-form-item style="margin-top: 15px" label="截止日期">
          <a-date-picker
              style="width: 220px; margin: 0 24px 24px 0;"
              show-time
              :time-picker-props="{ defaultValue: '09:09:06' }"
              format="YYYY-MM-DD HH:mm:ss"
              v-model="form.deadline"
          />
        </a-form-item>
        <slot></slot>
      </div>
    </a-spin>
</div>
</template>

<script setup lang='ts'>
import { ref, toRaw } from 'vue';
import { MdEditor } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import {Message} from "@arco-design/web-vue";
import "@arco-design/web-vue/es/message/style/index.css"
let currentStep = ref(1)
const form = defineModel({
    required: true,
    type: Object
});
defineProps<{
  loading: boolean
}>()
let drawerVisible = ref(false)
const addTaskForm = ref({
  name: '',
  type: 'text',
  description: ''
})
let columns = ref([
  {
    title: '名称（不可重复）',
    dataIndex: 'name',
    width: 400
  },
  {
    title: '类型',
    dataIndex: 'type',
    width: 100
  },
  {
    title: '描述',
    dataIndex: 'description',
    ellipsis: true,
    tooltip: true
  }
])
function tagInputBlur() {
    if (form.value.tagInputVal) {
        form.value.tags.push(form.value.tagInputVal);
        form.value.tagInputVal='';
    }
}
function addNewSubmitRequest(sr: Record<string, any>) {
  if (sr.name && !form.value.submitItems.some((i: any) => i.name === sr.name)) {
    form.value.submitItems.push(structuredClone(sr));
    drawerVisible.value = false;
  }else {
    Message.error("名称为空或重复")
  }
}

</script>

<style scoped>
.container {
    padding: 20px;
}
.formContainer {
    display: block;
    /* margin: 0 auto; */
    max-width: 600px;
}

#totalTimes .arco-input-prepend {
    padding: 0;
}
.DayCheckbox {
    text-wrap: nowrap;
}
/* .input {
    width: 400px;
} */
</style>