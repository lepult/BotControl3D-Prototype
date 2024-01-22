import { PUDU_API_URL } from '../url';
import { getDefaultHeaders } from '../helpers';
import { BadResponseCodeError } from '../../utils/error';
import { TMap } from '../../types/api/map';

export const getAllMapsFetch = async (): Promise<TMap[]> => {
    const response = await fetch(`${PUDU_API_URL}/Map`, {
        method: 'GET',
        headers: await getDefaultHeaders(),
    }).catch((error) => {
        console.log('fetch error', error)
        throw new Error('Failed to Fetch');
    });

    if (response.ok) {
        return (await response.json()) as TMap[];
    }

    console.log('bad response status', response.status)
    throw new BadResponseCodeError(response.status);
}