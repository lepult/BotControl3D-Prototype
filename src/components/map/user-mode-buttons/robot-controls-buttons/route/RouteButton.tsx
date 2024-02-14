import React from 'react';
import clsx from 'clsx';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Button, Tooltip } from 'chayns-components';
import './routeButton.scss';
import { useDispatch, useSelector } from 'react-redux';
import { selectRobotById, } from '../../../../../redux-modules/robot-status/selectors';
import { CustomDestinationType } from '../../../../../types/api/destination';
import { selectIsPlanningRoute, selectSelectedDestination } from '../../../../../redux-modules/misc/selectors';
import { selectSelectedRobotId } from '../../../../../redux-modules/map/selectors';
import { changeIsPlanningRoute } from '../../../../../redux-modules/misc/actions';

const RouteButton = () => {
    const dispatch = useDispatch();

    const selectedDestination = useSelector(selectSelectedDestination);
    const isPlanning = useSelector(selectIsPlanningRoute);

    const selectedRobotId = useSelector(selectSelectedRobotId);
    const selectedRobot = useSelector(selectRobotById(selectedRobotId || ''));

    return (
        <Tooltip
            bindListeners
            content={{ text: 'Lieferauftrag' }}
        >
            <Button
                className={clsx('icon-button pointer-events', {
                    'button--secondary': !selectedRobot?.robotStatus?.currentRoute && !isPlanning,
                })}
                onClick={() => {
                    if (isPlanning) {
                        dispatch(changeIsPlanningRoute({ isPlanning: false }));
                    } else {
                        dispatch(changeIsPlanningRoute({
                            isPlanning: true,
                            unselectDestination: selectedDestination?.destination.customType !== CustomDestinationType.target,
                        }))
                    }
                }}
            >
                <i className="fa fa-route"/>
            </Button>
        </Tooltip>
    );
};

export default RouteButton;
