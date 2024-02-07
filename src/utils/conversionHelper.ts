export const coordinateToMeter = (coordinate: [number, number]): [number, number] => {
    const mx = coordinate[0] * (111111 * Math.cos(0));
    const my = coordinate[1] * 111111;
    return [mx, my]
};

export const meterToCoordinate = (meters: [number, number]): [number, number] => {
    const lng = meters[0] / (111111 * Math.cos(0));
    const lat = meters[1] / 111111;
    return [lng, lat]
};

export const robotAngleToViewStateBearing = (angle: number) => {
    return -radiansToDegrees(angle) + 90;
}

// -x +90

export const radiansToDegrees = (radians: number) => {
    const pi = Math.PI;
    return radians * (180/pi);
}

export const svgToDataURL = (svg: string): string => {
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};
