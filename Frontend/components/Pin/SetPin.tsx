import React, { useState, useEffect } from "react";
import PinInput from 'react-pin-input';



export default function SetPin({ showModal, color, setShowModal, buttonLable, setPin, pin, setCheckPin }: any) {






  return (
    <>

      {showModal ? (
        <>
          <div
            className="justify-center items-center flex w-full overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
          >
            <div className="relative w-full my-6 mx-auto max-w-xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-3xl font-semibold">
                    {buttonLable}
                  </h3>

                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                <div className="flex items-start justify-between p-2 border-b border-solid border-slate-200 rounded-t">
                  <h6 className="">
                    Pin Code help you to do Transaction on Private Chain
                  </h6>
                </div>
                {/*body*/}
                <div
                  className={
                    "flex items-center justify-center flex-col min-w-0 break-words w-full mb-6  rounded " +
                    (color === "light" ? "bg-white" : "bg-blueGray-700 text-white")
                  }
                >

                  <div className=" block w-full relative  center overflow-x-auto">
                    {/* Projects table */}
                    <PinInput
                      length={6}
                      initialValue=""
                      secret
                      secretDelay={100}
                      onChange={(value, index) => {
                        // console.log(value);
                        setPin(value)
                      }}
                      type="numeric"
                      inputMode="number"
                      style={{ padding: '10px' }}
                      inputStyle={{ borderColor: 'red', borderRadius: '10px', marginLeft: "35px" }}
                      inputFocusStyle={{ borderColor: 'blue' }}
                      onComplete={(value, index) => { }}
                      autoSelect={true}
                      regexCriteria={/^[ A-Za-z0-9_@./#&+-]*$/}
                    />
                  </div>
                </div>
                {/*footer*/}
                <div className="flex  items-center justify-center p-6 border-t border-solid border-slate-200 rounded-b">

                  <button
                    className="py-2.5  my-2 placeholder-blueGray-300 mx-4  text-blueGray-600 bg-white rounded border-2 text-sm shadow focus:outline-none focus:ring w-1/6 ease-linear transition-all duration-150"
                    type="button"
                    disabled={!(pin.length == 6)}
                    onClick={() => {
                      // console.log("ss", !(pin.length != 6));
                      setShowModal(false)
                      setCheckPin(true)
                    }}
                  >
                    {/* {spinnerProcess && <FontAwesomeIcon icon={faSpinner} className="animate-spin" />} */}

                    &nbsp;&nbsp; {buttonLable}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="fixed inset-0 z-40 bg-blueGray-2-00"></div>
        </>
      ) : null
      }
    </>
  );
}
