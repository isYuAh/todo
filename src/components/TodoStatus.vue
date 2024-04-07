<template>
    <div class="container">
        <div v-show="todo.status !== 'default'" :class="{
                mask: true,
                processing: todo.status === 'processing',
                success: todo.status === 'success'
            }">
            <div :class="{
                text: true,
                processing: todo.status === 'processing',
                success: todo.status === 'success'
            }" v-text="maskText[todo.status || 'default']"></div>
            <div class="left-bottom">
                <span v-if="showTimesCount" class="LBTipText restTimes">{{ (props.todo.repeatOption as todo_repeatOption_someTimes).restTimes }}</span>
            </div>
        </div>
        <slot></slot>
    </div>
</template>

<script setup lang='ts'>
import { translationMap_todoStatus } from '@/support/translationMap';
import { Todo, todo_repeatOption_someTimes } from '@/types';
import { computed } from 'vue';

let maskText = translationMap_todoStatus
let props = defineProps<{
    todo: Todo,
}>()
let showTimesCount = computed(() => {
    return  props.todo.repeatOption.type === 'Times' &&
            props.todo.status === 'processing' &&
            props.todo.repeatOption.totalTimes > 1
})
</script>

<style scoped>
    .container {
        position: relative;
    }
    .mask {
        pointer-events:none;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background-color: rgba(255, 255, 255, .28);
        /* background-color: #165DFF0c; */
        z-index: 10;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .mask.processing {
        /* border: 1px solid #165DFF; */
        box-shadow: 0 0 10px #165DFF1a;
    }
    .mask.success {
        /* border: 1px solid #00B42A; */
        box-shadow: 0 0 10px #00B42A1a;
    }
    .mask .text {
        font-size: 26px;
        transform: rotate(25deg);
        -webkit-text-stroke: 1px #ffffff8a;
    }
    .mask .text.processing {
        color: #165DFF;
    }
    .mask .text.success {
        color: #00B42A;
    }
    .mask .right-bottom {
        position: absolute;
        bottom: 0;
        display: flex;
        right: 0;
        justify-content: flex-end;
    }
    .ActionButton:hover {
        background-color: rgba(0, 0, 0, .05);
    }
    .right-top {
        position: absolute;
        right: 0;
        top: 0;
    }
    .left-bottom {
        color: #4080FF;
        position: absolute;
        left: 5px;
        bottom: 5px;
    }
    .LBTipText {
        font-weight: bold;
        font-style: italic;
    }
</style>