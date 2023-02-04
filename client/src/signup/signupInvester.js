import { useState } from "react"
import { useAsyncFn } from "../hooks/useAsync"
import { SignUpInvester } from "../services/comment"


export function SignupInvester() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")
    const [intrest, setIntrest] = useState("")

    const SignUpInvesterFn = useAsyncFn(SignUpInvester)

    const HandleSignUp=()=> {
        const details = SignUpInvesterFn
                .execute({password: password, email: username, name: name, intrest: intrest})
                .then(temp=>{
                    if(temp === null) {
                      window.alert("Signup not possible")
                    } else {
                        window.alert("Thank you for signing up kindly go to login")
                    }
                })

    }

    return <>
    <div>
        <h2>Sign up your Invester account</h2>
        <form>
            <input title="name" placeholder="Name"
            value={name}
            onChange={(e=> setName(e.target.value))}
            />
            <input title="email" placeholder="E-mail"
            value={username}
            onChange={(e=> setUsername(e.target.value))}
            />
            <input title="pword" placeholder="Password"
            value={password}
            onChange={(e=> setPassword(e.target.value))}
            />
            <input title="intrest" placeholder="Intrest"
            value={intrest}
            onChange={(e=> setIntrest(e.target.value))}
            />
            <button type="button" onClick={HandleSignUp}>SignUp</button>
        </form>
    </div>   
    </>
}