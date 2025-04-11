const port = await window.server.getPort()
export const API_BASE_URL = `http://127.0.0.1:${port}`

// generate static MPU_IP map
const maxTrain = 53
const IPPro = "10.106."
const IPOffset = 0

const MPU1IP = ".41"
const MPU2IP = ".42"

export const trainOptions = [...Array.from({length: maxTrain}, (_, i) => `Ts${i + 1}`)]
export const MPUOptions = ['MPU1', 'MPU2']

const trainDevList = Array.from({ length: maxTrain }, (_, i) => [
  `${trainOptions[i]}_${MPUOptions[0]}`,
  `${trainOptions[i]}_${MPUOptions[1]}`
]).flat();

const trainDevListIP = Array.from({ length: maxTrain }, (_, i) => [
  `${IPPro}${i + 1 + IPOffset}${MPU1IP}`,
  `${IPPro}${i + 1 + IPOffset}${MPU2IP}`
]).flat();

// TEST USED TRAIN
trainOptions.unshift('Ts221')
trainDevList.unshift('Ts221_MPU1')
trainDevList.unshift('Ts221_MPU2')
trainDevListIP.unshift('192.168.1.69')
trainDevListIP.unshift('192.168.1.69')

export const trainIPDict = Object.fromEntries(
  trainDevList.map((key, index) => [key, trainDevListIP[index]])
)
