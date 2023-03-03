import React from "react";
import { useState, useEffect } from 'react'

// components

import CreateDocumentDetails from "../../components/Document/CreateDocumentDetails";
import { TypeDocumentSignerFields } from "./../../class/document"

// layout for page

import Admin from "../../layouts/Admin";

export default function VerifyId() {
  let [documentSignerFieldsState, setDocumentSignerFieldsState] = useState<TypeDocumentSignerFields[]>([]);
  let [documentSignerDivCountState, setDocumentSignerDivCountState] = useState(0);

  let [username, setUsername] = useState("");
  let [email, setEmail] = useState("")
  let [fingerPrintHash, setFingerPrintHash] = useState("")
  let [firstName, setFirstName] = useState("")
  let [lastName, setLastName] = useState("")
  let [address, setAddress] = useState("")
  let [country, setCountry] = useState("")
  let [city, setCity] = useState("")

  let [postalCode, setPostalCode] = useState("")
  let [aboutMe, setAboutMe] = useState("")
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
          />
        </div>
        <div className="w-full lg:w-4/12 px-4">

        </div>
      </div>
    </>
  );
}

// Settings.layout = Admin;
VerifyId.getLayout = function getLayout(page: any) {
  return (
    <Admin>{page}</Admin>
  )
}