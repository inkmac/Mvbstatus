export const API_BASE_URL = 'http://localhost:10000'

// generate static MPU_IP map
export const maxTrain = 53
const IPPro = "10.106."
const IPOffset = 0

const MPU1IP = ".41"
const MPU2IP = ".42"

const TrainDevList = Array.from({ length: maxTrain }, (_, i) => [
  `Ts${i + 1}_MPU1`,
  `Ts${i + 1}_MPU2`
]).flat();

const TrainDevListIP = Array.from({ length: maxTrain }, (_, i) => [
  `${IPPro}${i + 1 + IPOffset}${MPU1IP}`,
  `${IPPro}${i + 1 + IPOffset}${MPU2IP}`
]).flat();

export const trainIPDict = Object.fromEntries(
  TrainDevList.map((key, index) => [key, TrainDevListIP[index]])
)
