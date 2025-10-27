import { createWebHistory, createRouter, RouteRecordRaw } from 'vue-router'
import Login from '@/pages/Account/Login.vue'
import Todo from '@/pages/Todo.vue'
import Settings from '@/pages/Settings.vue'
import AddTodo from '@/pages/AddTodo.vue'
import EditTodo from '@/pages/EditTodo.vue'
import General from '@/pages/settingTabPane/General.vue'
import Backup from '@/pages/settingTabPane/Backup.vue'
import Account from '@/pages/settingTabPane/Account.vue'
import Register from '@/pages/Account/Register.vue'
import ToggleAccount from '@/pages/Account/Toggle.vue'
import Server from '@/pages/settingTabPane/Server.vue'
import Usage from '@/pages/Documents/Usage.vue'
import About from '@/pages/Documents/About.vue'
import User from '@/pages/User.vue'
import Group from '@/pages/Group/Group.vue'
import Task from "@/pages/Task/Task.vue";
import AddTask from "@/pages/AddTask.vue";
import EditTask from "@/pages/EditTask.vue";

const routes:RouteRecordRaw[]  = [
  {
    name: 'account',
    path: '/account',
    children: [{
      name: 'account-login',
      path: 'login',
      component: Login,
    },{
      name: 'account-register',
      path: 'register',
      component: Register,
    },{
      name: 'account-toggle',
      path: 'toggle',
      component: ToggleAccount,
    }]
  },
  {
    name: 'todo',
    path: '/todo',
    component: Todo,
  },
  {
    name: 'user',
    path: '/user',
    component: User,
  },
  {
    name: 'task',
    path: '/task',
    component: Task,
  },
  {
    name: 'group',
    path: '/group',
    component: Group,
  },
  {
    name: 'addTodo',
    path: '/addTodo',
    component: AddTodo,
  },
  {
    name: 'editTodo',
    path: '/editTodo',
    component: EditTodo,
  },
  {
    name: 'addTask',
    path: '/addTask',
    component: AddTask,
  },
  {
    name: 'editTask',
    path: '/editTask',
    component: EditTask,
  },
  {
    name: 'document',
    path: '/document',
    children: [{
      name: 'document-usage',
      path: 'usage',
      component: Usage
    },{
      name: 'document-about',
      path: 'about',
      component: About,
    }]
  },
  {
    name: 'settings',
    path: '/settings',
    component: Settings,
    redirect: '/settings/general',
    children: [{
        name: 'settings-general',
        path: 'general',
        component: General
      },{
        name: 'settings-backup',
        path: 'backup',
        component: Backup
      },{
        name: 'settings-account',
        path: 'account',
        component: Account
      },{
        name: 'settings-account',
        path: 'account',
        component: Account
      },{
      name: 'settings-server',
      path: 'server',
      component: Server
    }]
  },
  {
    path: '/',
    redirect: '/todo'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router