import React from 'react';
import FloorsList from './floors-list/FloorsList';
import RobotsList from './robots-list/RobotsList';

const AdminMode = () => (
    <div className="tapp">
        <h1>
            Verwaltung
        </h1>
        <p>
            Mit dieser Ansicht kannst du die Roboter und die Stockwerke verwalten. Die Roboter können in dieser Ansicht nicht gesteuert werden.
        </p>
        <RobotsList/>
        <FloorsList/>
    </div>
);

export default AdminMode;
