import React from "react";
import { faRemove, faFile, faEye, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TypeDocumentSignerFields } from "../../class/document"

import ViewDocumentDetails from "./ViewDocumentDetails"
// components

export default function AddRow({
    documentId,
    Name,
    creatorAddress,
    creactionTime, color
}: any) {
    const [showModal, setShowModal] = React.useState(false);
    return (<>
        <tr>

            <td className="border-t-0 ml-3 font-bold px-6 align-middle border-l-0 border-r-0 text-sm  whitespace-nowrap p-4">
                $2,500 USD
            </td>
            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm  whitespace-nowrap p-4">
                $2,500 USD
            </td>
            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm  whitespace-nowrap p-4">
                <i className="fas fa-circle text-orange-500 mr-2"></i> pending
            </td>
            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm  whitespace-nowrap p-4">
                <div className="flex">
                    11:20 PM
                </div>
            </td>
            <td className="border-t-0  align-middle border-l-0 border-r-0 text-sm  whitespace-nowrap p-4">
                <div className="flex items-center">
                    <span className="mr-2">{""}</span>
                    <div className="relative w-full">
                        <button className="py-2.5  my-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded border-2 text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            type="button"

                            onClick={() => { setShowModal(true) }}>
                            <FontAwesomeIcon icon={faEye} /> &nbsp;&nbsp;{"View Details"}
                        </button>
                    </div>
                </div>
            </td>

        </tr>
        <ViewDocumentDetails showModal={showModal} setShowModal={setShowModal} color={"light"} /></>
    );
}
AddRow.defaultProps = {
    documentId: "",
    Name: "",
    creatorAddress: "",
    creactionTime: "", color: "light"
};