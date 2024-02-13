import { createDialog, DialogType, getAccessToken } from 'chayns-api';

export const getDefaultHeaders = async () => {
    const { accessToken } = await getAccessToken();
    const headers = new Headers({
        accept: 'application/json',
        'content-type': 'application/json',
    });

    if (accessToken) {
        headers.set('authorization', `bearer ${accessToken}`);
    }

    return headers;
}

type TError = {
    displayMessage: string,
}

export const openErrorDialog = async (response?: Response) => {
    let message = 'Es ist ein unbekannter Fehler aufgetreten.';

    try {
        const data = await response?.json() as TError;
        message = `Fehler: ${data.displayMessage}`;
    } catch (e) {
        console.log('error', e);
    }

    const errorDialog = createDialog({
        type: DialogType.ALERT,
        text: message || 'Es ist ein unbekannter Fehler aufgetreten',
    });
    void errorDialog.open();
}