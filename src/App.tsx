import './App.css'
import Name from "./components/Name.tsx";
import {WebSocketContext} from "./utils/webSocketContext.ts";
import {useState, useRef} from "react";
import Chat from "./components/Chat.tsx";
import Spinner from "./components/Spinner.tsx";

export const URL_WEBSOCKET = 'ws://localhost:8080';

function App() {
    const [isLoading, setIsLoading] = useState(true)
    const [isRegistered, setRegistered] = useState(false);
    const [userName, setUserName] = useState('');
    const [online, setOnline] = useState(0)


    const webSocketRef = useRef<WebSocket | null>(null);

    if (!webSocketRef.current || webSocketRef.current.readyState === WebSocket.CLOSED) {
        webSocketRef.current = new WebSocket(URL_WEBSOCKET);

        webSocketRef.current.onopen = () => {
            console.log("Connected to server");
            setIsLoading(false);
        }

        webSocketRef.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if(data?.type === 'online') {
            setOnline(data.count);
            return;
        }}

        webSocketRef.current.onclose = () => {
            console.log("WebSocket closed");
            webSocketRef.current = null;
        };
    }


return (
    (webSocketRef.current) && (
        <WebSocketContext.Provider value={{
            webSocket: webSocketRef.current,
            name: userName,
        }}>
            <div className={'max-w-[300px] text-center mx-auto mt-10'}>
                {isLoading && <Spinner/>}
                {!isRegistered && <Name setRegistered={setRegistered} setUserName={setUserName}/>}
                {isRegistered && <Chat online={online} setOnline={setOnline} />}
            </div>
        </WebSocketContext.Provider>
    ));
}

export default App;
