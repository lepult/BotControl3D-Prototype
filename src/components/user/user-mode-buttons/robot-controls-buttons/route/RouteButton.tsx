import React, { useEffect, useMemo, useState } from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Button } from 'chayns-components';
import { createDialog, DialogType } from 'chayns-api';
import './routeButton.scss';
import { useDispatch, useSelector } from 'react-redux';
import { selectRobotEntities, selectRobotIds } from '../../../../../redux-modules/robot-status/selectors';
import RouteInput from './RouteInput';
import { selectDestinationEntities, selectDestinationIds } from '../../../../../redux-modules/destination/selectors';
import { CustomDestinationType, TDestination } from '../../../../../types/api/destination';
import { postSendRobotFetch } from '../../../../../api/robot/postSendRobot';
import { selectSelectedDestination } from '../../../../../redux-modules/misc/selectors';
import { selectSelectedRobot } from '../../../../../redux-modules/map/selectors';
import { toggleSelectedRobot } from '../../../../../redux-modules/map/actions';
import { changeSelectedDestination } from '../../../../../redux-modules/misc/actions';

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

    const dispatch = useDispatch();


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

    const selectedDestinationMapElement = useSelector(selectSelectedDestination);
    const selectedDestination = useMemo(() => destinationIds
        .map((id) => destinationEntities[id])
        .find((destination) =>
            destination.name === selectedDestinationMapElement?.destinationName
            && destination.mapId === selectedDestinationMapElement?.mapId
            && destination.customType === CustomDestinationType.target
        ),
        [destinationEntities, destinationIds, selectedDestinationMapElement]);
    useEffect(() => {
        console.log('selectedDestinationMapElement', selectedDestinationMapElement);
    }, [selectedDestinationMapElement]);
    useEffect(() => {
        console.log('selectedDestination', selectedDestination);
    }, [selectedDestination]);

    const selectedRobotOnMap = useSelector(selectSelectedRobot);

    const handleSendRobot = () => {
        if (!selectedDestinationMapElement || !selectedRobotOnMap || !selectedDestination) {
            void errorDialog.open()
            return;
        }

        const requestBody: TDestination[] = [selectedDestination];

        postSendRobotFetch(selectedRobotOnMap, requestBody)
            .then((success) => {
                if (success) {
                    setIsPlanningRoute(false);
                    dispatch(changeSelectedDestination(undefined));
                    // dispatch(toggleSelectedRobot({ robotId: undefined }));
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
                    setSelected={(destinationId) => {
                        dispatch(changeSelectedDestination(destinationId ? {
                            mapId: destinationEntities[destinationId as number].mapId,
                            destinationName: destinationEntities[destinationId as number].name,
                        } : undefined));
                        // setSelectedDestination(destinationId as number | null)
                    }}
                    selected={selectedDestination ? {
                        id: selectedDestination.id,
                        showName: getDestinationName(selectedDestination),
                    } : null}
                />
                <RouteInput
                    items={robots}
                    icon="robot"
                    placeholder="Roboter"
                    setSelected={(robotId) => dispatch(toggleSelectedRobot({ robotId: (robotId as string | null) || undefined }))}
                    selected={selectedRobotOnMap ? {
                        id: selectedRobotOnMap,
                        showName: robotEntities[selectedRobotOnMap]?.robotStatus?.robotName as string
                    } : null}
                />
                <div className="send-button-wrapper">
                    <Button
                        onClick={() => handleSendRobot()}
                        disabled={!selectedDestination || !selectedRobotOnMap}
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