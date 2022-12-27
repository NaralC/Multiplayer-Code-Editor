import { io, Socket } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

const initSocket = async (): Promise<Socket<DefaultEventsMap, DefaultEventsMap>> => {
    const options = {
        'force new connection': true,
        reconnectionAttemp: 'Infinity',
        timeout: 10000,
        transports: ['websockets'],
    };

    return io('http://localhost:80/', options);
    // return io(process.env.BACKEND_URL, options);
}

export default initSocket;