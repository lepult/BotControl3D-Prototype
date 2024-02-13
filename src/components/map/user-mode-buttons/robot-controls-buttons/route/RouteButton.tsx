import React, { useMemo, useState } from 'react';
import clsx from 'clsx';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Button, SmallWaitCursor, Tooltip } from 'chayns-components';
import { createDialog, DialogType } from 'chayns-api';
import './routeButton.scss';
import { useDispatch, useSelector } from 'react-redux';
import {
    selectRobotById,
    selectRobotEntities,
    selectRobotIds
} from '../../../../../redux-modules/robot-status/selectors';
import RouteInput from './RouteInput';
import {
    selectDestinationEntities,
    selectDestinationIds
} from '../../../../../redux-modules/destination/selectors';
import { CustomDestinationType, TDestination } from '../../../../../types/api/destination';
import { postSendRobotFetch } from '../../../../../api/robot/postSendRobot';
import {
    selectIsPlanningRoute,
    selectSelectedDestination,
} from '../../../../../redux-modules/misc/selectors';
import { selectMapEntities, selectSelectedRobotId } from '../../../../../redux-modules/map/selectors';
import { toggleSelectedRobot } from '../../../../../redux-modules/map/actions';
import { changeIsPlanningRoute, changeSelectedDestination } from '../../../../../redux-modules/misc/actions';
import { TMap } from '../../../../../types/api/map';

type TMapEntities = { [key: number]: TMap }

const getDestinationName = (destination: TDestination, mapEntities: TMapEntities) => {
    if (destination.chaynsUser) {
        return destination.chaynsUser.name
    }

    const mapName = mapEntities[destination.mapId].showName
    return `${destination.name} ${mapName ? `(${mapName})` : ''}`;
};
const RouteButton = () => {
    const dispatch = useDispatch();

    const isPlanningRoute = useSelector(selectIsPlanningRoute);

    const robotEntities = useSelector(selectRobotEntities);
    const robotIds = useSelector(selectRobotIds);
    const robots = useMemo(() => robotIds
        .filter((robotId) => robotEntities[robotId]?.robotStatus)
        .map((robotId) => ({
            showName: robotEntities[robotId]?.robotStatus?.robotName as string,
            id: robotEntities[robotId]?.robotId as string,
        })), [robotEntities, robotIds]);

    const mapEntities = useSelector(selectMapEntities);

    const destinationEntities = useSelector(selectDestinationEntities);
    const destinationIds = useSelector(selectDestinationIds);
    const destinationItems = useMemo(() => destinationIds
        .filter((destinationId) => destinationEntities[destinationId].destination.customType === CustomDestinationType.target)
        .map((destinationId) => ({
            showName: getDestinationName(destinationEntities[destinationId].destination, mapEntities),
            id: destinationEntities[destinationId].destination.id,
        }))
    , [destinationEntities, destinationIds, mapEntities]);


    const selectedDestination = useSelector(selectSelectedDestination);

    const selectedRobotId = useSelector(selectSelectedRobotId);
    const selectedRobot = useSelector(selectRobotById(selectedRobotId || ''));

    const [isFetching, setIsFetching] = useState(false);
    const handleSendRobot = () => {
        if (!selectedRobotId || !selectedDestination) {
            void createDialog({
                type: DialogType.ALERT,
                text: 'Fehler: Es muss ein Roboter und ein Standort ausgewählt werden',
            }).open();
            return;
        }

        const requestBody: TDestination[] = [selectedDestination.destination];

        setIsFetching(true);
        postSendRobotFetch(selectedRobotId, requestBody)
            .then((success) => {
                setIsFetching(false);
                if (success) {
                    dispatch(changeIsPlanningRoute({ isPlanning: false }))
                    dispatch(changeSelectedDestination(undefined));
                    // dispatch(toggleSelectedRobot({ robotId: undefined }));
                }
            })
            .catch((e) => {
                setIsFetching(false);
            });
    }

    if (isPlanningRoute) {
        return (
            <div className="content__card route-planner pointer-events">
                <div style={{ display: 'flex', justifyContent: 'right' }}>
                    <i
                        style={{ cursor: 'pointer', padding: '5px' }}
                        className="far fa-times"
                        onClick={() => dispatch(changeIsPlanningRoute({ isPlanning: false }))}
                    />
                </div>
                <RouteInput
                    items={destinationItems}
                    icon="map-marker-alt"
                    placeholder="Ziel"
                    setSelected={(destinationId ) => dispatch(changeSelectedDestination(destinationId as number))}
                    selected={selectedDestination ? {
                        id: selectedDestination.destination.id,
                        showName: getDestinationName(selectedDestination.destination, mapEntities),
                    } : null}
                />
                <RouteInput
                    items={robots}
                    icon="robot"
                    placeholder="Roboter"
                    setSelected={(robotId) => dispatch(toggleSelectedRobot({ robotId: (robotId as string | null) || undefined }))}
                    selected={selectedRobotId ? {
                        id: selectedRobotId,
                        showName: robotEntities[selectedRobotId]?.robotStatus?.robotName as string
                    } : null}
                />
                <div className="send-button-wrapper">
                    {isFetching ? <SmallWaitCursor show/> : (
                        <Button
                            onClick={() => handleSendRobot()}
                            disabled={!selectedDestination || !selectedRobotId}
                        >
                            <i style={{ marginRight: '5px' }} className="far fa-paper-plane"/>
                            Senden
                        </Button>
                    )}
                </div>
            </div>
        )
    }

    return (
        <Tooltip
            bindListeners
            content={{ text: 'Lieferauftrag' }}
        >
            <Button
                className={clsx('icon-button pointer-events', {
                    'button--secondary': !selectedRobot?.robotStatus?.currentRoute,
                })}
                onClick={() => dispatch(changeIsPlanningRoute({
                    isPlanning: true,
                    unselectDestination: selectedDestination?.destination.customType !== CustomDestinationType.target,
                }))}
            >
                <i className="fa fa-route"/>
            </Button>
        </Tooltip>
    );
};

export default RouteButton;
