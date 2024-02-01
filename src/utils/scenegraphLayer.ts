import { ScenegraphLayer } from '@deck.gl/mesh-layers/typed';
import { ModelType } from '../constants/models';
import { scenegraphLayerDefaults } from '../constants/deckGl';

type TGltfModel = {
    id: string,
    url: string,
    position: [number, number, number],
    orientation: [number, number, number],
} // TODO Add type to its own file.

export const getScenegraphLayer = (floorModel: ModelType, mapId: number) => new ScenegraphLayer({
    ...scenegraphLayerDefaults,
    id: `scenegraphLayer-${mapId}-${floorModel.id}`,
    data: [{
        position: floorModel.position,
        orientation: floorModel.orientation,
    }],
    scenegraph: floorModel.url,
    getPosition: (m: TGltfModel) => m.position,
    getOrientation: (m: TGltfModel) => m.orientation,
});
