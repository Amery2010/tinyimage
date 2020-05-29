import { contextBridge, ipcRenderer } from 'electron'
import { Bridge } from './types.d'

// 注册 nativeBridge
contextBridge.exposeInMainWorld('nativeBridge', {
  postMessage<T>(message: Bridge.Message<T>): void {
    ipcRenderer.send('postMessage', message)
  }
})

ipcRenderer.addListener('receiveMessage', (_): void => {
  console.log(_)
  // window.receiveMessage(message.bridgeName, message.data)
})
