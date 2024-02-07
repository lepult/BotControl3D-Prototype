// region Imports
// endregion

// region Types
import WebSocketClient from './websocket';

type TWebsocketConditions = {
    [condition: string]: string | number | boolean | string[] | number[];
};

type TWebsocketServiceConfig = {
    serviceName: string;
    conditions: TWebsocketConditions;
    // eslint-disable-next-line no-undef,@typescript-eslint/no-explicit-any
    events: Record<string, (data: Record<string, any> | any, wsEvent?: MessageEvent | Event | null) => void>;
};
// endregion


const addWebsocket = ({
    serviceName,
    conditions,
    events
}: TWebsocketServiceConfig) => {
    const websocketClient = new WebSocketClient(serviceName, { ...conditions });
    websocketClient.on('register_error', (err: Error) => {
        console.log('Register Websocket Error', err);
    });

    const keys = Object.keys(events);
    keys.forEach((key) => {
        websocketClient.on(key, events[key]);
    });

    return websocketClient;
};

export default addWebsocket;
