import React from "react";
import Link from "next/link";
import { createPopper } from "@popperjs/core";

const IndexDropdown = () => {
  // dropdown props
  const [dropdownPopoverShow, setDropdownPopoverShow] = React.useState(false);
  const btnDropdownRef: any = React.createRef();
  const popoverDropdownRef: any = React.createRef();
  const openDropdownPopover = () => {
    createPopper(btnDropdownRef.current, popoverDropdownRef.current, {
      placement: "bottom-start",
    });
    setDropdownPopoverShow(true);
  };
  const closeDropdownPopover = () => {
    setDropdownPopoverShow(false);
  };
  return (
    <>
      <a
        className="hover:text-blueGray-500 text-white px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold"
        href="#pablo"
        ref={btnDropdownRef}
        onClick={(e) => {
          e.preventDefault();
          dropdownPopoverShow ? closeDropdownPopover() : openDropdownPopover();
        }}
      >
        Demo Pages
      </a>
      <div
        ref={popoverDropdownRef}
        className={
          (dropdownPopoverShow ? "block " : "hidden ") +
          "bg-blueGray-600 text-base float-left py-2 my-6	 list-none text-left rounded shadow-lg min-w-48 border-2"
        }
      >
        <span
          className={
            "text-sm pt-2 pb-0 px-4 font-bold block w-full whitespace-nowrap bg-transparent text-black"
          }
        >
          Admin Layout
        </span>


        <Link href="/user/dashboard"
          className={
            "text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-white hover:bg-black"
          }>
          Dashboard

        </Link>

        <Link href="/user/settings"
          className={
            "text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-white hover:bg-black"
          }>
          Settings

        </Link>

        <Link href="/user/tables"
          className={
            "text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-white hover:bg-black"
          }>
          Tables

        </Link>

        <Link href="/user/maps"
          className={
            "text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-white hover:bg-black"
          }>
          Maps

        </Link>
        <div className="h-0 mx-4 my-2 border border-solid border-blue-100 " />
        <span
          className={
            "text-sm pt-2 pb-0 px-4 font-bold block w-full whitespace-nowrap bg-transparent text-black "
          }
        >
          Auth Layout
        </span>
        <Link href="/auth/login"
          className={
            "text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-white hover:bg-black"
          }>
          Login

        </Link>

        <Link href="/auth/register"
          className={
            "text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-white hover:bg-black"
          }>
          Register

        </Link>
        <div className="h-0 mx-4 my-2 border border-solid border-blue-100 " />
        <span
          className={
            "text-sm pt-2 pb-0 px-4 font-bold block w-full whitespace-nowrap bg-transparent text-black"
          }
        >
          No Layout
        </span>
        <Link href="/landing"
          className={
            "text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-white hover:bg-black"
          }>
          Landing

        </Link>
        <Link href="/profile"
          className={
            "text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-white hover:bg-black"
          }>
          {/* <a
            href="#pablo"
            className={
              "text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-white"
            }
          > */}
          Profile
          {/* </a> */}
        </Link>
      </div>
    </>
  );
};

export default IndexDropdown;
