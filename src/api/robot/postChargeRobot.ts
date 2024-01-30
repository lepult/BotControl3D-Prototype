import { TDestination } from '../../types/api/destination';
import { PUDU_API_URL } from '../url';
import { getDefaultHeaders } from '../helpers';

export const postChargeRobotFetch = async (robotId: string): Promise<boolean> => {
    const response = await fetch(`${PUDU_API_URL}/Robot/${robotId}/charge`, {
        method: 'POST',
        headers: await getDefaultHeaders(),
    }).catch((error) => {
        console.log('fetch error', error)
        throw new Error('Failed to Fetch');
    });

    if (response.ok) {
        return true;
    }

    console.log('bad response status', response.status)
    return false;
}