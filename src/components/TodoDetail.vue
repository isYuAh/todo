<template>
<a-tabs position="left">
    <a-tab-pane key="1" title="详情">
        <MdPreview v-if="focusTodo.type === 'markdown'" editorId="todoDetail" :previewTheme="'vuepress'" :showCodeRowNumber="true" :modelValue="focusTodo.content" />
        <a-typography v-if="focusTodo.type === 'text'">
        <a-typography-paragraph style="white-space: pre-wrap;">
            {{ focusTodo.content }}
        </a-typography-paragraph>
        </a-typography>
    </a-tab-pane>
    <a-tab-pane key="2" title="详细状态">
        <a-descriptions class="forbidSelect" :column="1" title="待办详细状态" :data="originData">

        </a-descriptions>
    </a-tab-pane>
</a-tabs>
</template>

<script setup lang='ts'>
import { Todo } from '@/types';
import { DescData } from '@arco-design/web-vue';
import { watch } from 'vue';
//Markdown
import { MdPreview } from 'md-editor-v3';
import 'md-editor-v3/lib/preview.css';
import { reactive, ref } from 'vue';
import { detailTranslationMap_origin, detailTranslationMap_repeatType, detailTranslationMap_resetType, detailTranslationMap_resetType_weekDay, translationMap_todoStatus } from '@/support/translationMap';
//END Markdown
let props = defineProps<{
    focusTodo: Todo
}>()
let originData = ref<DescData[]>([]);
watch(() => props.focusTodo, ()=> {
    originData.value = []
    originData.value = reactive(<DescData[]>[
        {
        label: 'ID',
        value: props.focusTodo.id
        },
        {
            label: '来源',
            value: detailTranslationMap_origin[props.focusTodo.origin.origin]
        },
    ])
    if (props.focusTodo.origin.origin === 'remote') {
        originData.value.push({
            label: '来源账号',
            value: props.focusTodo.origin.source,
        })
    }
    originData.value.push({
        label: '状态',
        value: translationMap_todoStatus[props.focusTodo.status]
    })
    if (props.focusTodo.repeatOption.type === 'Times') {
        originData.value.push({
            label: '重复类型',
            value: detailTranslationMap_repeatType[props.focusTodo.repeatOption.type]
        },{
            label: '总次数',
            value: props.focusTodo.repeatOption.totalTimes.toString()
        })
    }else if (props.focusTodo.repeatOption.type === 'Interval') {
        originData.value.push({
            label: '重复类型',
            value: detailTranslationMap_repeatType[props.focusTodo.repeatOption.type]
        },{
            label: '起始时间',
            value: new Date(props.focusTodo.repeatOption.initTime).toString(),
        },{
            label: '间隔（毫秒数）',
            value: props.focusTodo.repeatOption.interval.toString(),
        })
    }
    if (props.focusTodo.resetOption.type === 'WeekSpecificDay') {
        originData.value.push({
            label: '重置类型',
            value: detailTranslationMap_resetType[props.focusTodo.resetOption.type]
        },{
            label: '重置日期',
            value: props.focusTodo.resetOption.days.sort().map((m) => detailTranslationMap_resetType_weekDay[m]).join(', ')
        })
    }else if (props.focusTodo.resetOption.type === 'None') {
        originData.value.push({
            label: '重置类型',
            value: '从不'
        })
    }
    // ,{
    //     label: '重复类型',
    //     value: detailTranslationMap_repeatType[props.focusTodo.repeatOption.type]
    // },{
    //     label: '重置类型',
    //     value: detailTranslationMap_resetType[props.focusTodo.resetOption.type]
    // }
}, {deep: true})
</script>

<style scoped>
.submitPageContainer {
  padding: 20px;
  width: 100%;
  height: 100%;
}
</style>