import React, { useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { getStringToBytes } from "../../lib/convert";

// components

export default function CardVerifyProfile(props: any) {
  // const qrRef = useRef(); // include this: call the useRef function
  const qrRef: React.LegacyRef<HTMLInputElement> = React.createRef();

  const qrcode = (
    <QRCodeCanvas
      id="qrCode"
      value={getStringToBytes(props?.fingerPrintHash)}
      // size={300}
      // bgColor={"#00ff00"}
      level={"H"}
      className="shadow-xl  h-auto align-middle border-none absolute -m-16 -ml-20 lg:-ml-16 max-w-150-px"

    />
  );
  useEffect(() => {
    if (props?.fingerPrintHash) {
      let canvas = qrRef.current?.querySelector("canvas");
      let image = canvas?.toDataURL("image/png");
      // console.log("data:image/svg+xml;base64,", image);
      props.setQRCodeSvg(image)
    }

  }, [props?.fingerPrintHash])

  return (
    <>
      <div className="relative border-2 flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg mt-16">
        <div className="px-6">
          <div className="flex flex-wrap justify-center">
            <div className="w-full px-4 flex justify-center">
              {props?.fingerPrintHash && <div className="relative">
                <div ref={qrRef}>{qrcode}</div> {/* include this */}

              </div>}
              {!props?.qrCodeSvg && <div className="relative">
                <div ref={qrRef}>
                  <>
                    <img alt=""
                      className="shadow-xl  h-auto align-middle border-none absolute -m-16 -ml-20 lg:-ml-16 max-w-150-px"
                      src={props.qrCodeSvg} />
                    {/* {props.qrCodeSvg} */}
                  </></div> {/* include this */}

              </div>}
            </div>
            <div className="w-full px-4 text-center items-center justify-center  mt-20">
              <div className="flex justify-center py-4 lg:pt-4 pt-8">
                <div className="mr-4 p-3 text-center">
                  <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                    {props?.status}
                  </span>
                  <span className="text-sm text-blueGray-400">Status</span>
                </div>
                <div className="mr-4 p-3 text-center">
                  <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                    {props?.tokenId}
                  </span>
                  <span className="text-sm text-blueGray-400">NFT </span>
                </div>
                <div className="lg:mr-4 p-3 text-center">
                  <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                    {props?.noDoc}

                  </span>
                  <span className="text-sm text-blueGray-400">Sign Doc</span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center mt-12">
            <h3 className="text-xl font-semibold leading-normal mb-2 text-blueGray-700 mb-2">
              {props.username}
            </h3>
            <h3 className="text-xl font-semibold leading-normal mb-2 text-blueGray-700 mb-2">
              {props.email}
            </h3>

            <div className="mb-2 text-blueGray-600 mt-10">
              <i className="fas fa-briefcase mr-2 text-lg text-blueGray-400"></i>
              {props.firstName} {props.firstName != "" ? "," : ""} {props.lastName}
            </div>
            <div className="text-sm leading-normal mt-0 mb-2 text-blueGray-400 font-bold uppercase">
              <i className="fas fa-map-marker-alt mr-2 text-lg text-blueGray-400"></i>{" "}
              {props.city} {props.city != "" ? "," : ""} {props.country} {props.country != "" ? "," : ""} {props.postalCode}
            </div>
            <div className="mb-2 text-blueGray-600">
              <i className="fas fa-university mr-2 text-lg text-blueGray-400"></i>
              {props.address}
            </div>
          </div>
          <div className="mt-10 py-10 border-t border-blueGray-200 text-center">
            <div className="flex flex-wrap justify-center">
              <div className="w-full lg:w-9/12 px-4">
                <p className="mb-4 text-lg leading-relaxed text-blueGray-700">
                  {props.aboutMe}
                </p>
                <a
                  href="#pablo"
                  className="font-normal text-lightBlue-500"
                  onClick={(e) => e.preventDefault()}
                >
                  Show more
                </a>
              </div>
            </div>
          </div>
        </div>
      </div >
    </>
  );
}
