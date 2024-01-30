import React, { useMemo, useState } from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Button } from 'chayns-components';
import { createDialog, DialogType } from 'chayns-api';
import './routeButton.scss';
import { useSelector } from 'react-redux';
import { selectRobotEntities, selectRobotIds } from '../../../../redux-modules/robot-status/selectors';
import RouteInput from './RouteInput';
import { selectDestinationEntities, selectDestinationIds } from '../../../../redux-modules/destination/selectors';
import { CustomDestinationType, TDestination } from '../../../../types/api/destination';
import { postSendRobotFetch } from '../../../../api/robot/postSendRobot';

const getDestinationName = (destination: TDestination) => {
    if (destination.chaynsUser) {
        return destination.chaynsUser.name
    }

    return destination.name;
};

const RouteButton = () => {
    const errorDialog = createDialog({
        type: DialogType.ALERT,
        text: 'Es ist ein Fehler aufgetreten',
    });

    const [isPlanningRoute, setIsPlanningRoute] = useState(false);

    const robotEntities = useSelector(selectRobotEntities);
    const robotIds = useSelector(selectRobotIds);
    const robots = useMemo(() => robotIds
        .filter((robotId) => robotEntities[robotId]?.robotStatus)
        .map((robotId) => ({
            showName: robotEntities[robotId]?.robotStatus?.robotName as string,
            id: robotEntities[robotId]?.robotId as string,
        })), [robotEntities, robotIds]);

    const destinationEntities = useSelector(selectDestinationEntities);
    const destinationIds = useSelector(selectDestinationIds);
    const destinations = useMemo(() => destinationIds
        .filter((destinationId) => destinationEntities[destinationId].customType === CustomDestinationType.target)
        .map((destinationId) => ({
            showName: getDestinationName(destinationEntities[destinationId]),
            id: destinationEntities[destinationId].id,
        }))
            .sort((a, b) => a.showName > b.showName ? 1 : -1)
        , [destinationEntities, destinationIds]);

    // TODO Remove null from initial state and comment out map line below, to allow multi destination routes.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const [selectedDestination, setSelectedDestination] = useState<number | null>(null);
    const [selectedRobot, setSelectedRobot] = useState<string | number | null>(null);

    const handleSendRobot = () => {
        if (!selectedDestination || !selectedRobot) {
            void errorDialog.open()
            return;
        }

        const requestBody: TDestination[] = [destinationEntities[selectedDestination]];

        postSendRobotFetch(selectedRobot as string, requestBody)
            .then((success) => {
                if (success) {
                    setIsPlanningRoute(false);
                    setSelectedDestination(null);
                    setSelectedRobot(null);
                } else {
                    void errorDialog.open()
                }
            })
            .catch((e) => {
                void errorDialog.open()
            });
    }

    if (isPlanningRoute) {
        return (
            <div
                className="content__card route-planner"
            >
                <div style={{ display: 'flex', justifyContent: 'right' }}>
                    <i
                        style={{ cursor: 'pointer', padding: '5px' }}
                        className="far fa-times"
                        onClick={() => setIsPlanningRoute(false)}
                    />
                </div>
                <RouteInput
                    items={destinations}
                    icon="map-marker-alt"
                    placeholder="Ziel"
                    setSelected={(destinationId) => setSelectedDestination(destinationId as number | null)}
                    selected={selectedDestination ? {
                        id: selectedDestination,
                        showName: getDestinationName(destinationEntities[selectedDestination]),
                    } : null}
                />
                <RouteInput
                    items={robots}
                    icon="robot"
                    placeholder="Roboter"
                    setSelected={setSelectedRobot}
                    selected={selectedRobot ? {
                        id: selectedRobot as string,
                        showName: robotEntities[selectedRobot as string]?.robotStatus?.robotName as string
                    } : null}
                />
                <div className="send-button-wrapper">
                    <Button
                        onClick={() => handleSendRobot()}
                        disabled={!selectedDestination || !selectedRobot}
                    >
                        <i style={{ marginRight: '5px' }} className="far fa-paper-plane"/>
                        Senden
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div>
            <Button
                className="icon-button"
                onClick={() => setIsPlanningRoute(true)}
            >
                <i className="fa fa-route"/>
            </Button>
        </div>
    );
};

export default RouteButton;
