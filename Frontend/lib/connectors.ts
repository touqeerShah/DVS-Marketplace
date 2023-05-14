import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { WalletLinkConnector } from "@web3-react/walletlink-connector";
import { TrezorConnector } from "@web3-react/trezor-connector";

import {
  ConnectorNames,
  testNetworkChainId,
  testNetworkRPC,
} from "./config";

const POLLING_INTERVAL = 12000;

const RPC_URLS: { [chainId: number]: string } = {
  [testNetworkChainId.goerli]: testNetworkRPC.goerli,

  [testNetworkChainId.binance]: testNetworkRPC.binance,
  [testNetworkChainId.polygon]: testNetworkRPC.polygon,
  [testNetworkChainId.rinkeby]: testNetworkRPC.rinkeby
};

export const Metamask = new InjectedConnector({
  supportedChainIds: [
    testNetworkChainId.goerli,
    testNetworkChainId.binance,
    testNetworkChainId.polygon,
    testNetworkChainId.rinkeby,
    testNetworkChainId.sepolia

  ]
});

const WalletConnect = new WalletConnectConnector({
  rpc: RPC_URLS,
  supportedChainIds: [
    testNetworkChainId.goerli,
    testNetworkChainId.sepolia,

    testNetworkChainId.binance,
    testNetworkChainId.polygon,
    testNetworkChainId.rinkeby
  ],
  bridge: "https://bridge.walletconnect.org",
  qrcode: true
});

const walletLink = new WalletLinkConnector({
  url: RPC_URLS[0],
  appName: "web3-react example",
  supportedChainIds: [
    testNetworkChainId.goerli,
    testNetworkChainId.binance,
    testNetworkChainId.polygon,
    testNetworkChainId.rinkeby
  ]
});

const trezor = new TrezorConnector({
  chainId: testNetworkChainId.binance,
  url: testNetworkRPC.binance,
  pollingInterval: POLLING_INTERVAL,
  manifestEmail: "dummy@abc.xyz",
  manifestAppUrl: "http://localhost:1234"
});

export const connectorsByName: Array<Object> = [
  {
    name: ConnectorNames.Metamask,
    image: "metamask.png",
    connector: Metamask
  },
  {
    name: ConnectorNames.WalletConnect,
    image: "walletconnect.svg",
    connector: WalletConnect
  }
];
