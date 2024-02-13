import { PUDU_API_URL } from '../url';
import { getDefaultHeaders, openErrorDialog } from '../helpers';
import { TDestination } from '../../types/api/destination';

export const postSendRobotFetch = async (robotId: string, destinations: TDestination[]): Promise<boolean> => {
    const response = await fetch(`${PUDU_API_URL}/Robot/${robotId}/call`, {
        method: 'POST',
        headers: await getDefaultHeaders(),
        body: JSON.stringify(destinations),
    }).catch((error) => {
        console.log('fetch error', error)
        throw new Error('Failed to Fetch');
    });

    if (response.ok) {
        return true;
    }

    await openErrorDialog(response);

    return false;
}
