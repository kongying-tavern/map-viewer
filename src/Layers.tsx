import { Button, Flex, Spacer, Stat, StatGroup, StatLabel, StatNumber, useBoolean } from "@chakra-ui/react";
import { OrthographicView, PickingInfo, type OrthographicViewState } from "@deck.gl/core/typed";
import DeckGL from "@deck.gl/react/typed";
import { useCallback, useEffect, useRef, useState } from "react";
import { imageBitmapMontageLayer } from "./layers/BaseBitMapLayers";
import { mapCenterLineLayer, mousePositionLineLayer, worldOriginLineLayer } from "./layers/BaseLineLayers";
import { Orthographic2DImageTileLayer } from "./layers/BaseTileLayers";
import { getTileLayerExtent } from "./layers/utils";

const view = new OrthographicView({
  id: "ortho-view",
  // controller: {
  //   doubleClickZoom: false,
  //   inertia: true,
  // },
});

export const Layers = (props: { mapMetaData: MapMetadata }) => {
  const { mapCenter, tileLayerSize, tileLayerOriginOffset, zoom, minZoom, maxZoom, tileLayerMeta } = props.mapMetaData;
  const [debugLayerState, setDebugLayerState] = useBoolean(false);
  const [worldOriginLineLayerState, setWorldOriginLineLayerState] = useBoolean(false);
  const [mapCenterLineLayerState, setMapCenterLineLayerState] = useBoolean(false);

  const extent = getTileLayerExtent(tileLayerSize, tileLayerOriginOffset);
  const initialViewState: OrthographicViewState = {
    target: [mapCenter.x, mapCenter.y],
    zoom: zoom,
    minZoom: minZoom,
    maxZoom: maxZoom,
  };
  const [object, setObject] = useState<Pick<PickingInfo, "coordinate" | "pixel">>();

  const getTooltip = useCallback(({ coordinate, pixel }: PickingInfo) => {
    if (coordinate || pixel) {
      setObject({ coordinate, pixel });
    }
    return null;
  }, []);

  return (
    <>
      <DeckGL
        views={[view]}
        initialViewState={initialViewState}
        layers={[
          // debugLayerState
          //   ? debugLayerState &&
          //     Orthographic2DImageTileLayer(tileLayerMeta, {
          //       extent: extent,
          //       debugLayer: debugLayerState,
          //     })
          //   : !debugLayerState &&
          //     Orthographic2DImageTileLayer(tileLayerMeta, {
          //       extent: extent,
          //       debugLayer: debugLayerState,
          //     }),
          imageBitmapMontageLayer(tileLayerMeta, extent),
          worldOriginLineLayerState && worldOriginLineLayer(extent),
          mapCenterLineLayerState && mapCenterLineLayer(extent, mapCenter),
          object?.coordinate && mousePositionLineLayer(extent, (object?.coordinate as [number, number]) ?? [0, 0]),
        ]}
        controller={true}
        useDevicePixels={true}
        getTooltip={getTooltip}
      />
      <Flex bg="blue">
        <Flex bg="red" direction="column">
          <Button colorScheme="green" onClick={setDebugLayerState.toggle}>
            {`ShowDebugLayer: ${debugLayerState.toString()}`}
          </Button>
          <Button colorScheme="green" onClick={setWorldOriginLineLayerState.toggle}>
            {`ShowWorldOriginLineLayer: ${worldOriginLineLayerState.toString()}`}
          </Button>
          <Button colorScheme="green" onClick={setMapCenterLineLayerState.toggle}>
            {`ShowMapCenterLineLayer: ${mapCenterLineLayerState.toString()}`}
          </Button>
        </Flex>
        <Spacer />
        <Flex bg="red" flexDirection={"column"}>
          <StatGroup flex={1} minH={"30px"} minW={"200px"}>
            <Stat>
              <StatLabel>X</StatLabel>
              <StatNumber>{object?.coordinate ? object?.coordinate[0].toFixed(2) : null}</StatNumber>
            </Stat>
            <Stat>
              <StatLabel>Y</StatLabel>
              <StatNumber>{object?.coordinate ? object?.coordinate[1].toFixed(2) : null}</StatNumber>
            </Stat>
          </StatGroup>
          <StatGroup flex={1} minH={"30px"}>
            <Stat>
              <StatLabel>X</StatLabel>
              <StatNumber>{object?.pixel ? object?.pixel[0] : null}</StatNumber>
            </Stat>
            <Stat>
              <StatLabel>Y</StatLabel>
              <StatNumber>{object?.pixel ? object?.pixel[1] : null}</StatNumber>
            </Stat>
          </StatGroup>
        </Flex>
      </Flex>
    </>
  );
};
export default Layers;
