import { useProductionBackend } from '../constants/env';

export const PUDU_API_URL = useProductionBackend
    ? 'https://cube.tobit.cloud/pudu-api/v2'
    : 'https://cube-dev.tobit.cloud/pudu-api/v2';
