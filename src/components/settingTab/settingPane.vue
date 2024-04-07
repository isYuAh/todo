<template>
<div ref="pane" data-simplebar data-simplebar-auto-hide="true" class="pane">
    <simplebar class="pane">
        <div ref="tar" class="container">
            <slot></slot>
        </div>
    </simplebar>
</div>
</template>

<script setup lang='ts'>
import simplebar from 'simplebar-vue';
import 'simplebar-vue/dist/simplebar.min.css';

</script>

<style scoped>
.pane {
    position: relative;
    height: 100%;
    /* overflow: hidden; */
}
</style>