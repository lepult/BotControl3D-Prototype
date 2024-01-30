import React, { useEffect, useMemo, useState } from 'react';
// @ts-ignore
import { Button, Input, PersonFinder, SimpleWrapperContext } from 'chayns-components';
import './routeButton.scss';
import { useSelector } from 'react-redux';
import { selectRobotEntities, selectRobotIds } from '../../redux-modules/robot-status/selectors';
import RouteInput from './RouteInput';
import { selectDestinationEntities, selectDestinationIds } from '../../redux-modules/destination/selectors';
import { CustomDestinationType, TDestination } from '../../types/api/destination';
import { string } from 'prop-types';
import { postSendRobotFetch } from '../../api/robot/postSendRobot';
import { createDialog, DialogType } from 'chayns-api';

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

    const [selectedDestinations, setSelectedDestinations] = useState<number[]>([]);
    const [robot, setRobot] = useState<string | number | null>(null);

    const handleSendRobot = () => {
        if (selectedDestinations.length === 0 || !robot) {
            void errorDialog.open()
            return;
        }

        const requestBody: TDestination[] = selectedDestinations.map((destinationId) => destinationEntities[destinationId]);

        postSendRobotFetch(robot as string, requestBody)
            .then((success) => {
                if (success) {
                    setIsPlanningRoute(false);
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
                <i
                    style={{ cursor: 'pointer', padding: '5px' }}
                    className="far fa-times"
                    onClick={() => setIsPlanningRoute(false)}
                />
                {[...selectedDestinations, null].map((selectedDestination, index, array) => (
                    <div>
                        {index > 0 && (
                            <div>
                                <i className="far fa-ellipsis-v route-input-icon"/>
                            </div>
                        )}
                        <RouteInput
                            items={destinations}
                            icon={index === array.length - 1
                                ? 'map-marker-alt'
                                : 'dot-circle'}
                            setSelected={(destinationId) => {
                                console.log('setSelected', destinationId, index);
                                setSelectedDestinations((prev) => {
                                    const newSelectedDestinations = [...prev];
                                    newSelectedDestinations[index] = destinationId as number;
                                    return newSelectedDestinations;
                                });
                            }}
                            selected={selectedDestinations[index] ? {
                                id: selectedDestinations[index],
                                showName: getDestinationName(destinationEntities[selectedDestinations[index]]),
                            } : null}
                        />
                    </div>
                ))}
                <RouteInput
                    items={robots}
                    icon="robot"
                    setSelected={setRobot}
                    selected={robot ? {
                        id: robot as string,
                        showName: robotEntities[robot as string]?.robotStatus?.robotName as string
                    } : null}
                />
                <div className="send-button-wrapper">
                    <Button
                        onClick={() => handleSendRobot()}
                        disabled={selectedDestinations.length === 0 || !robot}
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
                onClick={() => setIsPlanningRoute(true)}
            >
                <i className="fa fa-route"/>
            </Button>
        </div>
    );
};

export default RouteButton;
