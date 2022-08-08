import { TileLayer } from "@deck.gl/geo-layers/typed";
import { tileImageBitmapDebugLayer, tileImageBitmapLayer } from "./BaseBitMapLayers";
import { tileImageLineDebugLayer } from "./BaseLineLayers";
import { fetchTileData, tileBoundingBoxToTuple } from "./utils";

export const Orthographic2DImageTileLayer = (
  tileLayerMeta: TileLayerMetadata,
  options: {
    extent: [number, number, number, number];
    debugLayer?: boolean;
  }
) => {
  const { tileSize, tileMeta, minZoomNative, maxZoomNative } = tileLayerMeta;
  const extent = options.extent;
  return new TileLayer({
    id: `ortho-2d-tile-layer-debug-${options.debugLayer?.toString()}`,
    minZoom: minZoomNative,
    maxZoom: maxZoomNative,
    tileSize: tileSize,
    extent: extent,
    getTileData: async ({ index: { x, y, z } }) => await fetchTileData({ x, y, z }, tileMeta),
    renderSubLayers: (props) => {
      const { id, data: image } = props;
      const {
        bbox,
        index: { x, y, z },
      } = props.tile;
      const bounds = tileBoundingBoxToTuple(bbox, extent);
      return [
        tileImageBitmapLayer(props, id, bounds, image),
        options.debugLayer && tileImageBitmapDebugLayer(props, { x, y, z }, bounds, tileSize),
        options.debugLayer && tileImageLineDebugLayer(props, bounds, { x, y, z }),
      ];
    },
  });
};
