import { invokeCall } from 'chayns-api';

// These functions aren't testable, since it requires non-mockable parts of the chayns environment.

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

export const removeChaynsFooter = (remove: boolean) => {
    void invokeCall({
        action: 238,
        value: {
            hide: remove,
        }
    });
};
