import { io, Socket } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

const initSocket = async (): Promise<Socket<DefaultEventsMap, DefaultEventsMap>> => {
    const options = {
        'force new connection': true,
        reconnectionAttemp: 'Infinity',
        timeout: 10000,
        transports: ['websocket'],
    };

    // return io('http://localhost:8000/', options);
    return io(import.meta.env.VITE_REACT_API_BACKEND_URL, options);
}

export default initSocket;