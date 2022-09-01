import { delay } from "../utils";

export type MenuItemType={
    id:number,
    name:String
}

export type CallRequestType={
    type:number,
    visit_reason:String
}



class NetworkError extends Error{
    constructor(msg: string) {
        super(msg);

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, NetworkError.prototype);
    }

}

export async function createMenu(param:MenuItemType){
    let response = await fetch("127.0.0.1:8000/doorbell/category",{
        mode: 'no-cors',
        method:"POST",
        body:JSON.stringify(param)
    })
    if (!response.ok){
        throw new NetworkError("메뉴 생성중 네트워크 에러가 발생하였습니다.");
    }
}

export async function getMenuList():Promise<MenuItemType[]>
{
    console.log("getMenuList")
    let response = await fetch("http://127.0.0.1:8000/doorbell/category",{
        method:"GET",

    })
    let resVal = await response.json();
    
    console.log("resVal:",resVal)
    let result = resVal.map((item:any)=>{return {id:item.id,name:item.type}})
    console.log("result",result)
    return result
    

}
export async function createCallRequest(param:CallRequestType){
    console.log("createCallRequestParam:",param)
    let response = await fetch("http://127.0.0.1:8000/doorbell/visit/",{
        method:"POST",  
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
        },
        body:JSON.stringify(param)
    })
    if (!response.ok){
        throw new NetworkError("메뉴 생성중 네트워크 에러가 발생하였습니다.");
    }
}


