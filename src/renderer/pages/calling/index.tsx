import { useEffect } from "react"
import { MenuTitle } from "../../components/menus";
import completeAudioSrc from "../../assets/complete.mp3"

const TIMEOUT_VALUE = 5000;
type CallingStatusPageProps = {
    onTimeOut:Function
}
export const CallingStatusPage = (props:CallingStatusPageProps)=>{
    useEffect(()=>{
        const audio = new Audio(completeAudioSrc)
        audio.play()
        setTimeout(()=>{props.onTimeOut()},TIMEOUT_VALUE)
    },[])
    return (
        <div style={{padding:"2em",display:"flex",flex:1,flexDirection:"column",height:"calc( 100vh - 4em )"}}>
            <MenuTitle text="| 호출완료" />
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",flex:1}}>호출이 완료되었습니다.</div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"center"}}>잠시만 기다려주세요.</div>
        </div>
    )
}