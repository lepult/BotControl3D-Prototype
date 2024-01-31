type Conditions = {
    tobitAccessToken?: string;
    tappId?: number;
    siteId?: string;
    validated_personId?: never;
    validated_userId?: never;
    validated_siteId?: never;
    validated_locationId?: never;
} & {
    [condition: string]: string | number | boolean | string[] | number[];
};

type WsOptions = {
    reconnectTimeout?: number;
    checkConnectionInterval?: number;
    checkConnectionTimeout?: number;
};

type RegisterErrorPayload = {
    message?: string;
    code?: number;
};

export enum WebsocketEvents {
    Registered = 'registered',
    RegisterError = 'register_error',
    OPEN = 'OPEN',
    CLOSED = 'CLOSED',
    ERROR = 'ERROR',
}

type WebsocketEventCallbackTypes = {
    [WebsocketEvents.Registered]: (() => (Promise<void> | void));
    [WebsocketEvents.RegisterError]: ((error: RegisterErrorPayload) => (Promise<void> | void));
    [WebsocketEvents.OPEN]: (() => (Promise<void> | void));
    [WebsocketEvents.CLOSED]: ((event: CloseEvent) => (Promise<void> | void));
    [WebsocketEvents.ERROR]: ((event: ErrorEvent) => (Promise<void> | void));
};

const escalatingReconnectTimeouts = [
    0,
    100,
    500,
    1000,
    5000,
    10000,
    30000,
    60000,
];


class WebSocketClient {
    private readonly reconnectTimeoutTime;
    private readonly checkConnectionIntervalTime;
    private readonly checkConnectionTimeoutDuration;

    private readonly application;
    private conditions;

    private socket: WebSocket | null = null;
    private checkConnectionInterval: number | undefined = undefined;
    checkConnectionTimeout: number | undefined = undefined;
    reconnectTimeout: number | undefined = undefined;

    private failedAttempts = 0;
    private hasRegisterError = false;
    private currentNetworkType!: string;

    // random number between -5000 and 5000
    private readonly randomAdditionalTimeoutTime = Math.floor(Math.random() * (10 * 1000)) - 5000;

    listener: { [key: string]: Function } = {};

    /**
     * @param {string} application - name of the application
     * @param {Object} [conditions] - conditions for registration
     * @param {Object} [options]
     * @param {number} [options.reconnectTimeout=60000] - time in milliseconds after trying to reconnect on connection
     *     termination
     * @param {number} [options.checkConnectionInterval=3000] - time in milliseconds for connection check interval
     * @param {number} [options.checkConnectionTimeout=2000] - time in milliseconds until a ping should be answered by
     *     the server
     */
    constructor(application: string, conditions: Conditions, options: WsOptions = {}) {
        this.application = application;
        this.conditions = conditions;

        this.reconnectTimeoutTime = options.reconnectTimeout || 60000;
        this.checkConnectionIntervalTime = options.checkConnectionInterval || 3000;
        this.checkConnectionTimeoutDuration = options.checkConnectionTimeout || 2000;
        if (this.checkConnectionIntervalTime - this.checkConnectionTimeoutDuration < 50) {
            console.warn('checkConnectionTimeout should be lower than checkConnectionInterval. will be reduced to checkConnectionInterval - 50');
            this.checkConnectionTimeoutDuration = this.checkConnectionIntervalTime - 50;
        }

        this.init();
    }

    private init = () => {
        this.createConnection();

        globalThis.addEventListener('offline', this.onOffline);
        globalThis.addEventListener('online', this.onOnline);

        // @ts-ignore
        if (navigator.connection) {
            // @ts-ignore
            navigator.connection.addEventListener('typechange', this.onConnectionTypeChange);
        }
    }

    private onOffline = () => {
        if (this.socket) {
            this.socket.onopen = null;
            this.socket.onerror = null;
            this.socket.onclose = null;
            this.socket.onmessage = null;
            this.socket.close(4102, 'offline');
        }
        this.socket = null;
        clearTimeout(this.reconnectTimeout);
        clearTimeout(this.checkConnectionTimeout);
        clearInterval(this.checkConnectionInterval);
        this.emit('CLOSED', new CloseEvent('close', { code: 1006, reason: 'offline', wasClean: false }));
    }

    private onOnline = () => {
        clearTimeout(this.reconnectTimeout);
        this.failedAttempts = 0;
        this.createConnection();
    }

    private onConnectionTypeChange = () => {
        // @ts-ignore
        if (navigator.connection.type === 'none') {
            this.currentNetworkType = 'none';
            return;
        }
        // @ts-ignore
        if (this.currentNetworkType !== 'none' && this.currentNetworkType !== navigator.connection.type) {
            // @ts-ignore
            this.currentNetworkType = navigator.connection.type;
            this.onOffline();
            this.onOnline();
        }
    }

    /**
     * @private
     */
    onOpen = () => {
        clearTimeout(this.reconnectTimeout);

        this.send('register', {
            application: this.application,
            conditions: this.conditions,
        });

        clearInterval(this.checkConnectionInterval);
        this.checkConnectionTimeout = setTimeout(() => {
            if (this.socket) this.socket.close(4101, 'did not receive registered');
            this.reconnect();
        }, this.checkConnectionTimeoutDuration);
        this.checkConnectionInterval = setInterval(this.checkConnection, this.checkConnectionIntervalTime);

        this.emit('OPEN');
    };

    /**
     * @private
     */
    onMessage = (e: MessageEvent) => {
        const message = JSON.parse(e.data);

        if (message.topic === 'pong') {
            clearTimeout(this.checkConnectionTimeout);
            return;
        }
        if (message.topic === 'registered') {
            clearTimeout(this.checkConnectionTimeout);
            this.failedAttempts = 0;
        }
        if (message.topic === WebsocketEvents.RegisterError) {
            this.hasRegisterError = true;
            this.closeConnection();
        }

        this.emit(message.topic, message.data);
    };

    /**
     * @private
     */
    private onError = (err: Event) => {
        this.emit('ERROR', err);
    };

    /**
     * @private
     */
    private reconnect = () => {
        this.failedAttempts++;
        clearInterval(this.checkConnectionInterval);
        clearTimeout(this.checkConnectionTimeout);
        this.socket = null;
        clearTimeout(this.reconnectTimeout);
        const timeout = Math.min(escalatingReconnectTimeouts[this.failedAttempts] || 60000, this.reconnectTimeoutTime) + (this.failedAttempts === escalatingReconnectTimeouts.length ? this.randomAdditionalTimeoutTime : 0);
        this.reconnectTimeout = setTimeout(this.createConnection, timeout);
    };

    /**
     * @private
     */
    private onClose = (event: CloseEvent) => {
        if (event.wasClean && event.code === 1000) {
            clearInterval(this.checkConnectionInterval);
            clearTimeout(this.checkConnectionTimeout);
            this.socket = null;
            clearTimeout(this.reconnectTimeout);
        } else if (navigator.onLine) {
            this.reconnect();
        }
        this.emit('CLOSED', event);
    };

    /**
     * @private
     */
    private checkConnection = () => {
        clearTimeout(this.checkConnectionTimeout);
        this.send('ping');

        this.checkConnectionTimeout = setTimeout(() => {
            if (this.socket) this.socket.close(4100, 'did not answer ping');
            this.reconnect();
        }, this.checkConnectionTimeoutDuration);
    };

    /**
     * @private
     */
    private send = (topic: string, data: any = undefined) => {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify({ topic, data }));
        }
    };

    /**
     * @private
     */
    private createConnection = () => {
        // @ts-ignore
        if (navigator.connection) {
            // @ts-ignore
            this.currentNetworkType = navigator.connection.type;
        }
        this.socket = new WebSocket('wss://websocket.tobit.com');

        this.socket.onopen = this.onOpen;
        this.socket.onerror = this.onError;
        this.socket.onclose = this.onClose;
        this.socket.onmessage = this.onMessage;
    };

    /**
     * @private
     */
    private emit = (event: string, data: any = undefined) => {
        if (typeof this.listener[event] === 'function') {
            this.listener[event](data);
        }
    };

    /**
     * Registers a new event handler for the given event name.
     * @param {string} event - the name of the event
     * @param {function} listener - a callback that handles the event
     */
    on = <T extends string, U = unknown>(event: T, listener: T extends keyof WebsocketEventCallbackTypes ? WebsocketEventCallbackTypes[T] : ((value: U) => (Promise<void> | void))) => {
        this.listener[event] = listener;
    };

    /**
     * Updates the conditions.
     * @param {Object} conditions
     */
    updateConditions = (conditions: Conditions) => {
        this.conditions = conditions;

        if (this.hasRegisterError) {
            this.hasRegisterError = false;
            this.init();
            return;
        }

        this.send('register', {
            application: this.application,
            conditions: this.conditions,
        });
    };

    /**
     * Close websocket connection.
     */
    closeConnection = () => {
        if (this.socket) {
            this.socket.close(1000);
        }
        globalThis.removeEventListener('offline', this.onOffline);
        globalThis.removeEventListener('online', this.onOnline);
        // @ts-ignore
        if (navigator.connection) {
            // @ts-ignore
            navigator.connection.removeEventListener('typechange', this.onConnectionTypeChange);
        }
    };
}

export default WebSocketClient;

