import React from "react";
import { faRemove, faFile, faEye, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TypeDocumentSignerFields } from "../../class/document"
import { ellipseAddress } from '../../lib/utilities'
import { DocumentEntity } from './../../class/document'

import ViewDocumentDetails from "./ViewDocumentDetails"
// components

export default function AddRow({
    documentId,
    documentName,
    creatorAddress,
    createdAt, color, documentDetails, web3ProviderState
}: any) {
    const [showModal, setShowModal] = React.useState(false);
    return (<>
        <tr>

            <td className="border-t-0 ml-3 font-bold px-6 align-middle border-l-0 border-r-0 text-sm  whitespace-nowrap p-4">
                {ellipseAddress(documentId)}
            </td>
            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm  whitespace-nowrap p-4">
                {documentName}
            </td>
            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm  whitespace-nowrap p-4">
                {ellipseAddress(creatorAddress)}
            </td>
            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm  whitespace-nowrap p-4">
                <div className="flex">
                    {(createdAt)}
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
        <ViewDocumentDetails showModal={showModal} setShowModal={setShowModal} color={"light"} documentDetails={documentDetails as DocumentEntity} web3ProviderState={web3ProviderState} /></>
    );
}
AddRow.defaultProps = {
    documentId: "",
    documentName: "",
    purpose: "",
    createdAt: "",
    documentDetails: {},
    color: "light", web3ProviderState: {}
};