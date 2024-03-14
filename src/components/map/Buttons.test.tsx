/* eslint-disable */
import React from 'react';
import renderer from 'react-test-renderer';
import { shallow, configure  } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { resetViewState, setIsEditingMap } from '../../redux-modules/misc/actions';
import EditMapButton from './user-mode-buttons/interaction-buttons/EditMapButton';
import ResetViewButton from './user-mode-buttons/interaction-buttons/ResetViewButton';
import {
    changeInitialViewState,
    changeSelectedMap,
    setFollowRobot, toggleFollowRobot,
    toggleSelectedRobot
} from '../../redux-modules/map/actions';
import ChangeInitialViewButton from './editor-map-buttons/buttons/ChangeInitialViewButton';
import { TViewState } from '../../types/deckgl-map';
import SaveButton from './editor-map-buttons/buttons/SaveButton';
import { floorModelsEg } from '../../constants/hardcoded-data/models';
import ShortcutsButton from './editor-map-buttons/buttons/ShortcutsButton';
import FloorSelectionButton from './user-mode-buttons/floor-buttons/FloorSelectionButton';
import UserModeButtons from './user-mode-buttons/UserModeButtons';
import RobotSelectionButton from './user-mode-buttons/robot-selection-buttons/RobotSelectionButton';
import FollowRobotButton from './user-mode-buttons/robot-controls-buttons/follow-robot/FollowRobotButton';

configure({ adapter: new Adapter() });

const useDispatchCallBack = jest.fn();
const openDialogCallBack = jest.fn();


const mapIdDefault = 1;
const mapIdPathData = 38;
const mapIdHidden = 1000;
const mapIdRobot = 1001;

const robotIdDefault = 'robot-default';
const robotIdSelected = 'robot-selected';
const robotIdNoPose = 'robot-no-pose';
const robotIdDefaultMap = 'robot-default-map';

const reduxStore = {
    map: {
        followRobot: false,
        selectedMap: mapIdDefault,
        selectedRobot: robotIdSelected,
        entities: {
            [mapIdDefault]: {
                id: mapIdDefault,
                name: 'Karte 1',
                showName: 'Karte 1',
                creationTime: new Date(),
            },
            [mapIdPathData]: {
                id: mapIdPathData,
                name: 'Tobit EG',
                showName: 'Tobit EG',
                creationTime: new Date(),
            },
            [mapIdHidden]: {
                id: mapIdHidden,
                name: 'Karte 2',
                showName: 'Karte 2',
                hidden: true,
                creationTime: new Date(),
            }
        },
    },
    robotStatus: {
        entities: {
            [robotIdDefault]: {
                robotStatus: {
                    robotName: 'robotDefault',
                    currentMap: {
                        id: mapIdRobot,
                    }
                },
                puduRobotStatus: {
                    robotPose: {
                        x: 10,
                        y: 10,
                        angle: 10,
                    }
                }
            },
            [robotIdSelected]: {
                robotStatus: {
                    robotName: 'robotSelected',
                    currentMap: {
                        id: mapIdRobot,
                    }
                },
                puduRobotStatus: {
                    robotPose: {
                        x: 10,
                        y: 10,
                        angle: 10,
                    }
                }
            },
            [robotIdDefaultMap]: {
                robotStatus: {
                    robotName: 'robotDefaultMap',
                    currentMap: {
                        id: mapIdDefault,
                    }
                },
                puduRobotStatus: {
                    robotPose: {
                        x: 10,
                        y: 10,
                        angle: 10,
                    }
                }
            },
            [robotIdNoPose]: {
                robotStatus: {
                    robotName: 'robotNoPose',
                    currentMap: {
                        id: mapIdRobot,
                    }
                },
                puduRobotStatus: {

                },
            }
        }
    }
}

jest.mock('react-redux', () => ({
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    useDispatch: () => (e) => useDispatchCallBack(e),
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-return
    useSelector: (selector) => selector(reduxStore)
}));

jest.mock('chayns-components', () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const original = jest.requireActual('chayns-components');

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return {
        ...original,
        Tooltip: (props: any) => (<div className="tooltip">{props.children}</div>),
    }
});

jest.mock('chayns-api', () => {
    const original = jest.requireActual('chayns-api');

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return {
        ...original,
        createDialog: () => ({
            open: async () => openDialogCallBack(),
        }),
    }
});

describe('Test EditMapButton', () => {
    it('renders as expected', () => {
        const component = renderer.create(<EditMapButton/>);
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('handles click events', () => {
        useDispatchCallBack.mock.calls = [];
        const component = shallow((<EditMapButton/>));
        component.find('Button').simulate('click');

        expect(useDispatchCallBack.mock.calls.length).toEqual(1);
        expect(useDispatchCallBack.mock.calls[0][0].type).toEqual(setIsEditingMap.type);
        expect(useDispatchCallBack.mock.calls[0][0].payload).toEqual(true);

        useDispatchCallBack.mock.calls = [];
    })
});

describe('Test ResetViewButton', () => {
    it('renders as expected', () => {
        const component = renderer.create(<ResetViewButton/>);
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('handles click events', () => {
        useDispatchCallBack.mock.calls = [];
        const component = shallow((<ResetViewButton/>));
        component.find('Button').simulate('click');

        expect(useDispatchCallBack.mock.calls.length).toEqual(2);
        expect(useDispatchCallBack.mock.calls[0][0].type).toEqual(resetViewState.type);
        expect(useDispatchCallBack.mock.calls[0][0].payload).toEqual(undefined);
        expect(useDispatchCallBack.mock.calls[1][0].type).toEqual(setFollowRobot.type);
        expect(useDispatchCallBack.mock.calls[1][0].payload).toStrictEqual({ followRobot: false });

        useDispatchCallBack.mock.calls = [];
    })
});

describe('Test ChangeInitialViewButton', () => {
    const viewState: TViewState = {
        bearing: 10,
        latitude: 10,
        longitude: 10,
        pitch: 10,
        zoom: 10,
    };

    it('renders as expected', () => {
        const component = renderer.create(<ChangeInitialViewButton
            viewState={undefined}
            mapId={mapIdDefault}
        />);
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('handles click events', () => {
        useDispatchCallBack.mock.calls = [];
        const component = shallow((<ChangeInitialViewButton
            viewState={viewState}
            mapId={mapIdDefault}
        />));

        component.find('Button').simulate('click');

        expect(useDispatchCallBack.mock.calls.length).toEqual(1);
        expect(useDispatchCallBack.mock.calls[0][0].type).toEqual(changeInitialViewState.type);
        expect(useDispatchCallBack.mock.calls[0][0].payload).toStrictEqual({
            mapId: mapIdDefault,
            viewState,
        });

        useDispatchCallBack.mock.calls = [];
    })
});
describe('Test ResetViewButton', () => {
    it('renders as expected', () => {
        const component = renderer.create(<SaveButton floorModels={[]}/>);
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('handles click events', async () => {
        useDispatchCallBack.mock.calls = [];
        const component = shallow((<SaveButton floorModels={[]}/>));
        component.find('Button').simulate('click');

        await new Promise(r => setTimeout(r, 100));

        expect(useDispatchCallBack.mock.calls.length).toEqual(1);
        expect(useDispatchCallBack.mock.calls[0][0].type).toEqual(setIsEditingMap.type);
        expect(useDispatchCallBack.mock.calls[0][0].payload).toEqual(false);

        useDispatchCallBack.mock.calls = [];
    })
});

describe('Test ShortcutsButton', () => {
    it('renders as expected', () => {
        const component = renderer.create(<ShortcutsButton/>);
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('handles click events', async () => {
        openDialogCallBack.mock.calls = [];
        const component = shallow((<ShortcutsButton/>));
        component.find('Button').simulate('click');

        await new Promise(r => setTimeout(r, 100));

        expect(openDialogCallBack.mock.calls.length).toEqual(1);

        openDialogCallBack.mock.calls = [];
    })
});

describe('Test FloorSelectionButton', () => {
    it('renders as expected', () => {
        reduxStore.map.selectedMap = mapIdDefault;

        // Map is not selected
        const component = renderer.create(<FloorSelectionButton mapId={mapIdPathData}/>);
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();

        // Map is selected
        component.update(<FloorSelectionButton mapId={mapIdDefault}/>);
        tree = component.toJSON();
        expect(tree).toMatchSnapshot();

        reduxStore.map.selectedMap = mapIdDefault;
    });

    it('shows border when map has selected robot', () => {
        reduxStore.map.selectedMap = mapIdDefault;

        // Map is not selected and has selected Robot
        const component = renderer.create(<FloorSelectionButton mapId={mapIdRobot}/>);
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();

        // Map is selected and has selected Robot
        reduxStore.map.selectedMap = mapIdRobot;
        component.update(<FloorSelectionButton mapId={mapIdRobot}/>);
        tree = component.toJSON();
        expect(tree).toMatchSnapshot();

        reduxStore.map.selectedMap = mapIdDefault;
    });

    it('doesnt render when map is hidden or doesnt have pathData', () => {
        // Map is hidden
        const component = renderer.create(<FloorSelectionButton mapId={mapIdHidden}/>);
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();

        // Map has no pathData
        component.update(<FloorSelectionButton mapId={mapIdDefault}/>);
        tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('handles click events', async () => {
        useDispatchCallBack.mock.calls = [];
        const component = shallow((<FloorSelectionButton mapId={mapIdPathData}/>));
        console.log('component', component.debug());
        component.find('Button').simulate('click');

        expect(useDispatchCallBack.mock.calls.length).toEqual(2);
        expect(useDispatchCallBack.mock.calls[0][0].type).toEqual(changeSelectedMap.type);
        expect(useDispatchCallBack.mock.calls[0][0].payload).toStrictEqual({ mapId: mapIdPathData });
        expect(useDispatchCallBack.mock.calls[1][0].type).toEqual(setFollowRobot.type);
        expect(useDispatchCallBack.mock.calls[1][0].payload).toStrictEqual({ followRobot: false });

        useDispatchCallBack.mock.calls = [];
    })
});


describe('Test RobotSelectionButton', () => {
    it('renders as expected', () => {
        // Robot is not selected
        const component = renderer.create(<RobotSelectionButton robotId={robotIdDefault}/>);
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();

        // Robot is selected
        component.update(<RobotSelectionButton robotId={robotIdSelected}/>);
        tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('doesnt render when robot has no pose', () => {
        // Robot is not selected
        const component = renderer.create(<RobotSelectionButton robotId={robotIdNoPose}/>);
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();

        // Robot is selected
        component.update(<RobotSelectionButton robotId={robotIdSelected}/>);
        tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('handles click events', async () => {
        useDispatchCallBack.mock.calls = [];
        const component = shallow((<RobotSelectionButton robotId={robotIdDefault}/>));
        component.find('Button').simulate('click');

        expect(useDispatchCallBack.mock.calls.length).toEqual(2);
        expect(useDispatchCallBack.mock.calls[0][0].type).toEqual(toggleSelectedRobot.type);
        expect(useDispatchCallBack.mock.calls[0][0].payload).toStrictEqual({ robotId: robotIdDefault });
        expect(useDispatchCallBack.mock.calls[1][0].type).toEqual(changeSelectedMap.type);
        expect(useDispatchCallBack.mock.calls[1][0].payload).toStrictEqual({ mapId: reduxStore.robotStatus.entities[robotIdDefault].robotStatus.currentMap.id });

        useDispatchCallBack.mock.calls = [];
    });
});

describe('Test FollowRobotButton', () => {
    it('uses correct colors when following and not following', () => {
        // Not following robot
        reduxStore.map.followRobot = false;
        const component = renderer.create(<FollowRobotButton/>);
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();

        // Following robot
        reduxStore.map.followRobot = true;
        component.update(<FollowRobotButton/>);
        tree = component.toJSON();
        expect(tree).toMatchSnapshot();

        reduxStore.map.followRobot = false;
    });

    it('disabled when no robot is selected', () => {
        // Robot selected
        reduxStore.map.selectedRobot = robotIdSelected;
        const component = renderer.create(<FollowRobotButton/>);
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();

        // No robot selected
        reduxStore.map.selectedRobot = '';
        component.update(<FollowRobotButton/>);
        tree = component.toJSON();
        expect(tree).toMatchSnapshot();

        reduxStore.map.selectedRobot = robotIdSelected;
    });

    it('handles click events', async () => {
        useDispatchCallBack.mock.calls = [];
        const component = shallow((<FollowRobotButton/>));
        component.find('Button').simulate('click');

        expect(useDispatchCallBack.mock.calls.length).toEqual(2);
        expect(useDispatchCallBack.mock.calls[0][0].type).toEqual(toggleFollowRobot.type);

        useDispatchCallBack.mock.calls = [];
    });
});
