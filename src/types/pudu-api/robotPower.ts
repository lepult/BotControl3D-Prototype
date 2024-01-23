export type TRobotPower =
    'Idle'
    // Charging at the charging station
    | 'CharingUsePile'
    // Charging via USB
    | 'Charging'
    | 'ChargeFull'
    | 'ChargeFullUsePile'
    | 'StopChargeUsePile'
    | 'Charge Error Contact'
    | 'Charge Error Electric'
    | 'Error Battery Pack Comm'
    | 'Error Over Volt'
    | 'Error Over Electric'
    | 'Error Over Temperature'
    | 'Error Over Time'
    | string;
