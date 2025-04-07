<template>
  <el-col :span="4" :offset="14">
    <div class="control">
      <el-button type="primary" :disabled="!canStart" @click="startRunning" style="width: 75px">开始</el-button>
      <el-button type="danger" :disabled="!canStop" @click="stopRunning" style="width: 70px">停止</el-button>
    </div>
  </el-col>
</template>

<script setup lang="ts">
import {onUnmounted, ref} from "vue";
import axios from "@renderer/api/http";
import {useTrainStore} from "@renderer/store/trainStore";
import {storeToRefs} from "pinia";
import {ElMessage} from "element-plus";

const canStart = ref(true)
const canStop = ref(false)
const isRunning = ref(false)
let interval: NodeJS.Timeout | null = null

const {trainValue, MPUValue, statusData, MPU_IP} = storeToRefs(useTrainStore())


function startRunning() {
  if (!trainValue.value || !MPUValue.value) {
    ElMessage({
      message: `Haven't choose train or MPU yet`,
      type: 'error'
    })
    return
  }

  canStart.value = false

  axios.post(`/start-connection`, {
    train: trainValue.value,
    MPU: MPUValue.value,
    MPU_IP: MPU_IP.value
  }).then(response => {
    const {status, message} = response.data;

    const showType = status ? 'success' : 'error'

    ElMessage({
      message: message,
      type: showType
    })

    canStop.value = true
    isRunning.value = true

    interval = setInterval(async () => {
      const response = await axios.get(`/get-data`)
      const {status, data} = response.data

      if (status) {
        statusData.value.push(data)
      }
    }, 3000)
  })
}

function stopRunning() {
  canStop.value = false

  clearIntervalIfNotNull(interval)

  axios.post(`/close-connection`)
      .then(response => {
        const {status, message} = response.data;

        const showType = status ? 'success' : 'error'

        ElMessage({
          message: message,
          type: showType
        })

        canStart.value = true
        isRunning.value = false
      })
}

function clearIntervalIfNotNull(interval: NodeJS.Timeout | null) {
  if (interval) {
    clearInterval(interval)
    interval = null
  }
}

onUnmounted(() => clearIntervalIfNotNull(interval))
</script>

<style scoped>

</style>
