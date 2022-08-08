import { Box, Flex } from "@chakra-ui/react";
import { lazy, Suspense } from "react";
import useSWR, { Fetcher, Key } from "swr";
import { SplashScreen } from "./components/SplashScreen";
const Layers = lazy(() => import("./Layers"));
const ReloadPrompt = lazy(() => import("./ReloadPrompt"));

const mapMetaDataKey: Key = "/json/TyvetMapMetaData.json";
const imageMetaDataKey: Key = "/json/TyvetImageMetaData.json";
const mapMetadataFetcher: Fetcher<MapMetadata, URL> = (url) => fetch(url).then((res) => res.json());

function App() {
  const { data, error } = useSWR(imageMetaDataKey, mapMetadataFetcher);
  return (
    <Flex bg="red">
      <Box flex="1" bg="tomato" h="100vh">
        <Suspense fallback={<SplashScreen />}>
          {data ? <Layers mapMetaData={data} /> : null}
          <ReloadPrompt />
        </Suspense>
      </Box>
    </Flex>
  );
}

export default App;
