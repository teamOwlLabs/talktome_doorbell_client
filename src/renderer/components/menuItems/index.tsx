type MenuItemProps = {
    innerText:String,
    isSelected:Boolean,
    id:number
}
export const MenuItem = (props:MenuItemProps)=>{
    return (
        <div key={props.id} style={props.isSelected?{"backgroundColor":"lightgray","fontSize":"1.4em",maxHeight:"2em",flex:1}:{"fontSize":"1.4em",maxHeight:"2em",flex:1,alignItems:"center"}}>{props.innerText}</div>
    )
}