import { contextBridge, ipcRenderer } from 'electron'

type BridgeError = {
  code?: string | number;
  message: string;
};
/**
 * Bridge message 对象类型
 */
type BridgeMessage<T> = {
  /** 方法名 */
  bridgeName?: string;
  /** 数据对象 */
  data?: T;
  /** 回调 id */
  cid?: number;
  /** Native 回调 id */
  nid?: number;
  /** 错误信息 */
  error?: BridgeError;
};

/**
 * Bridge 形式的回调函数
 */
type BridgeCallback = (error: BridgeError | null, data?: any) => void;

/**
 * 回调函数对象
 */
type Callbacks = {
  [cid: number]: BridgeCallback;
}

interface NativeBridge {
  invoke<T>(bridgeName: string, data: T, callback: BridgeCallback): void;
  receiveMessage<T>(message: BridgeMessage<T>): void;
}

declare global {
  interface Window {
    nativeBridge: NativeBridge;
  }
}

let cid = 0
const callbacks: Callbacks = {}

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
  invoke<T>(bridgeName: string, data: T, callback: BridgeCallback): void {
    // 如果不存在方法名或不为字符串，则提示调用失败
    if (typeof bridgeName !== 'string') {
      throw new Error('Invoke failed!')
    }
    // 与 Native 的通信信息
    const message: BridgeMessage<T> = { bridgeName: bridgeName }
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
})
