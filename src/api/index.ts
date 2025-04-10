import express, {Express} from 'express'
import morgan from "morgan";
import cors from 'cors';
import * as http from "node:http";
import connectionRoute from "@api/route/connection";
import settingsRoute from "@api/route/settings";


const app: Express = express()
app.use(express.json())
app.use(cors())
app.use(morgan('dev'))

app.use(connectionRoute.baseUrl, connectionRoute.router)
app.use(settingsRoute.baseUrl, settingsRoute.router)


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
