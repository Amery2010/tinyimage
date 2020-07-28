import { contextBridge, ipcRenderer } from 'electron'
import { NativeBridge } from '../types'

let cid = 0
const callbacks: NativeBridge.Callbacks = {}
const registers: NativeBridge.Registers = {}

ipcRenderer.on('receiveMessage', (_, message): void => {
  const { data, cid, error } = message
  // 如果存在方法名，则调用对应函数
  if (typeof cid === 'number' && cid >= 1) {
    if (typeof error !== 'undefined') {
      callbacks[cid](error)
      delete callbacks[cid]
    } else if (callbacks[cid]) {
      callbacks[cid](null, data)
      delete callbacks[cid]
    } else {
      throw new Error('Invalid callback id')
    }
  } else {
    throw new Error('message format error')
  }
})

// 注册 nativeBridge
contextBridge.exposeInMainWorld('nativeBridge', {
  invoke<T>(bridgeName: string, data: T, callback: NativeBridge.BridgeCallback): void {
    // 如果不存在方法名或不为字符串，则提示调用失败
    if (typeof bridgeName !== 'string') {
      throw new Error('Invoke failed!')
    }
    // 与 Native 的通信信息
    const message: NativeBridge.BridgeMessage<T> = { bridgeName: bridgeName }
    if (typeof data !== 'undefined' || data !== null) {
      message.data = data
    }
    if (typeof callback !== 'function') {
      callback = () => null
    }
    cid = cid + 1
    // 存储回调函数
    callbacks[cid] = callback
    message.cid = cid
    ipcRenderer.send('postMessage', message)
  },
  register(eventName: string, callback: NativeBridge.BridgeCallback): void {
    // 如果不存在方法名或不为字符串，则提示注册失败
    if (typeof eventName !== 'string') {
      throw new Error('Register failed!')
    }
    registers[eventName] = callback
  }
})

ipcRenderer.on('invoke', (_, message): void => {
  Object.keys(registers).forEach((eventName: string) => {
    if (eventName === message.eventName) {
      registers[eventName](null, message.data)
    }
  })
})
