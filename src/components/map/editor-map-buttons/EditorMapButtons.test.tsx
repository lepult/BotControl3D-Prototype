import React from 'react';
import renderer from 'react-test-renderer';
import EditorMapButtons from './EditorMapButtons';
import { TViewState } from '../../../types/deckgl-map';

jest.mock('./buttons/ImportButton', () => () => <button className="import"/>);
jest.mock('./buttons/ChangeInitialViewButton', () => (
    { viewState, mapId }: { viewState: TViewState, mapId: number }
) => <button className={viewState && mapId ? 'change-initial-view' : ''}/>);
jest.mock('./buttons/SaveButton', () => (
    { floorModels }: { floorModels: number[] }
) => <button className={floorModels?.length > 0 ? 'save' : ''} />);
jest.mock('./buttons/CancelButton', () => () => <button className="cancel"/>);
jest.mock('./buttons/ShortcutsButton', () => () => <button className="shortcuts"/>);
jest.mock('../user-mode-buttons/interaction-buttons/ResetViewButton', () => () => <button className="reset"/>);

it('EditorMapButtons should result in showing all buttons', () => {
    const component = renderer.create(
        <EditorMapButtons
            floorModels={[{ id: '1', url: '', position: [0, 0, 0], orientation: [0, 0, 0]}]}
            viewState={{ bearing: 0, latitude: 0, longitude: 0, pitch: 0, zoom: 0 }}
            mapId={1}
        />,
    );

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
})