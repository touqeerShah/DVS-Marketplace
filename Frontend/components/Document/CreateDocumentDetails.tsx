import React from "react";
import { faFingerprint, faFile, faPlusCircle, faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AddParameter from "../TextField/AddSingner"
import { TypeDocumentSignerFields } from "../../class/document"

// components

export default function CreateDocumentDetails(props: any) {
  console.log("props =>", props);

  const myRef: React.LegacyRef<HTMLInputElement> = React.createRef();
  return (
    <>
      <div className="relative border-2 flex flex-col min-w-0 break-words w-full mt-6 shadow-lg rounded-lg bg-blueGray-100 border-0">

        <><div className="rounded-t bg-white mb-0 px-6 py-6">
          <div className="text-center flex justify-between">
            <h6 className="text-blueGray-700 text-xl font-bold">Create Document</h6>

          </div>
        </div>
          <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
            <form>
              <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
                Dcoument Details
              </h6>
              <div className="flex flex-wrap">
                <div className="w-full lg:w-6/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Document Id
                    </label>
                    <input
                      type="text"
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      defaultValue=""
                      onChange={(e: React.FormEvent<HTMLInputElement>) => {
                        props.setUsername(e.currentTarget.value)
                      }}
                    />
                  </div>
                </div>
                <div className="w-full lg:w-6/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Document Name
                    </label>
                    <input
                      type="email"
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      defaultValue=""
                      onChange={(e: React.FormEvent<HTMLInputElement>) => {
                        props.setEmail(e.currentTarget.value)
                      }}
                    />
                  </div>
                </div>
                <div className="w-full lg:w-full px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Purpose
                    </label>

                    <textarea className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      id="w3review" name="w3review" rows={4} cols={50}></textarea>
                  </div>
                </div>
                <hr className="mt-6 border-b-1 border-blueGray-300" />
                {props.documentSignerFieldsState && <> <h6 className="text-blueGray-400 w-4/5	 text-sm mt-3 mb-6 font-bold uppercase">
                  Parameter
                </h6>
                  <div className="w-1/5	 py-2.5">
                    <div className="relative  center ">
                      <button className="border-0 py-2.5  my-4 placeholder-blueGray-300 text-blueGray-600 bg-white rounded border-2 text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        type="button"

                        onClick={() => props.addParameterFields()}>
                        <FontAwesomeIcon icon={faPlusCircle} />{" "}
                      </button>
                    </div>
                  </div></>
                }      {props.documentSignerFieldsState && props.documentSignerFieldsState.map((fields: TypeDocumentSignerFields, index: number) => (

                  <AddParameter key={index} documentSignerFieldsState={props.documentSignerFieldsState}
                    setDocumentSignerFieldsState={props.setDocumentSignerFieldsState} id={fields.id} />))}

                <div className="w-full lg:w-9/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Card Image Both Side
                    </label>
                    <input
                      type="text"
                      ref={myRef}
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      defaultValue=""
                      readOnly
                    />
                    <input
                      type="file"
                      ref={myRef}
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      defaultValue=""
                      style={{ display: "none" }}

                      readOnly
                    />
                  </div>
                </div>
                <div className="w-full lg:w-3/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                    </label>

                    <button className="border-0 px-3 px-2-5 my-4 placeholder-blueGray-300 text-blueGray-600 bg-white rounded border-2 text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => {
                        myRef.current?.click()
                        console.log(myRef.current?.files);
                      }}>

                      <FontAwesomeIcon icon={faUpload} />{" "}
                    </button>
                  </div>
                </div>

              </div>

              <hr className="mt-6 border-b-1 border-blueGray-300" />


              <div className="flex items-center justify-center flex-wrap">
                <div className="w-3/12  lg:w-12/12 px-4">
                  <div className="relative  center mb-3">
                    <button className="border-0 px-3 px-2-5 my-4 placeholder-blueGray-300 text-blueGray-600 bg-white rounded border-2 text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      type="button">
                      Create Document
                    </button>
                  </div>
                </div>
              </div>

            </form>

          </div></>

      </div>
    </>
  );
}
