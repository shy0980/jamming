import { useState,useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAsyncFn } from "../hooks/useAsync"
import { LoginVerificationInvester } from "../services/comment"


export function InvesterLogin() {
    const navigate = useNavigate()
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const LoginVerificationInvesterFn = useAsyncFn(LoginVerificationInvester)

    const [userID, setUserID] = useState(null)
      useEffect(()=>{
        if(userID!==null){
            localStorage.setItem("invester_id",userID)
            localStorage.setItem("type", "invester")
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
            <h2>Login to your account</h2>
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