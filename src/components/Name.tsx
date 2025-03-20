import {useContext, useEffect, useState} from "react";
import {WebSocketContext} from "../utils/webSocketContext.ts";

interface NameProps {
    setRegistered: (value: (((prevState: boolean) => boolean) | boolean)) => void,
    setUserName: (value: (((prevState: string) => string) | string)) => void
}

function Name({setRegistered, setUserName}: NameProps) {
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const {webSocket: ws} = useContext(WebSocketContext)

    useEffect(() => {
        return () => {
            setError('')
        }
    }, []);

    if(ws) ws.onmessage = (message) => {
        const response = JSON.parse(message.data);
        if (!response) {
            setError('Something Wrong');
        }
        if (response.type === 'error') {
            setError(response.message);
        } else if (response.type === 'registered') {
            setRegistered(true);
            setUserName(response.name);
        }
    }

    const handleClick = () => {
        setError('');
        ws?.send(JSON.stringify({
            "type": "register",
            "name": name
        }));
    }


    return (
        <div className={'grid gap-3'}>
            <div className={'text-left'}><p className={'text-xl'}>Enter your name</p></div>
            <input
                value={name}
                onChange={(e) => setName(e.currentTarget.value)}
                className={'border border-gray-400 p-3 rounded-md'}
                placeholder={'your name'}>
            </input>
            <button onClick={handleClick} className={'bg-blue-500 p-3 text-white rounded-md cursor-pointer'}>Next
            </button>
            {error && (<p className={'text-red-500'}>{error}</p>)}
        </div>
    )
}

export default Name;