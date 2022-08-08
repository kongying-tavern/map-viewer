import { TileIndex } from "@deck.gl/geo-layers/typed/tile-layer/types";
import { LineLayer, LineLayerProps } from "@deck.gl/layers/typed";
export const mapCenterLineLayer = (extent: number[], mapCenter: { x: number; y: number }, props?: LineLayerProps) =>
  new LineLayer(props ?? {}, {
    id: `map-center-line`,
    data: [
      { sourcePosition: [mapCenter.x, extent[1]], targetPosition: [mapCenter.x, extent[3]] },
      { sourcePosition: [extent[0], mapCenter.y], targetPosition: [extent[2], mapCenter.y] },
    ],
    getColor: [255, 255, 0, 255],
    getWidth: 2,
  });
export const worldOriginLineLayer = (extent: number[], props?: LineLayerProps) =>
  new LineLayer(props ?? {}, {
    id: `world-origin-line`,
    data: [
      { sourcePosition: [0, extent[1]], targetPosition: [0, extent[3]] },
      { sourcePosition: [extent[0], 0], targetPosition: [extent[2], 0] },
    ],
    getColor: [255, 0, 0, 255],
    getWidth: 3,
  });
export const tileImageLineDebugLayer = (
  props: LineLayerProps,
  bounds: [number, number, number, number],
  { x, y, z }: TileIndex
) =>
  new LineLayer(props, {
    id: `tile-line-debug-${x}-${y}-${z}`,
    data: [{ sourcePosition: [bounds[0], bounds[3]], targetPosition: [bounds[2], bounds[1]] }],
  });
export const mousePositionLineLayer = (
  extent: number[],
  mousePosition: [x: number, y: number],
  props?: LineLayerProps
) =>
  new LineLayer(props ?? {}, {
    id: `mouse-pos-line`,
    data: [
      { sourcePosition: [mousePosition[0], extent[1]], targetPosition: [mousePosition[0], extent[3]] },
      { sourcePosition: [extent[0], mousePosition[1]], targetPosition: [extent[2], mousePosition[1]] },
    ],
    getColor: [255, 255, 255, 255],
    getWidth: 2,
    updateTriggers: { mousePosition },
  });
