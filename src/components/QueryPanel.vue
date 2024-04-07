<template>
<div class="container">
    <a-space direction="vertical">
        <a-typography-title :heading="5">查询</a-typography-title>
        <a-form :model="tmpFilter">
            <a-form-item class="queryItem" label="标题">
                <a-input id="borderedInput" placeholder="请输入正则表达式" v-model="tmpFilter.title"></a-input>
            </a-form-item>
            <a-form-item class="queryItem" label="标签">
                <a-input-tag @press-enter="tagInputVal = ''" id="borderedInput" v-model="tmpFilter.tags" @blur="tagInputBlur" v-model:input-value="tagInputVal" :retain-input-value="true"></a-input-tag>
                <a-switch class="tagModeSwitch" v-model="tmpFilter.tagMode">
                    <template #checked>
                        或
                    </template>
                    <template #unchecked>
                        与
                    </template>
                </a-switch>
            </a-form-item>
        </a-form>
        <a-checkbox v-model="tmpFilter.sortByStatus">按照状态排序</a-checkbox>
        <a-button-group>
            <a-tooltip content="搜索">
                <a-button @click="tmpFilter.enable=true;updateTodoFilter()" type="primary"><template #icon><icon-search /></template></a-button>
            </a-tooltip>
            <a-tooltip content="取消搜索">
                <a-button @click="tmpFilter.enable=false;updateTodoFilter()" type="primary"><template #icon><icon-undo /></template></a-button>
            </a-tooltip>
        </a-button-group>
    </a-space>
</div>
</template>

<script setup lang='ts'>
import { todoFilter } from '@/types';
import { ref } from 'vue';
import { emitter } from '@/emitter';
import { IconUndo, IconSearch } from '@arco-design/web-vue/es/icon';

function updateTodoFilter() {
    emitter.emit('updateQueryClause', tmpFilter.value)
}
let tmpFilter = ref<todoFilter>({
    enable: false,
    title: '',
    tags: [],
    tagMode: false,
    sortByStatus: false,
})
let tagInputVal = ref('');
function tagInputBlur() {
    if (tagInputVal.value) {
        tmpFilter.value.tags.push(tagInputVal.value);
        tagInputVal.value='';
    }
}
</script>

<style scoped>
.container {
    padding: 0 10px 10px;
}
.tagModeSwitch {
    margin-left: 10px;
}
#borderedInput:not(:hover):not(.arco-input-focus) {
    border: 1px solid #E5E6EB;
}
</style>