import React, { useEffect, useLayoutEffect, useState } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import Login from "./pages/Login";
import Pages from "./components/Pages";
import background from "../src/images/animation.gif";
import { Box, Image } from "@chakra-ui/react";
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useLayoutEffect(() => {
    const user = sessionStorage.getItem("user");
    if (user) {
      setIsLoggedIn(true);
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <Box bg="white" h="100vh" w="223vh" overflow="hidden">
        <Image src={background} alt="loader" h="100vh" ml="27%" mt="5dp" />
      </Box>
    );
  }

  return (
    <>
      {!isLoggedIn ? (
        <>
          <ChakraProvider>
            <Login setIsLoggedIn={setIsLoggedIn} />
          </ChakraProvider>
        </>
      ) : (
        <>
          <ChakraProvider>
            <Pages setIsLoggedIn={setIsLoggedIn} />
          </ChakraProvider>
        </>
      )}
    </>
  );
}

export default App;
