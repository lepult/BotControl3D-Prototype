import { PUDU_API_URL } from '../url';
import { getDefaultHeaders, openErrorDialog } from '../helpers';
import { BadResponseCodeError } from '../error';
import { TMap } from '../../types/api/map';

export const getAllMapsFetch = async (): Promise<TMap[]> => {
    const response = await fetch(`${PUDU_API_URL}/Map?filterHiddenMaps=false`, {
        method: 'GET',
        headers: await getDefaultHeaders(),
    }).catch((error) => {
        console.log('fetch error', error)
        throw new Error('Failed to Fetch');
    });

    if (response.ok) {
        return (await response.json()) as TMap[];
    }

    await openErrorDialog(response);

    throw new BadResponseCodeError(response.status);
}