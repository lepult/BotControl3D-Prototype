import {
    coordinateToMeter,
    meterToCoordinate,
    robotAngleToViewStateBearing,
    radiansToDegrees,
    svgToDataURL
} from './conversionHelper';

describe("coordinateToMeter", () => {
    test('[0, 0] should result in [0, 0]', () => {
        expect(coordinateToMeter([0, 0])).toStrictEqual([0, 0]);
    });

    test('[10, 0] should result in [1111110, 0]', () => {
        expect(coordinateToMeter([10, 0])).toStrictEqual([1111110, 0]);
    });

    test('[0, 10] should result in [0, ?]', () => {
        expect(coordinateToMeter([0, 10])).toStrictEqual([0, 1111110]);
    });

    test('[10, 10] should result in [1111110, ?]', () => {
        expect(coordinateToMeter([10, 10])).toStrictEqual([1111110, 1111110]);
    });
});

describe("meterToCoordinate", () => {
    test('[0, 0] should result in [0, 0]', () => {
        expect(meterToCoordinate([0, 0])).toStrictEqual([0, 0]);
    });

    test('[1111110, 0] should result in [10, 0]', () => {
        expect(meterToCoordinate([1111110, 0])).toStrictEqual([10, 0]);
    });

    test('[0, 1111110] should result in [0, 10]', () => {
        expect(meterToCoordinate([0, 1111110])).toStrictEqual([0, 10]);
    });

    test('[1111110, 1111110] should result in [10, 10]', () => {
        expect(meterToCoordinate([1111110, 1111110])).toStrictEqual([10, 10]);
    });
});
describe("robotAngleToViewStateBearing", () => {
    test('0 should result in 90', () => {
        expect(robotAngleToViewStateBearing(0)).toBe(90);
    });

    test('1 should result in ~32', () => {
        expect(Math.round(robotAngleToViewStateBearing(1))).toBe(33);
    });

    test('Math.PI should result in -90', () => {
        expect(robotAngleToViewStateBearing(Math.PI)).toBe(-90);
    });
});

describe("radiansToDegrees", () => {
    test('0 should result in 0', () => {
        expect(radiansToDegrees(0)).toBe(0);
    });

    test('1 should result in ~57', () => {
        expect(Math.round(radiansToDegrees(1))).toBe(57);
    });

    test('Math.PI should result in 180', () => {
        expect(radiansToDegrees(Math.PI)).toBe(180);
    });
});

const svg = `
<svg
    viewBox="-15 -15 478 542"
    xmlns="http://www.w3.org/2000/svg"
    height="400"
    width="400"
>
    <path
        d="M349.4 44.6c5.9-13.7 1.5-29.7-10.6-38.5s-28.6-8-39.9 1.8l-256 224c-10 8.8-13.6 22.9-8.9 35.3S50.7 288 64 288H175.5L98.6 467.4c-5.9 13.7-1.5 29.7 10.6 38.5s28.6 8 39.9-1.8l256-224c10-8.8 13.6-22.9 8.9-35.3s-16.6-20.7-30-20.7H272.5L349.4 44.6z"
        fill="rgba(25, 139, 44, 1)"
        stroke="rgba(255, 255, 255, 1)"
        stroke-width="30"
    />
</svg>`
const expectedDataUrl = 'data:image/svg+xml;charset=utf-8,%0A%3Csvg%0A%20%20%20%20viewBox%3D%22-15%20-15%20478%20542%22%0A%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%0A%20%20%20%20height%3D%22400%22%0A%20%20%20%20width%3D%22400%22%0A%3E%0A%20%20%20%20%3Cpath%0A%20%20%20%20%20%20%20%20d%3D%22M349.4%2044.6c5.9-13.7%201.5-29.7-10.6-38.5s-28.6-8-39.9%201.8l-256%20224c-10%208.8-13.6%2022.9-8.9%2035.3S50.7%20288%2064%20288H175.5L98.6%20467.4c-5.9%2013.7-1.5%2029.7%2010.6%2038.5s28.6%208%2039.9-1.8l256-224c10-8.8%2013.6-22.9%208.9-35.3s-16.6-20.7-30-20.7H272.5L349.4%2044.6z%22%0A%20%20%20%20%20%20%20%20fill%3D%22rgba(25%2C%20139%2C%2044%2C%201)%22%0A%20%20%20%20%20%20%20%20stroke%3D%22rgba(255%2C%20255%2C%20255%2C%201)%22%0A%20%20%20%20%20%20%20%20stroke-width%3D%2230%22%0A%20%20%20%20%2F%3E%0A%3C%2Fsvg%3E'
describe("svgToDataURL", () => {
    test('icon svg should result in valid data url', () => {
        expect(svgToDataURL(svg)).toBe(expectedDataUrl);
    });
});