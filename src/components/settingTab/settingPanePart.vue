<template>
<div :id="title" class="container">
    <div class="header">
        <slot name="header">
            <a :href="`#${title}`" target="_self" class="partTitle">{{ title }}</a>
        </slot>
    </div>
    <div class="content">
        <slot name="content">
            <div class="normalContent forbidSelect">{{ defaultEmptyMessage || '暂无' }}</div>
        </slot>
    </div>
</div>
</template>

<script setup lang='ts'>
defineProps<{
    title: string,
    defaultEmptyMessage?: string
}>()
</script>

<style scoped>
.header .partTitle {
    display: inline-block;
    cursor: pointer;
    text-decoration: none;
    font-size: 23px;
    color: #18191C;
    margin: 10px 0;
    transition: color .25s ease;
}
.header .partTitle:hover {
    color: #61666D;
}
.content {
    padding: 10px;
}
.normalContent {
    margin: 50px 0;
    font-size: 20px;
    color: #61666D;
    text-align: center;
}
</style>