import React from 'react';
import PulseLoader from 'react-spinners/PulseLoader'
import { CSSProperties, JSX } from "react";

interface IPropTypes {
    loaded: boolean
    onlySpinner: boolean
    children?: JSX.Element
}

const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
};

function Loader(props: IPropTypes): JSX.Element {
    if (!props.loaded || props.onlySpinner) {
        return (
            <div className='flex items-center justify-center w-full h-full'>
                <PulseLoader color="#00dfff" cssOverride={override} loading />
            </div>
        )
    } else {
        return (
            <>
                {props.loaded && props.children}
            </>
        )
    }
}

export default Loader