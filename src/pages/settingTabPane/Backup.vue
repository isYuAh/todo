<template>
<settingPane>
    <settingPanePart title="本地">
        <template #content>
            <a-space>
                <a-button @click="exportData_local">导出备份</a-button>
                <a-button @click="importData_local">导入备份</a-button>
            </a-space>
        </template>
    </settingPanePart>
    <settingPanePart v-if="userStore.token !== ''" title="网络" defaultEmptyMessage="未登录">
    </settingPanePart>
</settingPane>
</template>

<script setup lang='ts'>
import settingPane from '@/components/settingTab/settingPane.vue';
import settingPanePart from '@/components/settingTab/settingPanePart.vue';
import { Todo, getAllTodoInjectionKey, standardResponse } from '@/types';
import { db } from '@/db';
import { Notification } from '@arco-design/web-vue';
import 'md-editor-v3/lib/style.css';
import { inject } from 'vue';
import { useUserStore } from '@/store/useUserStore';
let userStore = useUserStore();
let getAllTodo = inject(getAllTodoInjectionKey)!;
function exportData_local() {
    getAllTodo().then((res: standardResponse<Todo[] | undefined>) => {
        let todos = res.data
        if (todos != undefined) {
            let download = new Blob([JSON.stringify(todos)]);
            let downloadLink = document.createElement('a');
            downloadLink.href = URL.createObjectURL(download);
            downloadLink.download = `backup ${new Date().toLocaleString()}.json`
            downloadLink.click()
        }
    })
}
function importData_local() {
    let finput = document.createElement('input')
    finput.type = 'file'
    finput.addEventListener('input', () => {
        if (finput.files?.length ) {
            let fr = new FileReader()
            fr.readAsText(finput.files[0])
            fr.addEventListener('loadend', (e) => {
                if (e.target?.readyState === fr.DONE){
                    let dataObj = JSON.parse(e.target.result as string)
                    db.transaction('rw', db.todos, () => {
                        db.todos.clear();
                        db.todos.bulkAdd(dataObj)
                    }).then(() => {
                        Notification.success({
                            title: '成功',
                            content: '备份恢复成功',
                        })
                    }).catch((err: Error) => {
                        Notification.error({
                            title: '失败',
                            content: err.message,
                        })
                    })
                }else {
                    console.log(e);
                }
            })
        }
    })
    finput.click()
}
</script>

<style scoped>

</style>