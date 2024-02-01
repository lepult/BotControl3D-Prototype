import { invokeCall } from 'chayns-api';

export enum ChaynsViewMode {
    normal = 0,
    exclusive = 2,
    wide = 4,
    fullscreen = 5,
    fullscreenWithBackground = 6,
}

export const updateChaynsViewmode = (viewMode: ChaynsViewMode) => {
    void invokeCall({
        action: 266,
        value: {
            updates: [{
                type: 'tapp',
                value: {
                    viewMode,
                }
            }]
        }
    });
}

export const removeFooter = (remove: boolean) => {
    invokeCall({
        action: 238,
        value: {
            hide: remove,
        }
    });
};
