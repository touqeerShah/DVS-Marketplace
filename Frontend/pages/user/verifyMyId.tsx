import React from "react";
import { useState } from 'react'

// components

import CardVerifyMyId from "../../components/Cards/CardVerifyMyId";
import CardVerifyProfile from "../../components/Cards/CardVerifyProfile";

// layout for page

import Admin from "../../layouts/Admin";

export default function VerifyId() {
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


  return (
    <>
      <div className="flex flex-wrap">
        <div className="w-full lg:w-8/12 px-4">
          <CardVerifyMyId setUsername={setUsername}
            setEmail={setEmail}
            setFingerPrintHash={setFingerPrintHash}
            setFirstName={setFirstName}
            setLastName={setLastName}
            setAddress={setAddress}
            setCity={setCity}
            setCountry={setCountry}
            setPostalCode={setPostalCode}
            setAboutMe={setAboutMe}
            username={username}
            email={email}
            fingerPrintHash={fingerPrintHash}
            firstName={firstName}
            lastName={lastName}
            address={address}
            city={city}
            country={country}
            postalCode={postalCode}
            aboutMe={aboutMe} />
        </div>
        <div className="w-full lg:w-4/12 px-4">
          <CardVerifyProfile
            username={username}
            email={email}
            fingerPrintHash={fingerPrintHash}
            firstName={firstName}
            lastName={lastName}
            address={address}
            city={city}
            country={country}
            postalCode={postalCode}
            aboutMe={aboutMe}
          />
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