import { Socket } from "socket.io-client";

/**
 * Allows you to connect to a relatively generic event and make a promise out of it. It is possible to specific
 * a validator to filter the result, as soon as a result matches the promise is resolved with the object received and ready
 * in use. In case more than timeoutInMillis ms have elapsed, reject the promise.
 */
export default function listeningSocketAsPromiseUtil<T>(
	socket: Socket,
	eventName: string,
	validator?: (value: T) => boolean,
	timeoutInMillis?: number
) {
	const defaultTimeoutInMillis = 60000; // 60s

	return new Promise<T>((resolve, reject) => {
		const eventTimeout = setTimeout(() => {
			reject("Timeout event");
			socket.off(eventName, listener);
		}, timeoutInMillis !== undefined ? timeoutInMillis : defaultTimeoutInMillis);

		function listener(eventObj: T)  {
			if (!validator?.(eventObj)) {
				return;
			}
			resolve(eventObj);
			clearTimeout(eventTimeout);
			socket.off(eventName, listener);
		}

		socket.on(eventName, listener);
	});
}