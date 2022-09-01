import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { InitPage } from './pages/init';
import { DetailPurposePage } from './pages/detail-purpose';
import { CallingStatusPage } from './pages/calling';
import { SelectPurposePage } from './pages/select-purpose';
import { MenuItemType } from './services';

type pageStateType = "init"|"select_purpose"|"detail_purpose"|"calling";
function App() {
  const [pageState,setPageState] = useState<pageStateType>("init")
  const [selectedCategoryString,setSelectedCategoryString] = useState<String>("");
  const [selectedCategoryID,setSelectedCategoryID] = useState<number>(0);
  const [detailPurpose,setDetailPurpose] = useState<String>("");
  switch(pageState){
    case "init":
      return (
        <InitPage onPressCall={()=>setPageState("select_purpose")}></InitPage>
      );
    case "select_purpose":
      return (
        <SelectPurposePage onPressSelect={(item:MenuItemType)=>{setSelectedCategoryID(item.id);setSelectedCategoryString(item.name);setPageState("detail_purpose");}}/>
      )
    case "detail_purpose":
      return(
        <DetailPurposePage 
        selectedCategoryID={selectedCategoryID} 
        selectedCategoryString={selectedCategoryString} 
        goCall={(recordResult:String)=>{setDetailPurpose(recordResult);setPageState("calling");}}/>
      )
    case "calling":
      return(
        <CallingStatusPage onTimeOut={()=>setPageState("init")}/>
      )
    default:
      return (
        <div>status not valid</div>
      )

  }
  
}

export default App;
