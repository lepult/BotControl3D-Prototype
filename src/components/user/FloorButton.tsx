import React, { FC } from 'react';
// @ts-ignore
import { Button } from 'chayns-components';
import { useDispatch, useSelector } from 'react-redux';
import { selectMapById, selectSelectedMap } from '../../redux-modules/map/selectors';
import { getPathDataByMapId } from '../../constants/puduData';
import { changeSelectedMap } from '../../redux-modules/map/actions';

const FloorButton: FC<{
    mapId: number,
}> = ({
    mapId,
}) => {
    const dispatch = useDispatch();
    const selectedMap = useSelector(selectSelectedMap);
    const map = useSelector(selectMapById(mapId));
    const pathData = getPathDataByMapId(mapId);

    if (map.hidden || !pathData) {
        return null;
    }

    return (
        <Button
            className={selectedMap === mapId ? 'map-button' : 'map-button button--secondary'}
            onClick={() => dispatch(changeSelectedMap({ mapId }))}
        >
            {map.showName}
        </Button>
    );
};

export default FloorButton;
