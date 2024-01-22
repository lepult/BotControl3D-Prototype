import React from 'react';
import FloorsList from './floors-list/FloorsList';

const AdminMode = () => {
    return (
        <div>
            <h1>
                Verwaltung
            </h1>
            <p>
                Mit dieser Ansicht kannst du die Roboter und die Übersicht verwalten.
            </p>
            <FloorsList/>
        </div>
    );
};

export default AdminMode;
