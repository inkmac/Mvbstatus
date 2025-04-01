import express, {Express, Request, Response} from 'express'
import {TelnetCommunication} from "@api/core/telnet";
import dayjs from "dayjs";
import ping from 'ping';
import morgan from "morgan";
import cors from 'cors';
import * as http from "node:http";

const app: Express = express()
app.use(express.json())
app.use(cors())
app.use(morgan('dev'))

const queue: object[] = []
let telnetCommunication: TelnetCommunication | null = null


app.get('/get-data', (req: Request, res: Response) => {
  if (queue.length === 0) {
    res.json({status: false, data: {}})
  }

  const data = queue.shift();
  res.json({status: true, data: data});
})

/**
 *     train: string
 *     MPU: string
 *     MPU_IP: string
 */
app.post('/start-connection', (req: Request, res: Response) => {
  const {train, MPU, MPU_IP} = req.body

  const date = dayjs().format('YYYY_MM_DD')
  const logName = `${train}_${MPU}_${date}.log`

  telnetCommunication = new TelnetCommunication(MPU_IP, logName, queue)
  telnetCommunication.start().then()
  res.json({status: true, message: 'Connection started'})
})


app.post('/close-connection', (req: Request, res: Response) => {
  telnetCommunication?.interrupt()
  res.json({status: true, message: 'Connection closed'})
})


app.post('/ping-connection', async (req: Request, res: Response) => {
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

export function createServer(port: number, host: string = '127.0.0.1'): Promise<http.Server> {
  return new Promise((resolve, reject) => {
    const server = app.listen(port, host, () => {
      resolve(server)
    })

    server.on('error', (err: Error) => {
      reject(err)
    })
  })
}
