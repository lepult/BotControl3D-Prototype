// Note that a xml string cannot be directly embedded in a data URL
// it has to be either escaped or converted to base64.
export const svgToDataURL = (svg: string): string => {
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};
