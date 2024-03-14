/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react';
import renderer from 'react-test-renderer';
import UserModeButtons from './UserModeButtons';

const robotIds = [1, 2, 3];
const mapIds = [1, 2, 3];

const reduxState = {
    robotStatus: {
        ids: [...robotIds],
    },
    map: {
        ids: [...mapIds],
    },
    misc: {
        isPlanningRoute: false,
    }
}

const windowMetrics = { pageWidth: 1000 };

jest.mock('react-redux', () => ({
    useDispatch: () => console.log('DISPATCH!!!!!!'),
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-return
    useSelector: (selector) => selector(reduxState),
}));

jest.mock('chayns-api', () => ({
    useUser: () => ({
        uacGroups: [{ id: 1 }],
    }),
    useWindowMetrics: () => ({ ...windowMetrics })
}));

jest.mock('./robot-controls-buttons/route/RoutePlanner', () => () => <button className="route-planner"/>);
jest.mock('./robot-controls-buttons/route/RouteButton', () => () => <button className="route"/>);
jest.mock('./robot-controls-buttons/cancel/CancelButton', () => () => <button className="cancel"/>);
jest.mock('./robot-controls-buttons/charge/ChargeButton', () => () => <button className="charge"/>);
jest.mock('./robot-controls-buttons/follow-robot/FollowRobotButton', () => () => <button className="follow"/>);
jest.mock('./robot-controls-buttons/information/InformationButton', () => () => <button className="info"/>);
jest.mock('./interaction-buttons/EditMapButton', () => () => <button className="edit"/>);
jest.mock('./interaction-buttons/ResetViewButton', () => () => <button className="reset"/>);
jest.mock('./robot-selection-buttons/RobotSelectionButton', () => ({
    robotId
}: {
    robotId: number
}) => <button className="select-robot" id={`${robotId}`}/>);
jest.mock('./floor-buttons/FloorSelectionButton', () => ({
    mapId
}: {
    mapId: number
}) => <button className="select-floor" id={`${mapId}`}/>);

it('robotIds, mapIds and not planning route should result in all buttons showing', () => {
    const component = renderer.create(
        <UserModeButtons/>,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});

it('No robotIds should result in no robot buttons', () => {
    reduxState.robotStatus.ids = [];

    const component = renderer.create(
        <UserModeButtons/>,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    reduxState.robotStatus.ids = [...robotIds];
});

it('No mapIds should result in no map buttons', () => {
    reduxState.map.ids = [];

    const component = renderer.create(
        <UserModeButtons/>,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    reduxState.map.ids = [...mapIds];
});

it('isPlanningRoute should result in route planner showing', () => {
    reduxState.misc.isPlanningRoute = true;

    const component = renderer.create(
        <UserModeButtons/>,
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    windowMetrics.pageWidth = 100;

    component.update(<UserModeButtons/>);
    tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    windowMetrics.pageWidth = 1000;
    reduxState.misc.isPlanningRoute = false;
});