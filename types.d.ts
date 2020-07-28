export declare namespace NativeBridge {
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

  type Registers = {
    [eventName: string]: BridgeCallback;
  }

  interface Core {
    invoke<T>(bridgeName: string, data: T, callback: BridgeCallback): void;
    receiveMessage<T>(message: BridgeMessage<T>): void;
    register(eventName: string, callback: BridgeCallback): void;
  }
}

export declare global {
  interface Window {
    nativeBridge: NativeBridge.Core;
  }
}
