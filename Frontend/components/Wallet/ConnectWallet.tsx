import React from "react";
import { connectorsByName } from "./../../lib/connectors";

export default function ConnectWallet({
  walletConnect,
  color,
  setWalletConnect,
  handleWalletConnect
}: any) {
  // console.log("ConnectWallet");



  return (
    <>
      {walletConnect ? (
        <>
          <div className="justify-center items-center flex w-full overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-full my-6 mx-auto max-w-xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 pt-10 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-3xl font-semibold">Connect to Wallet</h3>
                  <button
                    className=" ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setWalletConnect(false)}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div
                  className={
                    "flex items-center justify-center flex-col min-w-0 break-words w-full mb-6  rounded " +
                    (color === "light"
                      ? "bg-white"
                      : "bg-blueGray-700 text-white")
                  }
                >
                  {connectorsByName.map((connector: any, key: number) => {
                    const clickCallback = () => handleWalletConnect(connector);
                    return (
                      <div className="flex pt-2 items-center justify-center flex-wrap" key={key}>
                        <div className="w-full  lg:w-12/12 px-4">
                          <div className="relative  center mb-3">
                            {" "}
                            {/* Projects table */}
                            <button
                              className="w-c px-3  bg-white hover:bg-gray-100 rounded border-2  border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 mr-2 mb-2"
                              type="button"
                              onClick={() => clickCallback()}
                            >
                              <img src={connector.image} className="w-6 h-6 mr-2 -ml-1" alt="Flowbite Logo" />


                              {connector.name}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {/*footer*/}
              </div>
            </div>
          </div>
          <div className="fixed inset-0 z-40 bg-blueGray-2-00"></div>
        </>
      ) : null}
    </>
  );
}
