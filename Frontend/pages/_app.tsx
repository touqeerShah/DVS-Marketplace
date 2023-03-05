import '@/styles/globals.css'
import type { ReactElement, ReactNode } from 'react'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import { Provider } from "react-redux"
import { store } from "../redux/store"
import { SUBGRAPH_URL } from "./../lib/config";

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
} from "@apollo/client";
export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}
type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}
export default function App({ Component, pageProps }: AppProps) {
  const getLayout = Component.getLayout ?? ((page: any) => page)
  /**
   * Applo Client is used to connet with subgaph and execut the queries
   */
  const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: SUBGRAPH_URL,
  });
  return (<>
    <ApolloProvider client={client}>

      <Provider store={store}>

        {getLayout(<Component {...pageProps} />)}
      </Provider>
    </ApolloProvider >
  </>

  )

}
