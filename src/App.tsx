import * as React from 'react';
import {
  ChakraProvider,
  Box,
  VStack,
  Grid,
  theme,
  Container,
} from '@chakra-ui/react';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import { Logo } from './Logo';
import { BookList } from './dashboard';

export const App: React.FC = () => (
  <ChakraProvider theme={theme}>
    <Box width="100%" height="100vh">
      <Container>
        <Grid minH="100vh">
          <ColorModeSwitcher justifySelf="flex-end" />
          <VStack>
            <Logo h="10vmin" pointerEvents="none" />
          </VStack>
          <BookList />
        </Grid>
      </Container>
    </Box>
  </ChakraProvider>
);
