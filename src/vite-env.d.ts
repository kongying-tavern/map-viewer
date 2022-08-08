/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

declare interface TileMetadata {
  baseUrl: string;
  tileName: string;
  tileLevel: number;
  tileRegion: string;
  version: number;
  extName: string;
}
declare interface TileLayerMetadata {
  tileMeta: TileMetadata;
  tileSize: number;
  minZoomNative: number;
  maxZoomNative: number;
}
declare type TileLayerSize = { width: number; height: number };
declare type TileOriginOffset = { x: number; y: number };
declare type MapCenter = { x: number; y: number };
declare interface MapMetadata {
  tileLayerMeta: TileLayerMetadata;
  zoom: number;
  minZoom: number;
  maxZoom: number;
  tileLayerSize: TileLayerSize;
  tileLayerOriginOffset: TileOriginOffset;
  mapCenter: MapCenter;
}
