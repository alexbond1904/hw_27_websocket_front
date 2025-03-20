import {createContext} from "react";

interface IWebSocketContext {
    webSocket: WebSocket | null,
    name: string,
}

export const WebSocketContext = createContext<IWebSocketContext>({} as IWebSocketContext);