<script setup lang="ts">
import {AxiosInstance} from "axios";
import {computed, inject, ref} from "vue";
const props = defineProps<{
  group: number,
  taskid: number,
}>()
let serverAxios: AxiosInstance = inject('serverAxios')!;
const show = ref(false)
const result = ref({});
const mem = computed(() => Object.keys(result.value))
serverAxios.post('/api/task/querySubmit', {
  group: props.group,
  taskid: props.taskid,
}).then((res) => {
  console.log('$querySubmit', res.data)
  if (res.data.code === 200) {
    show.value = true;
    result.value = res.data.data;
  }
});
</script>

<template>
  <a-collapse v-if="show">
    <a-collapse-item v-for="k in mem" :header="k" :key="k">
      <div :key="key" v-for="key in Object.keys(result[k])">{{key}} : {{result[k][key]}}</div>
    </a-collapse-item>
  </a-collapse>
</template>

<style scoped>

</style>