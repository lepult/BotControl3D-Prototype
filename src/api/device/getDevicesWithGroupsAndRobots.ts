// region Imports
import { PUDU_API_URL } from '../url';
import { getDefaultHeaders } from '../helpers';
import { BadResponseCodeError } from '../../utils/error';
import { TDevicesData } from '../../types/api/device';
// endregion

export const getDevicesWithGroupsAndRobotsFetch = async (): Promise<TDevicesData> => {
    const response = await fetch(`${PUDU_API_URL}/Device`, {
        method: 'GET',
        headers: await getDefaultHeaders(),
    }).catch((error) => {
        console.log('fetch error', error)
        throw new Error('Failed to Fetch');
    });

    if (response.ok) {
        return (await response.json()) as TDevicesData;
    }

    console.log('bad response status', response.status)
    throw new BadResponseCodeError(response.status);
};
