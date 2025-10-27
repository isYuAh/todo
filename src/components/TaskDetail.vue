<template>
<a-tabs position="left">
    <a-tab-pane key="1" title="详情">
        <MdPreview v-if="focusTask.type === 'markdown'" editorId="todoDetail" :previewTheme="'vuepress'" :showCodeRowNumber="true" :modelValue="focusTask.content" />
        <a-typography v-if="focusTask.type === 'text'">
        <a-typography-paragraph style="white-space: pre-wrap;">
          {{ focusTask.content }}
        </a-typography-paragraph>
        </a-typography>
    </a-tab-pane>
    <a-tab-pane key="2" title="详细状态">
        <a-descriptions class="forbidSelect" :column="1" title="任务详细状态" :data="originData">

        </a-descriptions>
    </a-tab-pane>
    <a-tab-pane key="3" title="提交" :disabled="focusTask.submitItems.length === 0">
        <div class="submitPageContainer">
          <TodoSubmit v-if="focusTask.submitItems.length > 0" :item="focusTask" />
        </div>
    </a-tab-pane>
    <a-tab-pane key="4" title="查看结果">
        <div class="submitPageContainer">
          <TaskSubmits :group="focusTask.origin" :taskid="focusTask.id" />
        </div>
    </a-tab-pane>
</a-tabs>
</template>

<script setup lang='ts'>
import type { task } from '@/types';
import { DescData } from '@arco-design/web-vue';
import { watch } from 'vue';
//Markdown
import { MdPreview } from 'md-editor-v3';
import 'md-editor-v3/lib/preview.css';
import { reactive, ref } from 'vue';
import TodoSubmit from "@/pages/TaskSubmit.vue";
import TaskSubmits from "@/components/TaskSubmits.vue";
//END Markdown
let props = defineProps<{
    focusTask: task
}>()
let originData = ref<DescData[]>([]);
watch(() => props.focusTask, ()=> {
    originData.value = []
    originData.value = reactive(<DescData[]>[
      {
      label: 'ID',
      value: props.focusTask.id
      },
      {
          label: '来源组id',
          value: props.focusTask.origin
      },
      {
        label: '发起人',
        value: props.focusTask.creator,
      }
    ])
}, {deep: true})
</script>

<style scoped>
.submitPageContainer {
  padding: 20px;
  width: 100%;
  height: 100%;
}
</style>