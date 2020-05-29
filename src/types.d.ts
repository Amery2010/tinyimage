export namespace Bridge {
  export type Error = {
    code?: string | number;
    message: string;
  }

  export type Message<T> = {
    /** 方法名 */
    bridgeName?: string;
    /** 数据对象 */
    data?: T;
    /** 回调 id */
    cid?: number;
    /** Native 回调 id */
    nid?: number;
    /** 错误信息 */
    error?: Error;
  }
}

declare global {
  interface Window {
    nativeBridge: {
      postMessage<T>(message: Bridge.Message<T>): void;
    };
    receiveMessage(bridgeName: string, data?: any): void;
  }
}
