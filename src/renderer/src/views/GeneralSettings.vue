<template>
  <el-row class="log-path">
    <el-col :span="10">
      <span>当前MvbStatus Log目录: </span>
      <el-link type="primary" @click="openPath">{{ directoryPath }}</el-link>
    </el-col>

    <el-col :span="4" :offset="8">
      <el-button type="info" round @click="changePath">修改Log目录</el-button>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { ref } from "vue";
import axios from "@renderer/api/http";

const directoryPath = ref('')

axios.get('/settings/mvbstatus-log-info').then(res => {
  const { logDirectoryPath } = res.data

  directoryPath.value = logDirectoryPath
})

function openPath() {
  axios.post('/settings/open-directory', {
    directoryPath: directoryPath.value
  })
}

function changePath() {
  axios.post('/settings/choose-log-directory').then(res => {
    const { path } = res.data
    directoryPath.value = path
  })
}

</script>

<style scoped>
.log-path {
  font-size: 15px;
}
</style>
