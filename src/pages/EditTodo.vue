<template>
<TodoEdit v-model="form">
    <a-form-item>
        <a-button @click="edit">提交编辑</a-button>
    </a-form-item>
</TodoEdit>
</template>
    
<script setup lang='ts'>
import TodoEdit from '@/components/TodoEdit.vue';
import { useSettingsStore } from '@/store/useSettingsStore';
let settingsStore = useSettingsStore();
// 验证登录
import { useUserStore } from "@/store/useUserStore"
import { vaildLogin } from '@/plugins/utils_user';


if (settingsStore.mode === 'online') {
  let userStore = useUserStore();
  vaildLogin({account: userStore.account});
}
// END 验证登陆状态

import {inject, reactive, ref, toRaw} from 'vue'
import { useRoute, useRouter } from 'vue-router';
import {Notification} from '@arco-design/web-vue'
import '@arco-design/web-vue/lib/notification/style/index.css'
import { MdEditor } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import { UpdateEvent, getTodoInjectionKey, todo_resetOption_weekSpecificDay, updateTodoInjectionKey } from '@/types';
let currentStep = ref(1)
let route = useRoute();
let router = useRouter();
let form = reactive<>({
    id: '',
    title: '',
    brief: '',
    tags: <string[]>[],
    tagInputVal: '',
    type: 'markdown',
    content: '',
    repeatType: 'Times',
    resetType: 'None',
    Times: {
        totalTimes: 1,
    },
    Interval: {
        initTime: '',
        interval: {
            hour: 0,
            minute: 0,
            second: 0,
        },
    },
    withNotification: {
        enable: false,
        msg: '',
    },
    WeekSpecificDay: {
        days: <number[]>[]
    }
    
})
let id = route.query.id as string
let getTodo = inject(getTodoInjectionKey)!;
let updateTodo = inject(updateTodoInjectionKey)!;
function tagInputBlur() {
    if (form.tagInputVal) {
        form.tags.push(form.tagInputVal);
        form.tagInputVal='';
    }
}
getTodo(id).then((res) => {
    let todo = res.data
    if (todo !== undefined) {
    Object.assign(form, {
        id: id,
        title: todo.title,
        brief: todo.brief,
        tags: todo.tags,
        content: todo.content,
        type: todo.type,
        WeekSpecificDay: {
            days: (<todo_resetOption_weekSpecificDay>todo.resetOption).days || reactive([]),
        },
        resetType: todo.resetOption.type,
        repeatType: todo.repeatOption.type,
    })
    if (todo.repeatOption.type === 'Times') {
        Object.assign(form.Times, {
            totalTimes: todo.repeatOption.totalTimes,
        })
    }
}else {
    Notification.error({
        title: '错误',
        content: '不存在的id'
    })
}
}).catch((err: Error) => {
    Notification.error({
        title: '错误',
        content: err.message
    })
})

function edit() {
    let tmpChanges: UpdateEvent = {
        id: id,
        title: form.title,
        brief: form.brief,
        content: form.content,
        status: 'default',
        type: form.type,
        tags: toRaw(form.tags),
        repeatOption: {
            type: 'Times',
            totalTimes: 1,
            restTimes: 1,
        },
        resetOption: {
            type: 'None'
        }
    }
    if (form.repeatType === 'Times') {
        tmpChanges.repeatOption = {
            type: 'Times',
            totalTimes: form.Times.totalTimes,
            restTimes: form.Times.totalTimes,
        }
    }else if (form.repeatType === 'Interval') {
        let initTime = new Date(form.Interval.initTime).getTime();
        let trigger = initTime
        let interval = form.Interval.interval.hour * 1000*3600 +
                        form.Interval.interval.minute * 1000*60 +
                        form.Interval.interval.second * 1000;
        while (trigger < Date.now()) {
            trigger += interval
        }
        tmpChanges.repeatOption = {
            type: 'Interval',
            initTime: initTime,
            trigger: trigger,
            interval: interval,
        }
        if (form.withNotification.enable) {
            tmpChanges.notificationMessage = {
                repeat: form.withNotification.msg
            }
        }
    }
    if (form.resetType === 'WeekSpecificDay') {
        let resetOption: todo_resetOption_weekSpecificDay = {
            type: 'WeekSpecificDay',
            lastTrigger: Date.now(),
            days: toRaw(form.WeekSpecificDay.days),
        }
        tmpChanges.resetOption = resetOption;
    }
    updateTodo(tmpChanges).then(() => {
        Notification.success({
            title: '成功',
            content: `成功修改${id}`
        })
        router.push({
            name: 'todo'
        })
    }).catch((err: Error) => {
        Notification.error({
            title: '错误',
            content: err.message
        })
    })
}

</script>

<style scoped>
.container {
    padding: 20px;
}
.formConatiner {
    max-width: 600px;
}
#totalTimes .arco-input-prepend {
    padding: 0;
}
/* .input {
    width: 400px;
} */
</style>