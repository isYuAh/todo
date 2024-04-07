<template>
<div class="container">
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
        <MdEditor style="height: 600px;width: 100%;" editor-id="addTodo" previewTheme="vuepress" v-if="form.type==='markdown'" v-model="form.content" />
        <a-textarea v-if="form.type==='text'" v-model="form.content" placeholder="输入详细内容" :auto-size="{
            minRows: 10,
        }"/>
    </div>
    <div class="thirdSettings" v-show="currentStep === 3">
        <a-form :model="form" class="formContainer">
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
                <div class="WeekSpecficDayForm">
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
                <a-button @click="addTodoTrigger">添加</a-button>
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
import { SnowflakeIdv1 } from 'simple-flakeid'
const snowflake = new SnowflakeIdv1({workerId: 1, baseTime: new Date('2024-01-01').getTime()});
import {inject, reactive, ref, toRaw} from 'vue'
import {Notification} from '@arco-design/web-vue'
import '@arco-design/web-vue/lib/notification/style/index.css'
import { MdEditor } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import { Todo, addTodoInjectionKey } from '@/types';
let currentStep = ref(1)
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
function tagInputBlur() {
    if (form.tagInputVal) {
        form.tags.push(form.tagInputVal);
        form.tagInputVal='';
    }
}
let addTodo = inject(addTodoInjectionKey)!;
function addTodoTrigger() {
    const id = 'L' + snowflake.NextId().toString();
    let todo:Todo = {
        id,
        title: form.title,
        brief: form.brief,
        content: form.content,
        status: 'default',
        type: form.type,
        tags: toRaw(form.tags),
        repeatOption: {
            totalTimes:1,
            restTimes:1,
            type: 'Times'
        },
        resetOption: {
            type: 'None',
        },
        origin: {
            origin: 'self'
        }
    }
    if (form.repeatType === 'Times') {
        todo.repeatOption = {
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
        todo.repeatOption = {
            type: 'Interval',
            initTime: initTime,
            trigger: trigger,
            interval: interval,
        }
        if (form.withNotification.enable) {
            todo.notificationMessage = {
                repeat: form.withNotification.msg
            }
        }
    }
    if (form.resetType === 'WeekSpecificDay') {
        todo.resetOption = {
            type: 'WeekSpecificDay',
            days: toRaw(form.WeekSpecificDay.days),
            lastTrigger: Date.now(),
        }
    }
    // console.log(todo);
    addTodo(todo).then(() => {
        Notification.success({
            title: '成功',
            content: `添加${id}成功`,
        })
    }).catch((err: Error) => {
        let content = err.message;
        if (err.name === 'ConstraintError') {
            content = '已有重复的id'
        }
        Notification.error({
            title: '失败',
            content: content,
        })
        console.log(err);
    }) 
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