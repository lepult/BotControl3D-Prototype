export type TDevicesData = {
    devices: TDevice[];
};

export type TDevice = {
    deviceId: string;
    name: string;
    region: string;
    groups: TGroup[];
};

export type TGroup = {
    id: string;
    name: string;
    shopName: string;
    robots: TRobot[];
};

export type TRobot = {
    id: string;
    name: string;
    shopName: string;
};
