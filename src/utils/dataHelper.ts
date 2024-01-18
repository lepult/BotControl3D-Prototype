export const mapRobotElementsToPathData = (elements: any[]) => {
    const pathData: { id: any; type: any; name: any; color: any; path: any[]; }[] = [];
    elements.forEach((element) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (element.type !== 'track' && element.type !== 'virtual_wall')
            return;

        // Elements with the same id are connected lines
        // Add vector to other element, if they have the same id
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const find = pathData.find((d) => d.id === element.id && d.type === element.type);
        if (!find) {
            pathData.push({
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
                id: element.id,
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
                type: element.type,
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
                name: typeof element.name === 'string' ? element.name : element.id,
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
                color: element.type === 'track' ? [255, 0, 0] : [0, 0, 255],
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
                path: [...element.vector]
            });
        } else {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
            find.path.push(...element.vector);
        }
    });

    return pathData;
};