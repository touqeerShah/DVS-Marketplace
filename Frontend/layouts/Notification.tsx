// import './globals.css'

import React from "react";

// components

import IndexNavbar from "../components/Navbars/IndexNavbar";
import Sidebar from "../components/Sidebar/Sidebar";
import HeaderStats from "../components/Headers/HeaderStats";
import Footer from "../components/Footers/Footer";

export default function Notification({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Sidebar />
      <div className="relative md:ml-64 bg-blueGray-100">
        <IndexNavbar />
        {/* Header */}
        <HeaderStats />
        <div className="px-4 md:px-10 mx-auto w-full -m-24">
          {children}
          <Footer />
        </div>
      </div>
    </>
  );
}
