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
        <a-form :model="form" class="formContainer">
            <div class="repeatOption">
                <a-form-item label="选择重复类型">
                    <a-select v-model="form.repeatType">
                        <a-option :value="'Times'">计数</a-option>
                    </a-select>
                </a-form-item>
                <div class="TimesForm">
                    <a-form-item v-if="form.repeatType === 'Times'" label="总次数">
                        <a-input-number id="totalTimes" :min='1' mode="button" v-model="form.repeat_Times.totalTimes"></a-input-number>
                    </a-form-item>
                </div>
            </div>
            <div class="notificationOption">
                <a-form-item label="选择提醒类型">
                    <a-select v-model="form.notificationType">
                        <a-option :value="'None'">无</a-option>
                        <a-option :value="'Interval'">每隔一定间隔</a-option>
                    </a-select>
                </a-form-item>
                <div class="IntervalForm">
                    <a-form-item v-if="form.notificationType === 'Interval'" label="初始时间">
                        <a-date-picker
                            style="width: 220px; margin: 0 24px 24px 0;"
                            show-time
                            v-model="form.notify_Interval.initTime"
                            format="YYYY-MM-DD HH:mm:ss"
                        />
                    </a-form-item>
                    <a-form-item v-if="form.notificationType === 'Interval'" label="间隔">
                        <a-input-number :min='0' v-model="form.notify_Interval.interval.hour" :style="{width:'120px'}">
                            <template #suffix>
                                小时
                            </template>
                        </a-input-number>
                        <a-input-number :min='0' v-model="form.notify_Interval.interval.minute"  :style="{width:'120px'}">
                            <template #suffix>
                                分钟
                            </template>
                        </a-input-number>
                        <a-input-number :min='0' v-model="form.notify_Interval.interval.second" :style="{width:'120px'}">
                            <template #suffix>
                                秒
                            </template>
                        </a-input-number>
                    </a-form-item>
                    <a-form-item v-if="form.notificationType !== 'None'" label="通知内容">
                        <a-textarea v-model="form.notificationText"></a-textarea>
                    </a-form-item>
                </div>
            </div>
            <div class="resetOption">
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
            <slot></slot>
        </a-form>
    </div>
</div>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import { MdEditor } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
let currentStep = ref(1)
const form = defineModel({
    required: true,
    type: Object
});
console.log(form);
function tagInputBlur() {
    if (form.value.tagInputVal) {
        form.value.tags.push(form.value.tagInputVal);
        form.value.tagInputVal='';
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