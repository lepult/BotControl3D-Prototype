import { getUserType } from './permissionsHelper';
import { UserType } from '../types/misc';

describe("getUserType", () => {
    test('No user or uacGroup should result in UserType.guest', () => {
        expect(getUserType(undefined)).toBe(UserType.guest);
        expect(getUserType({})).toBe(UserType.guest);
        expect(getUserType({ uacGroups: [] })).toBe(UserType.guest);
    });

    test('Wrong uacGroup should result in UserType.guest', () => {
        expect(getUserType({ uacGroups: [{ id: 0 }, { id: 2 }] })).toBe(UserType.guest);
    });

    test('Manager uacGroup should result in UserType.admin', () => {
        expect(getUserType({ uacGroups: [{ id: 1 }] })).toBe(UserType.admin);
        expect(getUserType({ uacGroups: [{ id: 2 }, { id: 1 }] })).toBe(UserType.admin);
        expect(getUserType({ uacGroups: [{ id: 1 }, { id: 79077 }] })).toBe(UserType.admin);
        expect(getUserType({ uacGroups: [{ id: 79077 }, { id: 1 }] })).toBe(UserType.admin);
    });

    test('Team uacGroup should result in UserType.team', () => {
        expect(getUserType({ uacGroups: [{ id: 79077 }] })).toBe(UserType.team);
        expect(getUserType({ uacGroups: [{ id: 2 }, { id: 79077 }] })).toBe(UserType.team);
        expect(getUserType({ uacGroups: [{ id: 79077 }, { id: 2 }] })).toBe(UserType.team);
    });
});
