<template>
<div class="todosGrid">
        <TransitionGroup name="todos-transition">
          <div class="todoItem" v-for="todo in items" :key="todo.id">
            <TodoStatus :todo="todo">
              <a-card :title="todo.title">
                <template #extra>
                  <a-tooltip :content="`${todo.id}`">
                    <a-button @click="emitter.emit('showTodoDetail', todo)" type="text"><template #icon><icon-expand /></template></a-button>
                  </a-tooltip>
                </template>
                <template #actions>
                  <a-tooltip v-if="todo.status === 'processing'" content="完成">
                      <a-button class="ActionButton" @click="emitter.emit('completeTodoOnce', todo)" type="text" status="success"><template #icon><icon-check /></template></a-button>
                  </a-tooltip>
                  <a-tooltip v-if="todo.status !== 'default'" content="撤销状态">
                      <a-button class="ActionButton" @click="emitter.emit('updateTodoStatus', {id: todo.id, status: 'default'})" type="text"><template #icon><icon-redo /></template></a-button>
                  </a-tooltip>
                  <a-tooltip v-if="todo.status === 'default'" content="处理">
                    <a-button @click="emitter.emit('updateTodoStatus', {id: todo.id, status: 'processing'})" type="text"><template #icon><icon-at /></template></a-button>
                  </a-tooltip>
                  <a-tooltip content="删除">
                    <a-button @click="emitter.emit('deleteTodo', todo.id)" type="text" status="danger"><template #icon><icon-delete /></template></a-button>
                  </a-tooltip>
                </template>
                <a-card-meta>
                  <template #description>
                    <a-space class="todoTagList" direction="vertical">
                      <a-space>
                        <a-tag color="cyan" v-for="tag in todo.tags">{{ tag }}</a-tag>
                      </a-space>
                      <a-typography-paragraph :ellipsis="{
                        rows: 4,
                        showTooltip: false,
                      }">
                        {{ todo.brief }}
                      </a-typography-paragraph>
                    </a-space>
                  </template>
                </a-card-meta>
              </a-card>
            </TodoStatus>
          </div>
        </TransitionGroup>
      </div>
      <div class="pagination">
        <a-pagination
          @change="refresh"
          :total="todoStore.config.total"
          v-model:current="todoStore.config.page"
          v-model:page-size="todoStore.config.pageNum"
          show-total/>
      </div>
</template>

<script setup lang='ts'>

import { emitter } from '@/emitter';
import { refreshTodosInjectionKey } from '@/types';
import { IconExpand, IconAt, IconDelete, IconRedo, IconCheck } from '@arco-design/web-vue/es/icon'
import { inject } from 'vue';
import {Notification} from '@arco-design/web-vue'
import '@arco-design/web-vue/lib/notification/style/index.css'
import { useTodoStore } from '@/store/useTodoStore';

let todoStore = useTodoStore();
let refreshTodos = inject(refreshTodosInjectionKey)!;
function refresh() {
  refreshTodos().then(() => {
    Notification.success({
      title: '刷新成功',
      content: '已加载'
    })
  }).catch((err: Error) => {
    Notification.error({
      title: '刷新失败',
      content: err.message
    })
  })
}
defineProps(['items'])
</script>

<style scoped>
  .todosGrid {
    display: grid;
    gap: 10px;
    grid-template-columns: repeat(auto-fill, minmax(440px, 1fr));
    grid-auto-rows: 1fr;
  }
  .todos-transition-move,
  .todos-transition-enter-active,
  .todos-transition-leave-active {
    transition: all .25s ease;
  }
  .todos-transition-enter-from,
  .todos-transition-leave-to {
    opacity: 0;
    transform: translate(30px);
  }
  .todos-transition-leave-active {
    position: absolute;
  }
  .todoTagList {
    max-width: 100%;
    overflow-x: hidden;
  }
  .pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
  }
</style>