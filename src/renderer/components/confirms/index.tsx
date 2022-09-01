import { useEffect, useRef } from "react";
import { getKeyEventValue } from "../../utils";

type ConfirmProps={
    label:String,

}
const Confirm = (props:ConfirmProps)=>{
    
    return(
        <span >
            {props.label} 

            <span style={{
                "backgroundColor": "lightgray",padding:"0.5em"
            }}
                >
            확인
            </span>
        </span>
    )
}

export {Confirm}