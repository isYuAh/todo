<template>
    <div class="container">
        <a-steps changeable :current="currentStep" @change="(cur:number) => {currentStep = cur}">
            <a-step>基本信息</a-step>
            <a-step>内容编辑</a-step>
            <a-step>额外设置</a-step>
        </a-steps>
        <a-divider/>
        <a-form class="formConatiner" :model="form" v-show="currentStep === 1">
            <a-form-item label="id" class="basicItem">
                <a-input disabled v-model="form.id" class="input" placeholder="必须唯一"></a-input>
            </a-form-item>
            <a-form-item label="标题" class="basicItem">
                <a-input v-model="form.title" class="input"></a-input>
            </a-form-item>
            <a-form-item label="标签" class="basicItem">
                <a-input-tag @press-enter="form.tagInputVal = ''" @blur="tagInputBlur" v-model:input-value="form.tagInputVal" v-model:="form.tags" :retain-input-value="true" class="input"></a-input-tag>
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
            <MdEditor previewTheme="vuepress" v-if="form.type==='markdown'" v-model="form.content" />
            <a-textarea v-if="form.type==='text'" v-model="form.content" placeholder="输入详细内容" :auto-size="{
                minRows: 10,
            }"/>
        </div>
        <div class="thirdSettings" v-show="currentStep === 3">
            <a-form :model="form" class="formConatiner">
                <div class="repeatType">
                <a-form-item label="选择重复类型">
                    <a-select v-model="form.repeatType">
                        <a-option :value="'Times'">计数</a-option>
                        <a-option :value="'Interval'">特定间隔</a-option>
                    </a-select>
                </a-form-item>
                <div class="TimesForm">
                    <a-form-item v-if="form.repeatType === 'Times'" label="总次数">
                        <a-input-number id="totalTimes" :min='1' mode="button" v-model="form.Times.totalTimes"></a-input-number>
                    </a-form-item>
                </div>
                <div class="IntervalForm">
                    <a-form-item v-if="form.repeatType === 'Interval'" label="初始时间">
                        <a-date-picker
                            style="width: 220px; margin: 0 24px 24px 0;"
                            show-time
                            v-model="form.Interval.initTime"
                            format="YYYY-MM-DD HH:mm:ss"
                        />
                    </a-form-item>
                    <a-form-item v-if="form.repeatType === 'Interval'" label="间隔">
                        <a-input-number v-model="form.Interval.interval.hour" :style="{width:'120px'}">
                            <template #suffix>
                                小时
                            </template>
                        </a-input-number>
                        <a-input-number v-model="form.Interval.interval.minute"  :style="{width:'120px'}">
                            <template #suffix>
                                分钟
                            </template>
                        </a-input-number>
                        <a-input-number v-model="form.Interval.interval.second" :style="{width:'120px'}">
                            <template #suffix>
                                秒
                            </template>
                        </a-input-number>
                    </a-form-item>
                    <a-form-item v-if="form.repeatType === 'Interval'">
                        <a-checkbox v-model="form.withNotification.enable">附带通知</a-checkbox>
                    </a-form-item>
                    <a-form-item v-if="form.withNotification.enable" label="通知内容">
                        <a-textarea v-model="form.withNotification.msg"></a-textarea>
                    </a-form-item>
                </div>
            </div>
                <div class="resetType">
                    <a-form-item label="选择重置类型">
                        <a-select v-model="form.resetType">
                            <a-option :value="'None'">不自动重置</a-option>
                            <a-option :value="'WeekSpecificDay'">每周特定日期重置</a-option>
                        </a-select>
                    </a-form-item>
                    <div class="WeekSpecificDayForm">
                        <a-form-item v-show="form.resetType === 'WeekSpecificDay'" label="选择日期">
                            <a-checkbox-group v-model="form.WeekSpecificDay.days">
                                <a-space :wrap="true">
                                    <a-checkbox class="DayCheckbox" :value="0">周日</a-checkbox>
                                    <a-checkbox class="DayCheckbox" :value="1">周一</a-checkbox>
                                    <a-checkbox class="DayCheckbox" :value="2">周二</a-checkbox>  
                                    <a-checkbox class="DayCheckbox" :value="3">周三</a-checkbox>  
                                    <a-checkbox class="DayCheckbox" :value="4">周四</a-checkbox>  
                                    <a-checkbox class="DayCheckbox" :value="5">周五</a-checkbox>  
                                    <a-checkbox class="DayCheckbox" :value="6">周六</a-checkbox>
                                </a-space>
                            </a-checkbox-group>
                        </a-form-item>
                    </div>
                </div>
                <a-form-item>
                    <a-button @click="edit">提交编辑</a-button>
                </a-form-item>
            </a-form>
        </div>
    </div>
</template>
    
<script setup lang='ts'>

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
let form = reactive({
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