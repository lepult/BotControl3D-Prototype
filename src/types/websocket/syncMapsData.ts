export type TSyncMapsData = {
    currentMapId: number;
    maps: Array<TSelectMap>;
};

export type TSelectMap = {
    index: number;
    name: string;
    showName: string;
    hidden: number;
};
