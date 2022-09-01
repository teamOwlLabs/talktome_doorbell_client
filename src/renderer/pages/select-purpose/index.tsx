import { useEffect } from "react";
import { Menu, MenuTitle } from "../../components/menus";
import { MenuItemType } from "../../services";
import audioSrc from "./select-purpose.mp3"
type SelectPurposePageProps = {
    onPressSelect:Function
}
export const SelectPurposePage = (props:SelectPurposePageProps)=>{
    useEffect(()=>{
        
        const audio = new Audio(audioSrc)
        audio.play()
    },[])
    return (
        <div style={{height:"100vh",display:"flex"}}>
            <div style={{padding:"2em",flex:1,flexDirection:"column"}}>
                <MenuTitle text={"| 방문 목적을 선택하세요."}/>
                <Menu setSelected={(value: any) => {
                    console.log(value);
                } } 
                onPressUp={()=>{}} 
                onPressDown={()=>{}} 
                onPressSelect={(value: MenuItemType)=>{console.log(value.id,value.name);props.onPressSelect(value)}} 
                />
            </div>
        </div>
    )
}