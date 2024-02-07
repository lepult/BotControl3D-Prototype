import React, { FC } from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Button } from 'chayns-components';
import { useDispatch } from 'react-redux';
import clsx from 'clsx';
import { changeInitialViewState } from '../../../../redux-modules/map/actions';
import { TViewState } from '../../../../types/deckgl-map';

const ChangeInitialViewButton: FC<{
    viewState: TViewState | undefined,
    mapId: number,
}> = ({
    viewState,
    mapId,
}) => {
    const dispatch = useDispatch();

    return (
        <Button
            className={clsx('icon-button pointer-events button--secondary')}
            onClick={() => {
                const newInitialViewState = {
                    bearing: viewState?.bearing || 0,
                    latitude: viewState?.latitude || 0,
                    longitude: viewState?.longitude || 0,
                    pitch: viewState?.pitch || 0,
                    zoom: viewState?.zoom || 21,
                };
                console.log('newInitialViewState', newInitialViewState);
                dispatch(changeInitialViewState({
                    mapId,
                    viewState: newInitialViewState,
                }))
            }}
        >
            <i className="fa fa-crosshairs-simple"/>
        </Button>
    )
};

export default ChangeInitialViewButton;
