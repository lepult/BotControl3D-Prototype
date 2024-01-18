export const coordinateToMeter = (coordinate: [number, number]): [number, number] => {
    const mx = coordinate[0] * (111111 * Math.cos(0));
    const my = coordinate[1] * 111111;
    return [mx, my]
};
