import {useContext, useState} from "react";
import {WebSocketContext} from "../utils/webSocketContext.ts";

export interface Message {
    message: string,
    author: string,
    time: string
}

interface ChatProps {
    online: number,
    setOnline: (value: (((prevState: number) => number) | number)) => void
}

const Chat = ({online, setOnline}: ChatProps) => {
    const [message, setMessage] = useState('');
    const {name, webSocket: ws} = useContext(WebSocketContext);
    const [chatMessages, setChatMessages] = useState<Message[]>([]);


    if (ws) {
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (!data) return;
            if (data?.type === 'online') {
                setOnline(data.count);
                return;
            }
            const message: Message = {
                message: data.message,
                author: data.name,
                time: data.time
            }
            setChatMessages(prev => [message, ...prev]);
        };
    }

    const handleClick = () => {
        ws?.send(JSON.stringify({
            type: "message",
            message: message
        }))
        setMessage('');
    }

    return (
        <div className={'grid gap-3'}>
            <div className={'text-left'}><p className={'text-xl'}>Hello {name}!</p></div>
            <textarea
                value={message}
                onChange={(e) => setMessage(e.currentTarget.value)}
                className={'border border-gray-400 p-3 rounded-md'}
                placeholder={'Your message'}>
                </textarea>
            <button onClick={handleClick} className={'bg-blue-500 p-3 text-white rounded-md cursor-pointer'}>Send
            </button>
            <p>Chat. Online: <span className={'text-orange-500'}>{online}</span></p>
            {!!chatMessages.length && chatMessages.map((message, index) => (
                <div key={index} className="text-left p-2 ">
                    <p className={'text-xs text-gray-400'}>{message.time}</p>
                    <p className={'text-md text-gray-600'}>
                            <span className={`font-bold ${message.author == name ? 'text-green-600' : 'text-black'}`}>
                               {message.author == name ? 'You' : message.author}:&nbsp;
                            </span>
                        {message.message}
                    </p>
                    <hr className={'mt-2 text-gray-300'}/>
                </div>

            ))}
        </div>
    );
};

export default Chat;