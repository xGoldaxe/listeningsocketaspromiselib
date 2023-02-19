import { Socket } from "socket.io-client";

export function listeningSocketAsPromise<T>(
    socket: Socket,
    eventName: string,
    validator?: (value: T) => boolean,
    timeoutInMillis?: number
);