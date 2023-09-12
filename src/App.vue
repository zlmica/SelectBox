<script setup lang="ts">
import SelectBox from './components/SelectBox.vue'
import { ref } from 'vue'
const select = ref(null)
const del = (counter: number) => {
  select.value.deleteSelectDivByOtherBtn(counter)
}
</script>

<template>
  <SelectBox ref="select" @create="(counter) => { console.log('新增了', counter) }"
    @delete="(options) => { console.log('删除了' + options) }"
    style="background: url(./timg.jpeg) repeat; height: 1200px; width: 2200px; position: relative;" />
  <button @click="del(2)">点击测试删除</button>
</template>

<style scoped></style>
