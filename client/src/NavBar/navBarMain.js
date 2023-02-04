import { useState  } from "react"
import { useLocation } from "react-router-dom"
import { Loginnav } from "./login"
import { SignOut } from "./signout";

export function NavBarMain() {  
    const user_id = localStorage.getItem("user_id") 
    const invester_id = localStorage.getItem("invester_id")
    const startup_id = localStorage.getItem("startup_id")
    console.log(user_id+" "+invester_id+" "+startup_id)
    if(user_id!==null || invester_id!==null || startup_id!==null){
        return <SignOut/>
    }
    else{
        return <Loginnav/>
    }
}