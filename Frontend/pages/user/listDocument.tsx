import React from "react";

// components

import CardDocumentTable from "../../components/Document/CreateDocumentTable";

// layout for page

import Admin from "../../layouts/Admin";

export default function Tables() {
  return (
    <>
      <div className="flex flex-wrap mt-4 mb-60">
        <div className="w-full mb-12 px-4 mb-80">
          <CardDocumentTable
            pageTitle={"New Document List"} />
        </div>

      </div>
    </>
  );
}

// Tables.layout = Admin;
Tables.getLayout = function getLayout(page: any) {
  return (
    <Admin>{page}</Admin>
  )
}