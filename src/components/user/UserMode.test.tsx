/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react';
import renderer from 'react-test-renderer';
import UserMode from './UserMode';
import { FetchState } from '../../types/fetch';

const reduxState = {
    map: {
        selectedMap: 1,
        fetchState: FetchState.fulfilled,
    }
}

jest.mock('react-redux', () => ({
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-return
    useSelector: (selector) => selector(reduxState),
}));

jest.mock('../map/user-mode-buttons/UserModeButtons', () => () => <div className="buttons"/>);
jest.mock('chayns-components', () => ({
    SmallWaitCursor: () => <div className="wait-cursor"/>,
}));
jest.mock('../map/Map', () => () => <div className="map"/>);

it('selected map should result in displayed map', () => {
    const component = renderer.create(
        <UserMode/>,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});
it('fetching maps should result in wait cursor and no map', () => {
    reduxState.map.fetchState = FetchState.pending;
    reduxState.map.selectedMap = 0;

    const component = renderer.create(
        <UserMode/>,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    reduxState.map.fetchState = FetchState.fulfilled;
});
