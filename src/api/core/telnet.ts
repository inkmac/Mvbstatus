import { Telnet } from 'telnet-client';
import fs from "fs";
import { sleep } from "@api/utils/time";
import { zipLongest } from '@api/utils/utils'
import dayjs from "dayjs";

// region Telnet Static Config

const PollingTime = 5000   // ms delay this timer to get next MVB status
const polling = 1000
const user = "root"
const Ending = "Interface name : mvb"

const DevList = ["0x001", "0x002", "0x011", "0x012", "0x013", "0x014", "0x021", "0x015", "0x016", "0x017",
  "0x018", "0x019", "0x01a", "0x01b", "0x01c", "0x01d", "0x01e", "0x01f", "0x020", "0x022",
  "0x0b1", "0x0b2", "0x041", "0x042", "0x043", "0x044", "0x051", "0x052", "0x053", "0x054",
  "0x071", "0x072", "0x073", "0x084", "0x085", "0x0d1", "0x0d2", "0x086", "0x080", "0x082",
  "0x061", "0x062", "0x0d3", "0x0d4", "0x08a", "0x08b",
  "0x0e1", "0x0e2", "0x0e3", "0x0e4", "0x0e5", "0x0e6",
  "0x090", "0x091", "0x092", "0x093", "0x094", "0x095",
  "0x096", "0x097", "0x098", "0x099", "0x09a", "0x09b"]

const DevNumList = ["MPU1", "MPU2", "R1A1", "R2A1", "R3A1", "R4A1", "R5A1", "R1B1", "R2B1", "R1C1",
  "R2C1", "R1C2", "R2C2", "R1B2", "R2B2", "R1A2", "R2A2", "R3A2", "R4A2", "R5A2",
  "DDU1", "DDU2", "PCE1", "PCE2", "PCE3", "PCE4", "BCE1", "BCE2", "BCE3", "BCE4",
  "ACE1", "ACE2", "ACE3", "BBO1", "BBO2", "PIS1", "PIS2", "PMS", "BMS1", "BMS2",
  "ATC1", "ATC2", "T2G1", "T2G2", "EGM1", "EGM2",
  "VAC1", "VAC2", "VAC3", "VAC4", "VAC5", "VAC6",
  "D7_1", "D8_1", "D7_2", "D8_2", "D7_3", "D8_3",
  "D7_4", "D8_4", "D7_5", "D8_5", "D7_6", "D8_6"]

const completeDevNumList = ['No', 'Date', 'Time', ...DevNumList]

// endregion


export class TelnetCommunication {
  private readonly trainDevIP: string
  private readonly trainDevLog: string
  private readonly queue: object[]

  private interrupted: boolean = false
  private telnetConnect: Telnet | null = null
  private proTime: number = 0


  public constructor(trainDevIP: string, trainDevLog: string, queue: object[]) {
    this.trainDevIP = trainDevIP
    this.trainDevLog = trainDevLog
    this.queue = queue
  }

  public async start() {
    try {
      await this.start0()
    } catch (e) {
      this.telnetConnect?.send('exit\n')
      this.telnetConnect?.destroy()
    }
  }

  private async start0(): Promise<void> {
    while (!this.interrupted) {
      this.telnetConnect = new Telnet()
      const params = {
        host: this.trainDevIP,
        port: 23,
        timeout: 15000,
        keepAlive: true,
        negotiationMandatory: false,  // 允许跳过 telnet 协商
      }

      await this.telnetConnect.connect(params)
      await this.telnetConnect.send('', { waitFor: 'login: ' })
      await this.telnetConnect.send(user + '\n')

      // time check
      await this.telnetConnect.send('date\n')
      const readDate = await this.telnetConnect.send('', { waitFor: Ending, timeout: 2000 })
      const readDateList = readDate.split(' ')
      // TODO

      await this.telnetConnect.send('obsterm.elf\n')
      await this.telnetConnect.send('', { waitFor: Ending, timeout: 2000 })

      while (!this.interrupted) {
        this.proTime++
        await this.telnetConnect.send('mvb d s\n')
        const readLine = await this.telnetConnect.send('', { waitFor: Ending, timeout: 2000 });

        const readList = readLine.split('\r\n')

        if (readList.length < 5) {
          // will not reach
          continue
        }

        const devStatusDict = list2DefaultDict(DevList)
        const readDict = list2Dict(DevList, devStatusDict, readList)
        const listEach = [this.proTime.toString(), dayjs().format('HH:mm:ss')]
        for (const eachCell of DevList) {
          listEach.push(readDict[eachCell])
        }
        await dataLogAsync(this.trainDevLog, list2Line(listEach))

        listEach.splice(1, 0, dayjs().format('YYYY-MM-DD'))

        const data = zipLongest(completeDevNumList, listEach)

        this.queue.push(data)
        await sleep(PollingTime)

        if (this.proTime % polling === 0) {
          break
        }
      }

      await this.telnetConnect.send('exit\n')
      await sleep(5000)
    }
  }

  public interrupt(): void {
    this.interrupted = true
    this.telnetConnect?.send('exit\n')
    this.telnetConnect?.destroy()
  }
}


async function dataLogAsync(log_name: string, info_log: string): Promise<void> {
  await fs.promises.appendFile(log_name, info_log + '\n', { encoding: 'utf-8' })
}

function list2Date(inputList: string[]): string {
  const monthAbbr = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const monthNum = monthAbbr.indexOf(inputList[3])
  if (monthNum === -1)
      throw new Error(`Invalid month abbreviation: ${inputList[3]}`)

  return `${inputList[7]}-${monthNum}-${inputList[4]} ${inputList[5]}`
}

function list2Line(inputList: string[]): string {
  return inputList.join(',') + ','
}

function list2DefaultDict(inputList: string[]): Record<string, string> {
  const defaultDict: Record<string, string> = {}
  for (const listEach of inputList) {
    defaultDict[listEach] = "LC"
  }
  return defaultDict
}

function list2ListV(inputList: string[]): string[] {
  const outputList: string[] = []
  for (const each of inputList) {
    let newEach = ""
    for (let i = 0; i < each.length; i++) {
      newEach += each[i]
      if (i < each.length - 1) {
        newEach += "\n"
      }
    }
    outputList.push(newEach)
  }
  return outputList
}

function list2Dict(devList: string[], statusDict: Record<string, string>, inputList: string[]): Record<string, string> {
  const splitFlag = '*-------------------------------------' +
                    '---------------------------------------*'
  let flagNum = 0
  const newDict = { ...statusDict }

  for (const eachCell of inputList) {
    if (eachCell === splitFlag) {
      flagNum++
      if (flagNum <= 2) continue
      if (flagNum === 3) break
    }

    if (flagNum === 2) {
      const eachList = eachCell.split(/\s+/)
      if (eachList.length > 13) {
        const [ , , deviceId, , , , , , , , , bit12, bit13 ] = eachList

        if (bit12 === "1" && bit13 === "0") {
          newDict[deviceId] = "C1"
        } else if (bit12 === "0" && bit13 === "0") {
          newDict[deviceId] = "C0"
        } else if (bit12 === "0" && bit13 === "1") {
          newDict[deviceId] = "AF"
        } else if (bit12 === "1" && bit13 === "1") {
          newDict[deviceId] = "BF"
        }
      }
    }
  }

  const specialDevices = new Set(["0x031", "0x032", "0x033", "0x034",
    "0x051", "0x052", "0x061", "0x062"])

  for (const deviceId of devList) {
    if (specialDevices.has(deviceId)) {
      if (newDict[deviceId] === "AF") {
        newDict[deviceId] = "C2"
      } else if (newDict[deviceId] === "BF") {
        newDict[deviceId] = "C3"
      }
    }
  }

  return newDict
}
