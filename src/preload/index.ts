import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('server', {
  getPort(): Promise<number> {
    return ipcRenderer.invoke('get-port')
  }
})

