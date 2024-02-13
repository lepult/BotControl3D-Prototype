import { PUDU_API_URL } from '../url';
import { getDefaultHeaders, openErrorDialog } from '../helpers';
import { BadResponseCodeError } from '../error';
import { TDevicesData } from '../../types/api/device';

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

    await openErrorDialog(response);

    throw new BadResponseCodeError(response.status);
};
