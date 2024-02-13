import { PUDU_API_URL } from '../url';
import { getDefaultHeaders, openErrorDialog } from '../helpers';
import { BadResponseCodeError } from '../error';
import { TRobotData } from '../../types/api/robotData';

export const getRobotDataFetch = async (robotId: string): Promise<TRobotData> => {
    const response = await fetch(`${PUDU_API_URL}/Robot/${robotId}/pudu-data`, {
        method: 'GET',
        headers: await getDefaultHeaders(),
    }).catch((error) => {
        console.log('fetch error', error)
        throw new Error('Failed to Fetch');
    });

    if (response.ok) {
        return (await response.json()) as TRobotData;
    }

    await openErrorDialog(response);

    throw new BadResponseCodeError(response.status);
}
