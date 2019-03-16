import { NativeEventEmitter, NativeModules } from "react-native";

const { RCIMClient } = NativeModules;
const eventEmitter = new NativeEventEmitter(RCIMClient);

/**
 * 初始化 SDK，只需要调用一次
 */
export function init(appKey: string) {
  RCIMClient.init(appKey);
}

/**
 * 连接融云服务器，只需要调用一次
 *
 * @param token
 * @param success 成功回调函数
 * @param error 失败回调函数
 * @param tokenIncorrect token 错误或过期回调函数
 */
export function connect(
  token: string,
  success: (userId: string) => void,
  error: (errorCode: number) => void,
  tokenIncorrect: () => void
) {
  const eventId = Math.random().toString();
  const listener = eventEmitter.addListener("rcimlib-connect", data => {
    if (data.eventId === eventId) {
      if (data.type === "success") {
        success(data.userId);
      } else if (data.type === "error") {
        error(data.errorCode);
      } else if (data.type === "tokenIncorrect") {
        tokenIncorrect();
      }
      listener.remove();
    }
  });
  RCIMClient.connect(token, eventId);
}

/**
 * 消息方向
 */
export enum MessageDirection {
  SEND = 1,
  RECEIVE
}

/**
 * 会话类型
 */
export enum ConversationType {
  PRIVATE = 1,
  DISCUSSION,
  GROUP,
  CHATROOM,
  CUSTOMER_SERVICE,
  SYSTEM,
  APP_SERVICE,
  PUBLIC_SERVICE,
  PUSH_SERVICE,
  Encrypted
}

export type TextMessage = {
  type: "text";
  content: string;
  extra: string;
};

export type ImageMessage = {
  type: "image";
  localUri: string;
  remoteUri: string;
  thumUri: string;
  isFull: string;
};

export type Message = {
  /**
   * 会话类型
   */
  conversationType: ConversationType;

  /**
   * 消息 ID
   */
  messageId: number;

  /**
   * 消息 UID
   */
  messageUId: string;

  /**
   * 消息方向
   */
  messageDirection: MessageDirection;

  /**
   * 发送者 ID
   */
  senderUserId: string;

  /**
   * 发送时间
   */
  sentTime: number;

  /**
   * 目标 ID
   */
  targetId: string;

  /**
   * 消息接收时间
   */
  receivedTime: number;

  /**
   * 消息内容
   */
  content: any;

  /**
   * 附加信息
   */
  extra: string;
};

/**
 * 添加消息监听函数
 */
export function addReceiveMessageListener(listener: (message: Message) => void) {
  return eventEmitter.addListener("rcimlib-receive-message", message => {
    listener(message);
  });
}

export enum ConnectionStatus {
  UNKNOWN = -1,
  Connected = 0,
  NETWORK_UNAVAILABLE = 1,
  AIRPLANE_MODE = 2,
  Cellular_2G = 3,
  Cellular_3G_4G = 4,
  WIFI = 5,
  KICKED_OFFLINE_BY_OTHER_CLIENT = 6,
  LOGIN_ON_WEB = 7,
  SERVER_INVALID = 8,
  VALIDATE_INVALID = 9,
  Connecting = 10,
  Unconnected = 11,
  SignUp = 12,
  TOKEN_INCORRECT = 31004,
  DISCONN_EXCEPTION = 31011
};

/**
 * 添加消息监听函数
 */
export function addConnectionStatusListener(listener: (status: ConnectionStatus) => void) {
  return eventEmitter.addListener("rcimlib-connection-status", listener);
}
