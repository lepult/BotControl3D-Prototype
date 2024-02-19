import { ChaynsLogger } from 'chayns-logger';

const logger = new ChaynsLogger({
    applicationUid: '8e937314-91a2-4882-a64e-865bf988f6a3',
    overrideOnError: false,
    overrideConsoleError: false,
    throttleTime: 1000,
    useDevServer: true,
    version: 'dev',
});

export default logger;