import { useEffect, useState } from "react";
import { RegisterPost } from "../RegisterPost/RegisterPost";
import { SignupInvester } from "./signupInvester";
import { SignupUser } from "./signupUser";

export function Signup() {
    const [currState, setCurrState]=useState(1);

    return  <>
        {currState===1 && <SignupUser/>}
        {currState===2 && <RegisterPost/>}
        {currState===3 && <SignupInvester/>}
        {currState!==1 && <button type="button" onClick={()=>setCurrState(1)}>User SignUp</button>}
        {currState!==2 && <button type="button" onClick={()=>setCurrState(2)}>Startup SignUp</button>}
        {currState!==3 && <button type="button" onClick={()=>setCurrState(3)}>Invester SignUp</button>}
    </>
}