<template>
  <div class="todoContainer" data-simplebar>
    <simplebar class="todoContainer onlyY">
      <a-spin class="todoList" :loading="loading">
        <a-modal fullscreen v-model:visible="detailVisible">
          <template #title>{{ focusTodo.title }}</template>
          <TodoDetail :focusTodo="focusTodo" />
          <template #footer>
            <a-tooltip content="编辑此待办">
                <a-button @click="router.push({name: 'editTodo', query: {id: focusTodo.id}})" type="text"><template #icon><icon-edit /></template></a-button>
            </a-tooltip>
            <a-tooltip v-if="focusTodo.status !== 'default'" content="撤销状态">
                <a-button class="ActionButton" @click="emitter.emit('updateTodoStatus', {id: focusTodo.id, status: 'default'});detailVisible = false" type="text"><template #icon><icon-redo /></template></a-button>
            </a-tooltip>
            <a-tooltip v-if="focusTodo.status === 'default'" content="处理">
              <a-button @click="emitter.emit('updateTodoStatus', {id: focusTodo.id, status: 'processing'});detailVisible = false" type="text"><template #icon><icon-at /></template></a-button>
            </a-tooltip>
            <a-tooltip v-if="focusTodo.status === 'processing'" content="完成">
              <a-button @click="emitter.emit('completeTodoOnce', focusTodo);detailVisible = false" status="success" type="text"><template #icon><icon-check /></template></a-button>
            </a-tooltip>
            <a-tooltip content="关闭">
              <a-button @click="detailVisible = false" status="danger" type="text"><template #icon><icon-close /></template></a-button>
            </a-tooltip>
          </template>
        </a-modal>

        <a-space fill direction="vertical">
          <a-collapse :default-active-key="[]">
            <a-collapse-item :key="1" header="查询面板">
              <QueryPanel />
            </a-collapse-item>
            <a-collapse-item :key="2" header="操作栏">
              <a-space>
                <a-button type="primary" @click="router.push({name: 'addTodo'})">添加待办</a-button>
                <a-button v-show="false" type="primary" disabled status="danger" @click="testFunc1">测试1</a-button>
                <a-button v-show="false" type="primary" status="danger" @click="testFunc2">测试2 - 获取信息</a-button>
              </a-space>
            </a-collapse-item>
          </a-collapse>

          <TodoList :items="todoStore.todos" />
        </a-space>
      </a-spin>
    </simplebar>
  </div>
</template>

<script setup lang='ts'>
import { useSettingsStore } from '@/store/useSettingsStore';
let settingsStore = useSettingsStore();
// 验证登录
import { useUserStore } from "@/store/useUserStore"
import TodoList from '@/components/TodoList.vue'
import { vaildLogin } from '@/plugins/utils_user';


if (settingsStore.mode === 'online') {
  let userStore = useUserStore();
  vaildLogin({account: userStore.account});
}
// END 验证登陆状态
import simplebar from 'simplebar-vue';
import 'simplebar-vue/dist/simplebar.min.css';
import TodoDetail from '@/components/TodoDetail.vue';
import { IconAt, IconRedo, IconCheck, IconClose, IconEdit } from '@arco-design/web-vue/es/icon'
import { emitter } from '@/emitter';
// import {Notification} from '@arco-design/web-vue'
import { refreshLoop } from "@/support/todoLoop";
import QueryPanel from '@/components/QueryPanel.vue';
import { useTodoStore } from "@/store/useTodoStore";
import {
  Todo,
  UpdateEvent,
  updateTodoInjectionKey,
  deleteTodoInjectionKey,
  refreshTodosInjectionKey,
  todoFilter,
  addTodoInjectionKey
} from "@/types";
import {useRouter} from 'vue-router'

import { inject, onUnmounted, ref, toRaw, watchEffect } from "vue";
import {AxiosInstance} from "axios";

let router = useRouter();
let todoStore = useTodoStore();
let focusTodo = ref<Todo>({
  id: '',
  title: '',
  content: '',
  brief: '',
  status: '',
  type: '',
  tags: [],
  repeatOption: {
    type: 'Times',
    totalTimes: 1,
    restTimes: 1,
  },
  notificationOption: {
    type: 'None'
  },
  resetOption: {
    type: 'None',
  },
  origin: {
    origin: 'self'
  }
})
// let filterTodos = inject(filterTodosInjectionKey)!;
let loading = ref(false);
// let query = ref<todoFilter>({
//   enable: false,
//   title: '',
//   tags: [],
//   tagMode: false,
//   sortByStatus: false,
// })
let detailVisible = ref(false);
emitter.on('updateQueryClause', (queryClause: todoFilter) => {
  // Object.assign(query.value, queryClause)
  todoStore.query = queryClause;
  refreshTodos();
});
// function updateQueryClause(queryClause: todoQueryClause) {
//   Object.assign(query, queryClause)
// }
// let filteredTodos = computed(() => filterTodos(todoStore.todos, query.value))
// let getAllTodo = inject(getAllTodoInjectionKey)!;
// let getTodoPage = inject(getTodoPageInjectionKey)!;
let refreshTodos = inject(refreshTodosInjectionKey)!;
let deleteTodo = inject(deleteTodoInjectionKey)!;
// let updateTodoStatus = inject(updateTodoStatusInjectionKey)!;
let updateTodo = inject(updateTodoInjectionKey)!;
// let completeTodoOnce = inject(completeTodoOnceInjectionKey)!;


function updateTodoStatus(UpdateEvent: UpdateEvent) {
    loading.value = true;
    let t = todoStore.todos.filter((todo) => todo.id === UpdateEvent.id);
    if (t.length) {
      let t_copy = <Todo>{};
      Object.assign(t_copy, toRaw(t[0]))
      if (t_copy.repeatOption.type === 'Times') {
        UpdateEvent.repeatOption = {...t_copy.repeatOption};
        UpdateEvent.repeatOption.restTimes = UpdateEvent.repeatOption.totalTimes
      }
      updateTodo(UpdateEvent).then(() => {
        if (t[0].repeatOption.type === 'Times') {
          t[0].repeatOption.restTimes = t[0].repeatOption.totalTimes
        }
        t[0].status = UpdateEvent.status!;
      }).finally(() => loading.value = false)
    }
}
function completeTodoOnce(todo: Todo) {
  if (todo.repeatOption.type === 'Times' &&
      todo.status === 'processing')
  {
    if (todo.repeatOption.restTimes - 1 <= 0) {
      return updateTodo({id: todo.id, status: 'success', repeatOption: {...toRaw(todo.repeatOption), restTimes: todo.repeatOption.totalTimes}})
    }else {
      return updateTodo({id: todo.id, repeatOption: toRaw(todo.repeatOption)})
    }
  }else {
    return updateTodo({id: todo.id, status: 'success'})
  }
}
emitter.on('refreshTodos', function () {
  loading.value = true;
  refreshTodos().finally(() => loading.value = false)
})
emitter.on('deleteTodo', function (id: string) {
  loading.value = true;
  deleteTodo(id).then(() => {
    emitter.emit('refreshTodos');
  }).catch(() => {loading.value = false;});
})
emitter.on('updateTodoStatus', updateTodoStatus)
emitter.on('showTodoDetail', function (todo) {
    focusTodo.value = todo as Todo;
    detailVisible.value = true;
})
emitter.on('completeTodoOnce', (todo: Todo) => {
  loading.value = true;
  // console.log(1);
  completeTodoOnce(todo).then(() => {
    if (todo.repeatOption.type === 'Times' &&
        todo.status === 'processing')
    {
      if (todo.repeatOption.restTimes > 0) {
        todo.repeatOption.restTimes--;
      }
      if (todo.repeatOption.restTimes <= 0) {
        todo.status = 'success';
      }
    }else {
      todo.status = 'success'
    }
  }).finally(() => loading.value = false)
})

watchEffect(() => {
  refreshLoop(todoStore.todos, updateTodoStatus)
})

onUnmounted(() => {
  emitter.off('refreshTodos')
  emitter.off('completeTodoOnce')
  emitter.off('showTodoDetail')
  emitter.off('deleteTodo')
  emitter.off('updateTodoStatus')
})



emitter.emit('refreshTodos')
// function DEBUGFunc_avoidEmptyTodos() {

//   if (settingsStore.mode === 'offline') {
//     if (!todoStore.todos.length) {
//       db.todos.add({
//         id: 'ashgfiuhy1',
//         title: `第1个自定义todo`,
//         content: `这是详情，还**支持**\`markdown\`哦`,
//         brief: `概述而已，查看详情点右上角`,
//         tags: ['共用标签', `私有标签 - 1`, '随意标签'],
//         status: 'default',
//         type: 'markdown',
//         repeatOption: {
//           type: 'Times',
//           totalTimes: 1,
//           restTimes: 1,
//         },
//         resetOption: {
//           type: 'None',
//         },
//         origin: {
//           origin: 'self'
//         }
//       })
//       db.todos.add({
//         id: 'ashgfiuhy2',
//         title: `第贰个自定义todo`,
//         content: `这是详情，还**支持**\`markdown\`哦\nemmmm...但是这只是一个普通的纯文本，不支持markdown`,
//         brief: `概述，详情点RT`,
//         tags: ['共用标签', `私有标签 - 2`, '再来一个', '也可以有四个'],
//         status: 'processing',
//         type: 'text',
//         repeatOption: {
//           type: 'Times',
//           totalTimes: 1,
//           restTimes: 1,
//         },
//         resetOption: {
//           type: 'WeekSpecificDay',
//           lastTrigger: Date.now() - 24*1000*3600,
//           days: [6, 0, 1, 2, 3, 5, 4]
//         },
//         origin: {
//           origin: 'self'
//         }
//       })
//       db.todos.add({
//         id: 'ashgfiuhy3',
//         title: `第③个自定义todo`,
//         content: `> 这次真的是markdown了`,
//         brief: `概述而已，查看详情点右上角`,
//         tags: ['共用标签', `私有标签 - 1`, '随意标签', '超出隐藏ahsugyuiayiutfyubfjasiodyaduyt'],
//         status: 'default',
//         type: 'markdown',
//         repeatOption: {
//           type: 'Times',
//           totalTimes: 5,
//           restTimes: 5,
//         },
//         resetOption: {
//           type: 'None',
//         },
//         origin: {
//           origin: 'self'
//         }
//       })
//       db.todos.add({
//         id: 'ashgfiuhy4',
//         title: `第Ⅳ个自定义todo`,
//         content: `> 其实上一个是有次数的  \n\n来个链接 [Bilibili](https://bilibili.com)`,
//         brief: `其实上一个是有次数的~`,
//         tags: ['共用标签', `私有标签 - 4`],
//         status: 'default',
//         type: 'markdown',
//         repeatOption: {
//           type: 'Times',
//           totalTimes: 1,
//           restTimes: 1,
//         },
//         resetOption: {
//           type: 'None',
//         },
//         origin: {
//           origin: 'self'
//         }
//       })
//     }
//     todoStore.config.page = 1;
//     emitter.emit('refreshTodos')
//   }
// }

//TODO::TESTFUNC
let addTodo = inject(addTodoInjectionKey)!;
function testFunc1() {
  let todo:Todo = {
    id: 'T1002',
    title: '远程Todo测试2',
    brief: '不带item',
    content: '简单介绍',
    status: 'default',
    type: 'text',
    tags: ['1','2', '4'],
    repeatOption: {
      totalTimes:1,
      restTimes:1,
      type: 'Times'
    },
    resetOption: {
      type: 'None',
    },
    notificationOption: {
      type: 'None'
    },
    origin: {
      origin: 'remote',
      source: 'testUser',
    }
  }
  addTodo(todo)
}
let serverAxios = inject('serverAxios') as AxiosInstance;
function testFunc2() {
  serverAxios.post('/api/user/joinedGroups', {}, {headers: {token: useUserStore().token}})
}

//END TESTFUNC

</script>

<style scoped>
.todoContainer {
  height: 100%;
}
  .todoList {
    display: block;
    padding: 20px;
    background-color: #fff;
  }
</style>
<style>
.onlyY .simplebar-track.simplebar-horizontal {
  display: none;
}
</style>