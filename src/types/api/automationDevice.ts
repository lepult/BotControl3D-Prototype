export type TAutomationDevice = {
    id: number;
    deviceId: number;
    mqttTopic?: string;
    mqttPropertyName?: string;
    mqttPropertyValue?: string;
    destinationId: number;
    type: 'call_elevator' | string;
    creationTime: Date;
    deletionTime?: Date;
};

export type TAutomationDeviceDto = {
    id?: number;
    deviceId?: number | null;
    mqttTopic?: string | null;
    mqttPropertyName?: string | null;
    mqttPropertyValue?: string | null;
    destinationId?: number;
    type?: 'call_elevator' | string;
};
