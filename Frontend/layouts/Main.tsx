// import './globals.css'

import React from "react";

// components

import IndexNavbar from "../components/Navbars/IndexNavbar";
import Footer from "../components/Footers/Footer";
export default function Admin({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <IndexNavbar fixed />

      {children}
      <Footer />
    </>
  );
}
