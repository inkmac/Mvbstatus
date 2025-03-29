<template>
  <el-row class="test-MPU" :gutter="5">
    <!-- 列车号 -->
    <el-col :span="5" :offset="3">
      <label class="r-5">列车号</label>
      <el-select v-model="trainValue" filterable placeholder="请选择（支持搜索）" style="width: 200px">
        <el-option v-for="item in trainOptions" :key="item" :label="item" :value="item"></el-option>
      </el-select>
    </el-col>

    <!-- MPU -->
    <el-col :span="5">
      <label class="r-5">MPU</label>
      <el-select v-model="MPUValue" filterable placeholder="请选择（支持搜索）" style="width: 200px">
        <el-option v-for="item in MPUOptions" :key="item" :label="item" :value="item"></el-option>
      </el-select>
    </el-col>

    <!-- MPU IP and TestConnect button -->
    <el-col :span="8.5">
      <label class="r-5">MPU IP is</label>
      <el-input v-model="MPU_IP" :disabled="true" style="display: inline-block; width: auto;"></el-input>

      <el-button type="primary" :disabled="isTesting" @click="testConnection" style="width: 130px">{{ connectionText }}</el-button>
    </el-col>
	</el-row>
</template>

<script setup lang="ts">
import {computed, reactive, ref} from "vue";
import axios from "axios";
import {port, MPU_IP} from "@renderer/config";
import {storeToRefs} from "pinia";
import {useTrainStore} from '@renderer/store/trainStore'
import {ElMessage, ElRow, ElCol, ElSelect, ElOption, ElButton, ElInput} from "element-plus"

const trainOptions = reactive(['Ts221', ...Array.from({length: 56}, (_, i) => `Ts${i + 1}`)])
const MPUOptions = reactive(['MPU1', 'MPU2'])

const {trainValue, MPUValue} = storeToRefs(useTrainStore())

const isTesting = ref(false)

const connectionText = computed(() => (isTesting.value ? '测试中...' : '测试MPU连接'))


function testConnection() {
  isTesting.value = true

  axios.post(`http://localhost:${port}/ping-connection`, {pingUrl: MPU_IP})
      .then(response => {
        const {status, message} = response.data

        const showType = status ? 'success' : 'error'

        ElMessage({
          message: message,
          type: showType,
          showClose: true,
        })

        isTesting.value = false
      })
}

</script>

<style scoped>
  .test-MPU {
    margin-top: 10px;
    text-align: center
  }

  .r-5 {
    margin-right: 5px;
  }
</style>
