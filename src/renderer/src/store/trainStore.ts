import {defineStore} from "pinia";
import { computed, reactive, ref } from "vue";
import { MPUOptions, trainIPDict, trainOptions } from "@renderer/config";

export const useTrainStore = defineStore('train', () => {
  const trainValue = ref<string>(trainOptions[0]);
  const MPUValue = ref<string>(MPUOptions[0])
  const statusData = reactive<object[]>([
    // {No: 1, Date: "2025-03-13", Time: "14:30:00", MPU1: "C1", MPU2: "C1", R1A1: "AF", R2A1: "BF", R3A1: "LC"},
    // {No: 2, Date: "2025-03-13", Time: "14:30:00", MPU1: "C1", MPU2: "C1", R1A1: "AF", R2A1: "BF", R3A1: "LC"},
    // {No: 3, Date: "2025-03-13", Time: "14:30:00", MPU1: "C1", MPU2: "C1", R1A1: "AF", R2A1: "BF", R3A1: "LC"},
  ])

  const MPU_IP = computed(() => trainIPDict[`${trainValue.value}_${MPUValue.value}`])

  return { trainValue, MPUValue, statusData, MPU_IP }
})
