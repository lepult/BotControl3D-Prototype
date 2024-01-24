import React, { FC } from 'react';
import './userModeButtons.scss';
import { useSelector } from 'react-redux';
import { selectMapIds } from '../../redux-modules/map/selectors';
import FloorButton from './FloorButton';

const UserModeButtons: FC = () => {
    const allMapIds = useSelector(selectMapIds);

    return (
        <div className="user-mode-buttons__wrapper">
            <div className="map-buttons position-left position-top">
                Buttons Oben Links
            </div>
            <div className="map-buttons position-right position-top">
                Buttons Oben Rechts
            </div>
            <div className="map-buttons position-left position-bottom">
                {allMapIds.map((id) => (
                    <FloorButton mapId={id}/>
                ))}
            </div>
            <div className="map-buttons position-right position-bottom">
                Buttons Unten Rechts
            </div>
        </div>
    )
};

export default UserModeButtons;
