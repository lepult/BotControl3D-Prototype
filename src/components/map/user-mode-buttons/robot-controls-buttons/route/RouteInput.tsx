import React, { FC, useMemo, useRef, useState } from 'react';
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

const isNumeric = (possibleNumber: string) => !Number.isNaN(Number(possibleNumber));

type TCompare = number | string | boolean;
const compare = (a2: TCompare, b2: TCompare) => a2 > b2
    ? 1
    : -1;

const RouteInput: FC<{
    items: TPersonFinderItem[],
    icon: string,
    setSelected: (id: string | number | null) => void,
    selected: TPersonFinderItem | null,
    placeholder: string,
}> = ({
    items,
    icon,
    setSelected,
    selected,
    placeholder,
}) => {
    const [personFinderInput, setPersonFinderInput] = useState('');

    const personFinderRef = useRef<TPersonFinderRef>();

    const sortedItems = useMemo(() => items
        .sort((a, b) => a.showName.localeCompare(
            b.showName,
            undefined,
            {
                numeric: true,
                sensitivity: 'base',
            },
        )),[items]);

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
                placeholder={placeholder}
                showPersons={false}
                // dynamic={Input.BOTTOM_DYNAMIC}
                design={Input.BORDER_DESIGN}
                showKnownPersons={false}
                context={SimpleWrapperContext({
                    showName: 'showName',
                    identifier: 'id',
                    search: ['showName'],
                    filter: (inputValue: string) => (e: TPersonFinderItem) => inputValue
                        ? e.showName.toLowerCase().includes(inputValue.toLowerCase())
                        : true,
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
                    data: sortedItems,
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
