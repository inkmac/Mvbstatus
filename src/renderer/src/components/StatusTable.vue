<template>
  <el-table class="status-table" :data="statusData" :cell-style="cellStyle"
            height="50vh" border>
    <el-table-column
        v-for="(columnName, i) in dynamicColumns"
        :key="columnName"
        :label="columnName"
        :prop="columnName"
        :width="getColumnWidth(columnName)"
        :fixed="i < 3 ? 'left' : false"
    ></el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import {storeToRefs} from "pinia"
import {useTrainStore} from "@renderer/store/trainStore"
import {ElTableColumn, ElTable} from 'element-plus'

const {statusData} = storeToRefs(useTrainStore())

const dynamicColumns = [
  "No", "Date", "Time",
  "MPU1", "MPU2", "R1A1", "R2A1", "R3A1", "R4A1", "R5A1", "R1B1", "R2B1", "R1C1",
  "R2C1", "R1C2", "R2C2", "R1B2", "R2B2", "R1A2", "R2A2", "R3A2", "R4A2", "R5A2",
  "DDU1", "DDU2", "PCE1", "PCE2", "PCE3", "PCE4", "BCE1", "BCE2", "BCE3", "BCE4",
  "ACE1", "ACE2", "ACE3", "BBO1", "BBO2", "PIS1", "PIS2", "PMS", "BMS1", "BMS2",
  "ATC1", "ATC2", "T2G1", "T2G2", "EGM1", "EGM2",
  "VAC1", "VAC2", "VAC3", "VAC4", "VAC5", "VAC6",
  "D7_1", "D8_1", "D7_2", "D8_2", "D7_3", "D8_3",
  "D7_4", "D8_4", "D7_5", "D8_5", "D7_6", "D8_6"
]

function cellStyle({ row, column }: { row: any; column: any }) {
  const value = row[column.property] // 获取单元格内容
  const bgcColorMap: any = {
    LC: "red",
    AF: "orange",
    BF: "yellow",
  }
  return {
    backgroundColor: bgcColorMap[value] || "white",
    color: 'black',
  }
}

function getColumnWidth(columnName: string) {
  switch (columnName) {
    case 'No': return '50px'
    case 'Date': return '105px'
    case 'Time': return '90px'
    default: return '75px'
  }
}

</script>

<style scoped>
  .status-table {
    margin-top: 10px;
    font-size: 14px;
  }
</style>
