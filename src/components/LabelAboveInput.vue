<template>
    <div class="container">
        <div class="label">{{ label }}</div>
        <slot>
            <a-input v-bind="$attrs" />
        </slot>
    </div>
</template>

<script setup lang='ts'>
defineProps(['label'])
</script>

<style scoped>
.label {
    color: #586271;
    margin-bottom: 4px;
}
</style>