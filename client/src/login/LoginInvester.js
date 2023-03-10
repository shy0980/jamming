import { useState,useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAsyncFn } from "../hooks/useAsync"
import { LoginVerificationInvester } from "../services/comment"
import { useCookies } from 'react-cookie';


export function LoginInvester() {
    const navigate = useNavigate()
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [cookies, setCookie] = useCookies(['user']);

    const LoginVerificationInvesterFn = useAsyncFn(LoginVerificationInvester)

    const [userID, setUserID] = useState(null)
      useEffect(()=>{
        if(userID!==null){
            setCookie('Inv_id', userID, { path: '/' });
            const goToHome = () => navigate(`/${userID}/maininvester`)
            goToHome()
        }
      },[userID])

    const HandleLogin=()=> {
        const details = LoginVerificationInvesterFn
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
            <h2>Login to your Invester account</h2>
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