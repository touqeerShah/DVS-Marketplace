import React from "react";
import { useState, useEffect } from 'react'

// components
import CreateDocumentDetails from "../../components/Document/CreateDocumentDetails";
import { TypeDocumentSignerFields } from "./../../class/document"

// layout for page

import Admin from "../../layouts/Admin";

export default function CreateDocument() {
  let [documentSignerFieldsState, setDocumentSignerFieldsState] = useState<TypeDocumentSignerFields[]>([]);
  let [documentSignerDivCountState, setDocumentSignerDivCountState] = useState(0);
  let [documentName, setDocumentName] = useState("")
  let [purpose, setPurpose] = useState("")
  let [startDate, setStartDate] = useState("")
  let [endDate, setEndDate] = useState("")
  var buffer = new ArrayBuffer(0);
  let [fileBuffer, setFileBuffer] = useState(buffer);
  let [fileName, setFileName] = useState("");
  let addParameterFields = () => {
    // setParameterDivCountState(parameterDivCountState + 1);

    documentSignerFieldsState?.push({
      userId: "", id: documentSignerDivCountState
    })
    setDocumentSignerFieldsState(documentSignerFieldsState);
    setDocumentSignerDivCountState(documentSignerDivCountState + 1);

  }


  useEffect(() => {
    console.log("out", documentSignerFieldsState.length);

    if (documentSignerFieldsState.length == 0) {
      addParameterFields()
      console.log("in");
    }

  }, [])
  return (
    <>
      <div className="flex flex-wrap">
        <div className="w-full lg:w-8/12 px-4">
          <CreateDocumentDetails
            addParameterFields={addParameterFields}
            documentSignerFieldsState={documentSignerFieldsState}
            setDocumentSignerFieldsState={setDocumentSignerFieldsState}
            id={documentSignerDivCountState}
            setDocumentName={setDocumentName}
            setPurpose={setPurpose}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            setFileBuffer={setFileBuffer}
            setFileName={setFileName}
            documentName={documentName}
            purpose={purpose}
            startDate={startDate}
            endDate={endDate}
            fileBuffer={fileBuffer}
            fileName={fileName}

          />
        </div>
        <div className="w-full lg:w-4/12 px-4">

        </div>
      </div>
    </>
  );
}

// Settings.layout = Admin;
CreateDocument.getLayout = function getLayout(page: any) {
  return (
    <Admin>{page}</Admin>
  )
}