<template>
    <a-spin :loading="loading" tip="加载中..." class="view">
        <MdPreview editorId="About" :showCodeRowNumber="true" :modelValue="AboutString" />
    </a-spin>
</template>

<script setup lang='ts'>
    import { MdPreview } from 'md-editor-v3';
    import axios from 'axios'
    import {ref} from 'vue'
    let AboutString = ref('')
    let loading = ref(true)
    async function getAboutString() {
        AboutString.value = (await axios.get('/About.md')).data
        loading.value = false;
    }
    getAboutString()
</script>

<style scoped>
.view {
    display: block;
    height: calc(100% - 40px);
    padding: 0 20px;
}
</style>