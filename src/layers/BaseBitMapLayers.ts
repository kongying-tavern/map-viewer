import { TileIndex } from "@deck.gl/geo-layers/typed/tile-layer/types";
import { BitmapLayer, BitmapLayerProps } from "@deck.gl/layers/typed";

const canvas = document.createElement("canvas");
const context = canvas.getContext("2d");

const drawDebugImage = ({ x, y, z }: TileIndex, tileSize: number) => {
  const size = tileSize;
  const lineHeight = 60;
  const half = Math.floor(size / 2);

  canvas.width = size;
  canvas.height = size;

  if (context) {
    context.strokeStyle = "white";
    context.textAlign = "center";
    context.font = "48px sans-serif";
    context.clearRect(0, 0, size, size);
    context.fillStyle = "rgba(100, 100, 100, 0.1)";
    context.fillRect(0, 0, size, size);
    context.fillStyle = "black";
    context.fillText(`z: ${z}`, half, half - lineHeight);
    context.fillText(`x: ${x}`, half, half);
    context.fillText(`y: ${y}`, half, half + lineHeight);
    context.strokeRect(0, 0, size, size);
    const data = context.getImageData(0, 0, size, size);
    return new ImageData(data.data, data.width, data.height);
  }
};
export const tileImageBitmapLayer = (
  props: BitmapLayerProps,
  id: string,
  bounds: [number, number, number, number],
  image: any
) =>
  new BitmapLayer(props, {
    data: undefined,
    id: id,
    image: image,
    bounds: bounds,
  });
export const tileImageBitmapDebugLayer = (
  props: BitmapLayerProps,
  { x, y, z }: TileIndex,
  bounds: [number, number, number, number],
  tileSize: number
) =>
  new BitmapLayer(props, {
    data: undefined,
    id: `tile-bitmap-debug-${x}-${y}-${z}`,
    image: drawDebugImage({ x, y, z }, tileSize),
    bounds: bounds,
  });
export const imageBitmapMontageLayer = (tileLayerMeta: TileLayerMetadata, extent: [number, number, number, number]) => {
  const { tileSize, tileMeta } = tileLayerMeta;
  const { baseUrl, tileName, tileRegion, extName } = tileMeta;
  const BitmapLayerArray: any[] = [];
  const range = (start: number, stop: number, step: number): Array<number> =>
    Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step);

  const leftArray = range(extent[0], extent[2], tileSize);
  leftArray.pop();
  const topArray = range(extent[1], extent[3], tileSize);
  topArray.pop();
  const lt = [];
  for (const x of leftArray) {
    for (const y of topArray) {
      lt.push([x, y]);
    }
  }

  for (const [left, top] of lt) {
    const y = -left / tileSize;
    const x = -top / tileSize;
    const z = 0;
    const bounds: [number, number, number, number] = [left, top + tileSize, left + tileSize, top];
    BitmapLayerArray.push([
      new BitmapLayer({
        id: `tile-bitmap-montage-${x}-${y}-${z}`,
        image: `${baseUrl}/${tileRegion}/${tileName}${x}_${y}.${extName}`,
        bounds: bounds,
      }),
      // new BitmapLayer({
      //   id: `tile-bitmap-montage-debug-${x}-${y}-${z}`,
      //   image: drawDebugImage({ x, y, z }, size),
      //   bounds: bounds,
      // }),
    ]);
  }
  return BitmapLayerArray;
};
