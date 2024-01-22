import { getAccessToken } from 'chayns-api';

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