import { TelnetCommunication } from "@api/core/telnet";
import { Request, Response, Router } from "express";
import dayjs from "dayjs";
import { configStore } from "@store/configStore";
import { join } from "path";
import ping from "ping";

const router = Router()
const baseUrl = '/'

const queue: object[] = []
let telnetCommunication: TelnetCommunication | null = null

router.get('/get-data', (req: Request, res: Response) => {
  if (queue.length === 0) {
    res.json({status: false, data: {}})
    return
  }

  const data = queue.shift();
  res.json({status: true, data: data});
})

/**
 *  train: string
 *  MPU: string
 *  MPU_IP: string
 */
router.post('/start-connection', (req: Request, res: Response) => {
  const {train, MPU, MPU_IP} = req.body

  const date = dayjs().format('YYYY_MM_DD')
  const logName = `${train}_${MPU}_${date}.log`

  const logDirectoryPath = configStore.get('logDirectoryPath')
  const logFilePath = join(logDirectoryPath, logName)

  telnetCommunication = new TelnetCommunication(MPU_IP, logFilePath, queue)
  telnetCommunication.start().then()
  res.json({status: true, message: 'Connection started'})
})


router.post('/close-connection', (req: Request, res: Response) => {
  telnetCommunication?.interrupt()
  res.json({status: true, message: 'Connection closed'})
})

/**
 *  pingUrl: string
 */
router.post('/ping-connection', async (req: Request, res: Response) => {
  const { pingUrl } = req.body
  const pingResponse = await ping.promise.probe(pingUrl)

  if (!pingResponse.alive) {
    res.json({
      status: false,
      message: 'ping failed'
    })
    return
  }

  res.json({status: true,
    message: `connect successfully, cost ${pingResponse.time} ms`
  })
})


export default {
  router,
  baseUrl
}
