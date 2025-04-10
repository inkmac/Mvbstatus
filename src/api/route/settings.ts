import { Request, Response, Router } from "express";
import { dialog, shell } from "electron";
import { configStore } from "@store/configStore";
import fs from "fs";

const router = Router()
const baseUrl = '/settings'

router.post('/choose-log-directory', async (req: Request, res: Response) => {
  const result = await dialog.showOpenDialog({
    title: '选择日志保存路径',
    properties: ['openDirectory']
  })
  if (result.canceled) {
    res.json({status: false})
    return
  } else {
    const logDirectoryPath = result.filePaths[0]
    configStore.set('logDirectoryPath', logDirectoryPath)
    res.json({status: true, path: logDirectoryPath})
    return
  }
})


router.get('/mvbstatus-log-info', (req: Request, res: Response) => {
  const logDirectoryPath = configStore.get('logDirectoryPath')
  res.json({status: true, logDirectoryPath: logDirectoryPath})
  return
})

/**
 *  directoryPath: string
 */
router.post('/open-directory', async (req: Request, res: Response) => {
  const { directoryPath } = req.body

  await fs.promises.mkdir(directoryPath, { recursive: true })
  await shell.openPath(directoryPath)
  res.json({status: true})
  return
})


export default {
  router,
  baseUrl,
}
