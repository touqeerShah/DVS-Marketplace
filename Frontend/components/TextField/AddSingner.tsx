import React from "react";
import { faRemove, faFile, faIdCard, faBell } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TypeDocumentSignerFields } from "./../../class/document"


// components

export default function AddParameter(props: any) {
    let handleChange = (event: React.FormEvent<HTMLInputElement>, id: number) => {
        // props.setState((prevState: any) => {
        //     let newArrOfDivs = prevState.arrayOfDivs;
        //     newArrOfDivs.find((item: typedocumentSignerFieldsState) => item.id === id)[event.currentTarget.name] =
        //         event.currentTarget.value;
        //     return { arrayOfDivs: newArrOfDivs };
        // });


        let newArrOfDivs = props.documentSignerFieldsState.find((item: TypeDocumentSignerFields) => item.id === id)[event.currentTarget.name] =
            event.currentTarget.value;

        // console.log("newArrOfDivs", props.documentSignerFieldsState);
        props.setDocumentSignerFieldsState(props.documentSignerFieldsState)


    };

    let removeElement = (e: React.FormEvent<HTMLButtonElement>, id: number) => {
        console.log("id", id);

        let newArr = props.documentSignerFieldsState.filter((item: TypeDocumentSignerFields) => item.id !== id)
        console.log("newArr", newArr);
        props.setDocumentSignerFieldsState(newArr)
        // props.setDocumentSignerFieldsState((prevState: any) => {
        //     let newArr = prevState.filter((item: typedocumentSignerFieldsState) => item.id !== id);
        //     return { arrayOfDivs: newArr };
        // });
    };

    const myRef: React.LegacyRef<HTMLInputElement> = React.createRef();
    const isApply = false
    return (
        <div key={props.id} className="relative w-full flex flex-wrap">
            <div className="w-2/5 px-4">
                <div className="relative w-full mb-3">
                    <label
                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                        htmlFor="grid-password"
                    >
                        Code Oracle
                    </label>
                    <input
                        type="text"
                        key={props.id}
                        name={"codeOracle"}
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        defaultValue=""
                        onChange={(e: React.FormEvent<HTMLInputElement>) => {
                            handleChange(e, props.id)
                        }}
                    />
                </div>
            </div>

            <div className="w-1/5 py-2.5">
                <div className="relative  center ">
                    <button className="border-0 py-2.5  my-4 placeholder-blueGray-300 text-blueGray-600 bg-white rounded border-2 text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        type="button"
                        onClick={(e: React.FormEvent<HTMLButtonElement>) => { removeElement(e, props.id) }}>
                        <FontAwesomeIcon icon={faRemove} />{" "}
                    </button>
                </div>
            </div>
        </div>
    );
}
