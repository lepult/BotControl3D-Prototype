import React, { useMemo, useState } from 'react';
import { createDialog, DialogButtonType, DialogType } from 'chayns-api';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Button } from 'chayns-components';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import { selectSelectedRobotId } from '../../../../../redux-modules/map/selectors';
import { selectRobotById } from '../../../../../redux-modules/robot-status/selectors';
import { getMapRobotStatus } from '../../../../../utils/robotStatusHelper';

const InformationButton = () => {
    const selectedRobotId = useSelector(selectSelectedRobotId);

    const robot = useSelector(selectRobotById(selectedRobotId || ''));

    const status = useMemo(() => [{
        name: 'Status',
        value: getMapRobotStatus(robot?.robotStatus, robot?.puduRobotStatus),
    }, {
        name: 'Batterieleistung',
        value: robot?.puduRobotStatus?.robotPower
            ? `${robot?.puduRobotStatus?.robotPower}%`
            : '-',
    }, {
        name: 'Position',
        value: robot?.robotStatus?.currentMap?.showName || '-',
    }], [robot]);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const dialogText = useMemo(() => {
        let text = `[h1]${robot?.robotStatus?.robotName || 'Unbekannt'}[/h1]`;
        status.forEach(({ name, value }) => {
            text += `[p]${name}: [b]${value}[/b][/p]`;
        });
        return text;
    }, [robot, status]);
    const dialog = createDialog({
        type: DialogType.ALERT,
        text: dialogText,
        buttons: [{ type: DialogButtonType.CANCEL, text: 'Schließen' }],
    });

    return (
        <Button
            disabled={!selectedRobotId}
            className={clsx('icon-button pointer-events', {
                'button--secondary': !isDialogOpen,
            })}
            onClick={() => {
                setIsDialogOpen(true);
                dialog.open()
                    .finally(() => setIsDialogOpen(false));
            }}
        >
            <i className="far fa-info"/>
        </Button>
    )
};

export default InformationButton;
