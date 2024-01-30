import React, { FC, useRef, useState } from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { PersonFinder, SimpleWrapperContext, Input } from 'chayns-components';

type TPersonFinderItem = {
    showName: string,
    id: string | number,
}

type TPersonFinderRef = {
    clear: () => void,
}

type TPersonFinderValues = [TPersonFinderItem] | [];

const RouteInput: FC<{
    items: TPersonFinderItem[],
    icon: string,
    setSelected: (id: string | number | null) => void,
    selected: TPersonFinderItem | null,
}> = ({
    items,
    icon,
    setSelected,
    selected
}) => {
    console.log('selected', selected);
    const [personFinderInput, setPersonFinderInput] = useState('');

    const personFinderRef = useRef<TPersonFinderRef>();

    const clearPersonFinder = () => {
        if (personFinderRef.current) {
            personFinderRef.current.clear();
        }
    }

    return (
        <div className="route-input-wrapper">
            <i className={`far fa-${icon} route-input-icon`}/>
            <PersonFinder
                ref={personFinderRef}
                placeholder="Ziel"
                showPersons={false}
                // dynamic={Input.BOTTOM_DYNAMIC}
                design={Input.BORDER_DESIGN}
                showKnownPersons={false}
                context={SimpleWrapperContext({
                    showName: 'showName',
                    identifier: 'id',
                    search: ['showName'],
                })}
                onAdd={(item: TPersonFinderItem) => {
                    console.log('onAdd', item);
                    setSelected(item.id);
                }}
                onRemove={(item: TPersonFinderItem) => {
                    setSelected(null);
                }}
                value={personFinderInput}
                values={selected ? [selected] : []}
                contextProps={{
                    data: items,
                    hasMore: false,
                    onInput: (input: string) => {
                        console.log('onInput', input)
                        // if (selectedValues) {
                        //     setSelectedValues([])
                        // }
                        setPersonFinderInput(input);
                    }
                }}
            />
        </div>
    )
};

export default RouteInput;
