import {defineStore} from "pinia";
import { computed, reactive, ref } from "vue";
import { trainIPDict } from "@renderer/config";

export const useTrainStore =  defineStore('train', () => {
  const trainValue = ref('Ts1')
  const MPUValue = ref('MPU1')
  const statusData = reactive([
    {No: 1, Date: "2025-03-13", Time: "14:30:00", MPU1: "C1", MPU2: "C1", R1A1: "AF", R2A1: "BF", R3A1: "LC"},
    {No: 2, Date: "2025-03-13", Time: "14:30:00", MPU1: "C1", MPU2: "C1", R1A1: "AF", R2A1: "BF", R3A1: "LC"},
    {No: 3, Date: "2025-03-13", Time: "14:30:00", MPU1: "C1", MPU2: "C1", R1A1: "AF", R2A1: "BF", R3A1: "LC"},
    {No: 4, Date: "2025-03-13", Time: "14:30:00", MPU1: "C1", MPU2: "C1", R1A1: "AF", R2A1: "BF", R3A1: "LC"},
    {No: 5, Date: "2025-03-13", Time: "14:30:00", MPU1: "C1", MPU2: "C1", R1A1: "AF", R2A1: "BF", R3A1: "LC"},
    {No: 6, Date: "2025-03-13", Time: "14:30:00", MPU1: "C1", MPU2: "C1", R1A1: "AF", R2A1: "BF", R3A1: "LC"},
    {No: 7, Date: "2025-03-13", Time: "14:30:00", MPU1: "C1", MPU2: "C1", R1A1: "AF", R2A1: "BF", R3A1: "LC"},
    {No: 8, Date: "2025-03-13", Time: "14:30:00", MPU1: "C1", MPU2: "C1", R1A1: "AF", R2A1: "BF", R3A1: "LC"},
    {No: 9, Date: "2025-03-13", Time: "14:30:00", MPU1: "C1", MPU2: "C1", R1A1: "AF", R2A1: "BF", R3A1: "LC"},
    {No: 10, Date: "2025-03-13", Time: "14:30:00", MPU1: "C1", MPU2: "C1", R1A1: "AF", R2A1: "BF", R3A1: "LC"},
    {No: 11, Date: "2025-03-13", Time: "14:30:00", MPU1: "C1", MPU2: "C1", R1A1: "AF", R2A1: "BF", R3A1: "LC"},
    {No: 12, Date: "2025-03-13", Time: "14:30:00", MPU1: "C1", MPU2: "C1", R1A1: "AF", R2A1: "BF", R3A1: "LC"},
    {No: 13, Date: "2025-03-13", Time: "14:30:00", MPU1: "C1", MPU2: "C1", R1A1: "AF", R2A1: "BF", R3A1: "LC"},
    {No: 14, Date: "2025-03-13", Time: "14:30:00", MPU1: "C1", MPU2: "C1", R1A1: "AF", R2A1: "BF", R3A1: "LC"},

  ])

  const MPU_IP = computed(() => trainIPDict[`${trainValue.value}_${MPUValue.value}`])

  return { trainValue, MPUValue, statusData, MPU_IP }
})
