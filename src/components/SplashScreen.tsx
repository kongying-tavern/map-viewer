import { Box, Flex, Skeleton } from "@chakra-ui/react";

export const SplashScreen = () => {
  return (
    <>
      <Flex bg="green">
        <Box flex="1" bg="blue" h="100vh">
          <Skeleton height="100%" />
        </Box>
      </Flex>
    </>
  );
};
