import { useState,useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAsyncFn } from "../hooks/useAsync"
import { LoginVerificationStartup } from "../services/comment"


export function LoginStartup() {
    const navigate = useNavigate()
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const LoginVerificationFn = useAsyncFn(LoginVerificationStartup)

    const [userID, setUserID] = useState(null)
      useEffect(()=>{
        if(userID!==null){
            localStorage.setItem("startup_id",userID)
            localStorage.setItem("type", "normal")
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
            <h2>Login to your ST account</h2>
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