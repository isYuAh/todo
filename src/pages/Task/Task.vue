<script setup lang="ts">
import {inject, ref} from "vue";
import {AxiosInstance} from "axios";
import type { task } from "@/types";
import {useUserStore} from "@/store/useUserStore.ts";
import {IconClose} from "@arco-design/web-vue/es/icon";
import TaskDetail from "@/components/TaskDetail.vue";
import router from "@/router";

let focusTask = ref<task>({
  id: -1,
  title: '',
  brief: '',
  content: '',
  tags: [],
  type: '',
  deadline: new Date(),
  origin: -1,
  creator: '',
  submitItems: []
})
let detailVisible = ref(false);
let dataLoading = ref(true);

let serverAxios = inject('serverAxios') as AxiosInstance;
let tasks = ref<task[]>([])
function refreshTasks() {
  dataLoading.value = true;
  let joinedGroups = ref([])
  serverAxios.post('/api/user/joinedGroups', {token: useUserStore().token}).then((res) => {
    if (res.data.code === 200) {
      joinedGroups.value = res.data.data
    }
  })
  serverAxios.post('/api/tasks/get/user', {token: useUserStore().token, deadlineFilter: "unexpired"}).then((res) => {
    console.log(res)
    if (res.data.code === 200) {
      tasks.value = res.data.data
      dataLoading.value = false;
    }
  })
}
refreshTasks();

function redirect(pathName: string, query: Record<string, string> = {}) {
  router.push({
    name: pathName,
    query: query
  })
}

</script>

<template>
  <div class="taskPageContainer">

    <a-modal :unmount-on-close="true" fullscreen v-model:visible="detailVisible">
      <template #title>{{ focusTask.title }}</template>
      <TaskDetail :focusTask="focusTask" />
      <template #footer>
<!--        <a-tooltip content="编辑此待办">-->
<!--          <a-button @click="router.push({name: 'editTodo', query: {id: focusTask.id}})" type="text"><template #icon><icon-edit /></template></a-button>-->
<!--        </a-tooltip>-->
        <a-tooltip content="关闭">
          <a-button @click="detailVisible = false" status="danger" type="text"><template #icon><icon-close /></template></a-button>
        </a-tooltip>
      </template>
    </a-modal>

    <div class="function">
      <a-typography-title>操作</a-typography-title>
      <a-space>
        <a-button @click="refreshTasks" :loading="dataLoading">刷新</a-button>
      </a-space>
    </div>
    <div class="joined">
      <a-typography-title>当前任务</a-typography-title>
      <a-spin style="width: 100%;" :loading="dataLoading" tip="加载中...">
        <a-empty v-show="tasks.length === 0">
          暂无任务 / 数据获取中
        </a-empty>
        <a-grid :cols="{xs: 1, sm:1, md: 1, lg:2, xl: 2, xxl: 3}" :col-gap="12" :row-gap="16" class="grid-group">
          <a-grid-item v-for="task in tasks" :key="task.id">
            <a-card :title="task.title" hoverable>
              <template #extra>
                <a-link @click="focusTask = task; detailVisible = true">查看</a-link>
              </template>
              {{ task.brief }}
            </a-card>
          </a-grid-item>
        </a-grid>
      </a-spin>
    </div>
  </div>
</template>

<style scoped>
.taskPageContainer {
  padding: 0 20px;
}
</style>