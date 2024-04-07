<template>
<div class="whole">
  <div class="header">
    <a-typography-title :heading="3" class="title">Mew todo</a-typography-title>
    <div v-if="settingsStore.mode === 'online'" class="right">
      <a-avatar :image-url="userStore.basicInfo.avatar" class="forbidSelect" :size="32">
        <span v-if="!userStore.basicInfo.avatar">{{ userStore.basicInfo.nickname.substring(0, 3) }}</span>
      </a-avatar>
    </div>
  </div>
  <div class="main">
    <div ref="el_sidebar" class="sider">
      <SideBar />
    </div>
    <div ref="el_content" class="content">
      <RouterView calss="routerView" />
    </div>
  </div>
</div>
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
import SideBar from "@/components/SideBar.vue";
import { provide, watch, watchEffect } from "vue";

import { Notification } from "@arco-design/web-vue";
import '@arco-design/web-vue/lib/notification/style/index.css'

// import simplebar from 'simplebar-vue';
import 'simplebar-vue/dist/simplebar.min.css';
import { useSettingsStore } from "./store/useSettingsStore";
let settingsStore = useSettingsStore();
import { useUserStore } from "./store/useUserStore";
let userStore = useUserStore()
import { db } from "./db";
import { Todo, TodoChanges, UpdateEvent, addTodoInjectionKey, deleteTodoInjectionKey, deleteTodoResponse, filterTodosInjectionKey, getAllTodoInjectionKey, getTodoInjectionKey, getTodoPageInjectionKey, getTodoPageResponse, getTodoResponse, refreshTodosInjectionKey, simpleResponse, standardResponse, todoFilter, updateTodoInjectionKey, updateTodoResponse, userLogoutInjectionKey } from "./types";
import axios, { AxiosResponse } from "axios";
import { useTodoStore } from "./store/useTodoStore";
let todoStore = useTodoStore();


let serverAxios = axios.create({
    baseURL: settingsStore.server.url,
    headers: {
      apifoxToken: 'XUhpFgVLLk8CLYrh_Mpx3',
    },
    data: {
      token: '',
    },
    timeout: 10000,
})

serverAxios.interceptors.request.use(config => config, (err: Error) => {
  Notification.error({
      title: '错误',
      content: err.message,
  })
})
provide('serverAxios', serverAxios)
watchEffect(() => { //实时更新服务器地址
  serverAxios.defaults.baseURL = settingsStore.server.url
})
watch(() => userStore.token, () => { //实时更新header的token
  serverAxios.defaults.data.token = userStore.token
})

function filterTodos(todos: Todo[], query: todoFilter) {
  if (query.enable) {
    let tmpResult = todos.filter((todo) => {
      //查询标题
      try {
        let titleRegexp = new RegExp(query.title)
        if (!titleRegexp.test(todo.title)) {
          return false;
        }
      } catch {}
      //查询tags
      if (query.tags.length) {
        try {
          if (query.tagMode) {
            if (!query.tags.some((item) => {return todo.tags.includes(item)})) {
              return false;
            }
          }else {
            if (!query.tags.every((item) => {return todo.tags.includes(item)})) {
              return false;
            }
          }
        }catch{}
      }
      return true;
    })
    if (query.sortByStatus) {
      let statusReflection = <Record<string, number>>{
        'processing': 1,
        'default': 2,
        'success': 3,
      }
      tmpResult.sort((a, b) => {
        return statusReflection[a.status] - statusReflection[b.status]
      })
    }
    return tmpResult
  }else {
    return todos;
  }
}
function getAllTodo() {
  if (settingsStore.mode === 'offline') {
    return new Promise<standardResponse<Todo[]>>((resolve, reject) => {
      db.todos.toArray().then((res: Todo[] | undefined) => {
        resolve({
          code: 200,
          status: 'success',
          data: res || []
        })
      }).catch((err: Error) => {
        reject(err)
      })
    })
  }else {
    return new Promise<standardResponse<Todo[]>>((resolve, reject) => {
      let np = 1; // 当前页
      let tp = -1; //总页数
      let result = <Todo[]>[];
      serverAxios.post('/api/todos/get/user', {
        page: np,
        pageNum: todoStore.config.pageNum,
        filter: todoStore.query
      }).then((res: AxiosResponse<getTodoPageResponse>) => {
        tp = Math.ceil(res.data.data!.total / todoStore.config.pageNum);
        result.push(...res.data.data!.todos);
        getNextPage();
      }).catch((err: Error) => {
        reject(err)
      })
      function getNextPage() {
        np++;
        if (np > tp) {
          resolve({
            code: 200,
            status: 'success',
            data: result
          });
        }else {
          serverAxios.post('/api/todos/get/user', {
            page: np,
            pageNum: todoStore.config.pageNum,
            filter: todoStore.query
          }).then((res: AxiosResponse<getTodoPageResponse>) => {
            result.push(...res.data.data!.todos);
            getNextPage();
          }).catch((err: Error) => {
            reject(err)
          })
        }
      }
      
    })
  }
}
function getTodoPage(pn: number = todoStore.config.page) {
  if (settingsStore.mode === 'offline') {
    return new Promise<getTodoPageResponse>((resolve, reject) => {
      db.todos.toArray().then((res: Todo[] | undefined) => {
        res = res || [];
        resolve({
          code: 200,
          status: 'success',
          data: {
            todos: filterTodos(res, todoStore.query).slice((todoStore.config.page - 1) * todoStore.config.pageNum, todoStore.config.page * todoStore.config.pageNum),
            total: res.length
          }
        })
      }).catch((err: Error) => {
        reject(err)
      })
    })
  }else {
    return new Promise<getTodoPageResponse>((resolve, reject) => {
      serverAxios.post('/api/todos/get/user', {
        page: pn,
        pageNum: todoStore.config.pageNum,
        filter: todoStore.query
      }).then((res: AxiosResponse) => {
        resolve(res.data)
      }).catch((err: Error) => {
        reject(err)
      })
    })
  }
}
function refreshTodos() {
  return new Promise<void>((resolve, reject) => {
    getTodoPage().then((res: getTodoPageResponse) => {
      if (res.code === 200) { //200一定有返回
        todoStore.todos = filterTodos(res.data?.todos || [], todoStore.query)
        todoStore.config.total = res.data!.total;
        resolve()
      }else {
        reject(new Error(res.status))
      }
    }).catch((err: Error) => {
      reject(err)
    })
  })
}
function getTodo(id: string) {
  if (settingsStore.mode === 'offline') {
    return new Promise<getTodoResponse>((resolve, reject) => {
      db.todos.get(id).then((res: Todo | undefined) => {
        if (res) {
          resolve({
            code: 200,
            status: 'success',
            data: res
          })
        }else {
          resolve({
            code: 201,
            status: 'error'
          })
        }
        
      }).catch((err: Error) => {
        reject(err)
      })
    })
  }else {
    return new Promise<standardResponse<Todo>>((resolve, reject) => {
      serverAxios.post('/api/todo/get/user').then((res: AxiosResponse) => {
        resolve(res.data)
      }).catch((err: Error) => {
        reject(err)
      })
    })
  }
}
function updateTodo(UpdateEvent: UpdateEvent) {
  let Update: TodoChanges = {};
  Object.assign(Update, UpdateEvent)
  if ('id' in Update) {
    delete Update.id;
  }
  if (settingsStore.mode === 'offline') {
    return new Promise<standardResponse<number>>((resolve, reject) => {
      db.todos.update(UpdateEvent.id, Update).then((res: number) => {
        resolve({
          code: 200,
          status: 'success',
          data: res
        })
      }).catch((err: Error) => {
        reject(err)
      })
    })
  }else {
    return new Promise<standardResponse<number>>((resolve, reject) => {
      serverAxios.post('/api/todo/update/user', {
        id: UpdateEvent.id,
        changes: Update
      }).then((res: AxiosResponse<updateTodoResponse>) => {
        resolve(res.data)
      }).catch((err: Error) => {
        reject(err)
      })
    })
  }
}
// function updateTodoStatus(UpdateEvent: UpdateEvent) {
//   // console.log(6);
//   return new Promise<standardResponse<number>>((resolve, reject) => {
//     let newUpdate: UpdateEvent = {id: ''};
//     Object.assign(newUpdate, UpdateEvent);
//     if (UpdateEvent.status === 'default' || UpdateEvent.status === 'success') {
//       // console.log(8);
//       getTodo(UpdateEvent.id).then((res: standardResponse<Todo | undefined>) => {
//         // console.log(9);
//         let todo = res.data
//         if (todo !== undefined) {
//           newUpdate.repeatOption = todo.repeatOption;
//           if (newUpdate.repeatOption.type === 'Times') {
//             newUpdate.repeatOption.restTimes = newUpdate.repeatOption.totalTimes;
//           }
//           // console.log(newUpdate);
//           updateTodo(newUpdate).then(result => {
//             resolve(result)
//           }).catch(err => {
//             reject(err)
//           })
//         }else {
//           // console.log(10);
//           reject(new Error('todo is undefined'))
//         }
//       }).catch((err: Error) => {
//         console.log(11, UpdateEvent);
//         reject(err)
//       })
//     }else {
//       // console.log(7);
//       updateTodo(newUpdate).then(result => {
//         resolve(result)
//       }).catch(err => {
//         reject(err)
//       })
//     }
//   })
// }
provide(refreshTodosInjectionKey, refreshTodos)
provide(getTodoInjectionKey, getTodo)
provide(deleteTodoInjectionKey, (id: string) => {
  if (settingsStore.mode === 'offline') {
    return new Promise<simpleResponse>((resolve, reject) => {
      db.todos.delete(id).then(() => {
        resolve({
          code: 200,
          status: 'success',
        })
      }).catch((err: Error) => {
        reject(err)
      })
    })
  }else {
    return new Promise<simpleResponse>((resolve, reject) => {
      serverAxios.post('/api/todo/delete/user', {id}).then((res: AxiosResponse<deleteTodoResponse>) => {
        resolve(res.data)
      }).catch((err: Error) => {
        reject(err)
      })
    })
  }
})
provide(getAllTodoInjectionKey, getAllTodo)
provide(getTodoPageInjectionKey, getTodoPage)
provide(addTodoInjectionKey, (todo: Todo) => {
  if (settingsStore.mode === 'offline') {
    return new Promise<standardResponse<string>>((resolve, reject) => {
      db.todos.add(todo).then((res: string) => {
        resolve({
          code: 200,
          status: 'success',
          data: res
        })
      }).catch((err: Error) => {
        reject(err)
      })
    })
  }else {
    return new Promise<standardResponse<string>>((resolve, reject) => {
      serverAxios.post('/api/todo/add/user').then((res: AxiosResponse) => {
        resolve(res.data)
      }).catch((err: Error) => {
        reject(err)
      })
    })
  }
})
provide(updateTodoInjectionKey, updateTodo)
provide(filterTodosInjectionKey, filterTodos)
// provide(updateTodoStatusInjectionKey, updateTodoStatus)
// provide(completeTodoOnceInjectionKey, (todo: Todo) => {
//   return new Promise<standardResponse<number>>((resolve, reject) => {
//     if (todo.repeatOption.type === 'Times' &&
//         todo.status === 'processing') 
//     {
//       if (todo.repeatOption.restTimes > 0) {
//         todo.repeatOption.restTimes--;
//       }
//       if (todo.repeatOption.restTimes <= 0) {
//         updateTodoStatus({id: todo.id, status: 'success'}).then(val => {
//           resolve(val)
//         }).catch(err => {
//           reject(err)
//         })
//       }else {
//         updateTodo({id: todo.id, repeatOption: toRaw(todo.repeatOption)}).then(val => {
//           resolve(val)
//         }).catch(err => {
//           reject(err)
//         })
//       }
//     } else {
//       updateTodoStatus({id: todo.id, status: 'success'}).then(val => {
//         resolve(val)
//       }).catch(err => {
//         reject(err)
//       })
//     }
//   })
// })
function userLogout() {
  return new Promise<simpleResponse>((resolve, reject) => {
    serverAxios.post('/api/user/logout').then((res: AxiosResponse) => {
      if (res.data.code === 200) {
        userStore.token = '';
        userStore.account = '';
        userStore.basicInfo = {
          nickname: '',
          avatar: ''
        };
        settingsStore.mode = 'offline'
        resolve(res.data)
      }else {
        reject(new Error(res.data.status))
      }
    }).catch((err: Error) => {
      reject(err)
    })
  })
}
provide(userLogoutInjectionKey, userLogout)

if ('Notification' in window) {
  window.Notification.requestPermission()
}

</script>

<style scoped>
body {
  background-color: #fff;
  position: relative;
}
.ant-layout-sider, .ant-layout-header {
background-color: transparent;
}
.whole {
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  left: 0;
  right: 0;
  background-color: #fff;
  display: flex;
  align-items: center;
  height: 64px;
  border-bottom: 1px solid #eee;
}
.header .title {
  margin: 0 30px 0;
  line-height: 64px;
}
.header .right {
  margin-left: auto;
  margin-right: 20px;
}
.main {
  flex: 1;
  display: flex;
}
.routerView {
  width: 100%;
  height: 100%;
}
.sider {
  position: sticky;
  top: 64px;
  z-index: 99;
  display: inline-block;
  height: calc(100vh - 64px);
  border-right: 1px solid #eee;
  overflow-y: hidden;
}
.content {
  flex: 1;
  overflow: auto;
  height: calc(100vh - 64px);
}
</style>