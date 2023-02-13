import { useEffect, useState  } from "react";
import { useLocation } from "react-router-dom";
import { Loginnav } from "./login";
import { SignOut } from "./signout";
import { useCookies } from 'react-cookie';

export function NavBarMain() { 
    const [cookies, setCookie] = useCookies(['user']);
    const user_id = cookies.User_id
    const startup_id = cookies.Stp_id
    const invester_id = cookies.Inv_id
    useEffect(()=>{

    },[user_id])
    console.log(user_id+"this in navbar")
    if(user_id!==undefined || invester_id!==undefined || startup_id!==undefined){
        return <SignOut/>
    }
    else{
        return <Loginnav/>
    }
}