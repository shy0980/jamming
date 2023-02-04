import { useState } from "react";
import { LoginInvester } from "./LoginInvester";
import { LoginStartup } from "./LoginStartup";
import { LoginUser } from "./LoginUser";

export function Signup() {
    const [currState, setCurrState]=useState(1);

    return  <>
        {currState===1 && <LoginUser/>}
        {currState===2 && <LoginStartup/>}
        {currState===3 && <LoginInvester/>}
        {currState!==1 && <button type="button" onClick={()=>setCurrState(1)}>User SignUp</button>}
        {currState!==2 && <button type="button" onClick={()=>setCurrState(2)}>Startup SignUp</button>}
        {currState!==3 && <button type="button" onClick={()=>setCurrState(3)}>Invester SignUp</button>}
    </>
}