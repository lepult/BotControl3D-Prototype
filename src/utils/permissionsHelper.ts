import { ChaynsApiUser } from 'chayns-api';
import { UserType } from '../types/misc';

// TODO Write tests for this function

export const getUserType = (user: ChaynsApiUser | undefined) => {
        const isInTeam = user?.uacGroups?.find((uacGroup) => uacGroup.id === 79077);
    const isAdmin = user?.uacGroups?.find((uacGroup) => uacGroup.id === 1);

    if (isAdmin) return UserType.admin;
    if (isInTeam) return UserType.team;
    return UserType.guest
};