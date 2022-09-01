export type keyEventInputType = "UP"|"DOWN"|"SELECT"|"CALL"|"RECORD"

const keyOptions = {
    "UP":"w",
    "DOWN": "s",
    "SELECT": "d",
    "CALL":"Enter",
    "RECORD":"k"
}

export function getKeyEventValue(value:keyEventInputType){
    return keyOptions[value]

}
export function delay(time:number){
    return new Promise((resolve)=>{setTimeout(resolve,time)})
}

export function startRecordAudio(){
    console.log("audio record start");
}
export function endRecordAudio(){
    console.log("audio record end");
}