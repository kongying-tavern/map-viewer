import { GeoBoundingBox } from "@deck.gl/geo-layers/typed";
import { TileBoundingBox, TileIndex } from "@deck.gl/geo-layers/typed/tile-layer/types";
import { load } from "@loaders.gl/core";
import { ImageLoader } from "@loaders.gl/images";
import { clamp } from "@math.gl/core";

export const isGeoBoundingBox = (bbox: TileBoundingBox): bbox is GeoBoundingBox => {
  // GeoBoundingBox must has bbox.west
  return (bbox as GeoBoundingBox).west !== undefined;
};
export const isNonGeoBoundingBox = (bbox: TileBoundingBox): bbox is Exclude<TileBoundingBox, GeoBoundingBox> => {
  // NonGeoBoundingBox must has bbox.left
  return (bbox as Exclude<TileBoundingBox, GeoBoundingBox>).left !== undefined;
};
export const tileBoundingBoxToTuple = (bbox: TileBoundingBox, extent: number[]): [number, number, number, number] => {
  const minX = extent[0];
  const minY = extent[1];
  const maxX = extent[2];
  const maxY = extent[3];
  // You should NOT change anything about it.
  /**
   ************************************
   *    (left,top)
   *       +---------------+ X
   *       |               |
   *       |               |
   *       |               |
   *       |               |
   *       +---------------+
   *       Y        (right, bottom)
   ************************************
   */
  if (isGeoBoundingBox(bbox)) {
    const west = clamp(bbox.west, minX, maxX);
    const north = clamp(bbox.north, minY, maxY);
    const east = clamp(bbox.east, minX, maxX);
    const south = clamp(bbox.south, minY, maxY);
    return [west, north, east, south];
  } else if (isNonGeoBoundingBox(bbox)) {
    const left = clamp(bbox.left, minX, maxX);
    const bottom = clamp(bbox.bottom, minY, maxY);
    const right = clamp(bbox.right, minX, maxX);
    const top = clamp(bbox.top, minY, maxY);
    return [left, bottom, right, top];
  } else {
    throw new Error(`Wrong boundingBox type: ${bbox}`);
  }
};
const fetchOptions = {
  fetch: {
    headers: { Accept: "image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8" },
  },
};
export const fetchTileData = async ({ x, y, z }: TileIndex, tileMeta: TileMetadata) => {
  const url = `${tileMeta.baseUrl}/${tileMeta.tileName}/${z + tileMeta.tileLevel}/${x}_${y}.${
    tileMeta.extName
  }?version=${tileMeta.version}&region=${tileMeta.tileRegion}`;
  return localStorage.getItem("webp") === "true"
    ? await load(url, ImageLoader, fetchOptions)
    : await load(url, ImageLoader);
};

export const getTileLayerExtent = (
  tileLayerSize: { width: number; height: number },
  tileLayerOriginOffset: { x: number; y: number }
): [number, number, number, number] => {
  const minX = tileLayerOriginOffset.x;
  const minY = tileLayerOriginOffset.y;
  const maxX = tileLayerSize.width + tileLayerOriginOffset.x;
  const maxY = tileLayerSize.height + tileLayerOriginOffset.y;
  return [minX, minY, maxX, maxY];
};
