import { PUDU_API_URL } from '../url';
import { getDefaultHeaders, openErrorDialog } from '../helpers';

export const postCancelRobotFetch = async (robotId: string): Promise<boolean> => {
    const response = await fetch(`${PUDU_API_URL}/Robot/${robotId}/cancel`, {
        method: 'POST',
        headers: await getDefaultHeaders(),
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