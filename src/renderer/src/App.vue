<template>
  <Title/>
  <TestConnection/>
  <StatusTable/>
  <el-row>
    <SoftwareInfo/>
    <ControlButton/>
  </el-row>
</template>

<script setup lang="ts">
import Title from "@renderer/components/Title.vue"
import TestConnection from "@renderer/components/TestConnection.vue"
import StatusTable from "@renderer/components/StatusTable.vue";
import SoftwareInfo from "@renderer/components/SoftwareInfo.vue";
import ControlButton from "@renderer/components/ControlButton.vue";

</script>

<style scoped>

</style>
