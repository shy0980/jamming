import { useState,useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAsyncFn } from "../hooks/useAsync"
import { LoginVerification } from "../services/comment"
import { useCookies } from 'react-cookie';


export function LoginUser() {
    const navigate = useNavigate()
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [cookies, setCookie] = useCookies(['user']);

    const LoginVerificationFn = useAsyncFn(LoginVerification)

    const [userID, setUserID] = useState(null)
      useEffect(()=>{
        if(userID!==null){
            setCookie('User_id', userID, { path: '/' });
            const goToHome = () => navigate(`/${userID}/main`)
            goToHome()
        }
      },[userID])

    const HandleLogin=()=> {
        const details = LoginVerificationFn
                .execute({password: password, email: username})
                .then(temp=>{
                    if(temp === null) {
                      window.alert("enter valid details")
                    } else {

                       setUserID(temp.id)
                    }
                })
    }

    

    return <>
        <div>
            <h2>Login to your USER account</h2>
            <form>
                <input title="uname"
                value={username}
                onChange={(e=> setUsername(e.target.value))}
                />
                <input title="pword"
                value={password}
                onChange={(e=> setPassword(e.target.value))}
                />
                <button type="button" onClick={HandleLogin} >Login</button>
            </form>
        </div> 
    
    </>
}