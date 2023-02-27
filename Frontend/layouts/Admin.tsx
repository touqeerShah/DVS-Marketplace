// import './globals.css'

import React from "react";

// components

import Navbar from "../components/Navbars/IndexNavbar";
import Sidebar from "../components/Sidebar/Sidebar";
import HeaderStats from "../components/Headers/HeaderStats";
import FooterAdmin from "../components/Footers/FooterAdmin";

export default function Admin({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Sidebar />
      <div className="relative md:ml-64  bg-themeColor-800">
        <Navbar />
        {/* Header */}
        <HeaderStats />
        <div className="px-4 md:px-10 mx-auto w-full -m-24">
          {children}
          <FooterAdmin />
        </div>
      </div>
    </>
  );
}
