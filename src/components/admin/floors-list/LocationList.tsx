import React, { FC } from 'react';
// @ts-ignore
import { Accordion, Button } from 'chayns-components';

type TLocation = {
    name: string,
    id: number,
}

const LocationList: FC<{
    locations: TLocation[],
    name: string,
}> = ({
    locations,
    name,
}) => {
    return (
        <Accordion head={name} isWrapped>
            <div
                className="accordion__content"
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                }}
            >
                {locations.map((location) => (
                    <Button>
                        {location.name}
                    </Button>
                ))}
            </div>
        </Accordion>
    );
}

export default LocationList;
