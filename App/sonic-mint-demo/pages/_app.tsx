import 'animate.css';
import '../styles/index.scss';

import type { AppProps } from 'next/app';
import { ChakraProvider, ColorModeScript, extendTheme } from '@chakra-ui/react';
import { PageProvider } from '../context';
import WalletContextProvider from '../components/WalletContextProvider';
import { AppBar } from '../components/AppBar';
import { Dots } from '../components/Dots';

const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: true
  }
});
export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme} toastOptions={{ defaultOptions: { position: 'top' } }}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <PageProvider>
        <WalletContextProvider>
          <script src="/js/three.min.js" />
          <script src="/js/vanta.dots.min.js" />
          <AppBar />
          <div className="AppBody">
            <Dots />
            <Component {...pageProps} />
          </div>
        </WalletContextProvider>
      </PageProvider>
    </ChakraProvider>
  );
}
