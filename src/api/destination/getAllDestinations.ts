import { PUDU_API_URL } from '../url';
import { getDefaultHeaders, openErrorDialog } from '../helpers';
import { BadResponseCodeError } from '../error';
import { TDestination } from '../../types/api/destination';

export const getAllDestinationsFetch = async (): Promise<TDestination[]> => {
    const response = await fetch(`${PUDU_API_URL}/Destination`, {
        method: 'GET',
        headers: await getDefaultHeaders(),
    }).catch((error) => {
        console.log('fetch error', error)
        throw new Error('Failed to Fetch');
    });

    if (response.ok) {
        return (await response.json()) as TDestination[];
    }

    await openErrorDialog(response);

    throw new BadResponseCodeError(response.status);
}