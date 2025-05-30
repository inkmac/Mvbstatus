import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { createServer } from "@api/index";
import { initExpireStore } from "@store/expireStore";
import { initConfigStore } from "@store/configStore";
import axios from "axios";

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

let port: number

app.whenReady().then(async () => {
  initExpireStore()
  initConfigStore()

  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // start server
  const server = await createServer(0)
  const address = server.address()

  if (typeof address === 'string') {
    throw new Error(`Server is listening on a socket path (in Unix OS), not a TCP port: ${address}`)
  } else if (address === null) {
    throw new Error('address is null')
  }

  port = address.port;

  ipcMain.handle('get-port', () => {
    return port
  })

  // start window
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', async () => {
  await axios.post(`http://localhost:${port}/close-connection`)

  if (process.platform !== 'darwin') {
    app.quit()
  }
})
