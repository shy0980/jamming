import { useState } from "react"
import { Link } from "react-router-dom"
import { useAsyncFn } from "../hooks/useAsync"
import { PostRegister } from "../services/comment"


export function RegisterPost() {
    const [title, setTitle] = useState("")
    const [body, setBody] = useState("")
    const [topic, setTopic] = useState("")
    const [year, setYear] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const PostRegisterFn = useAsyncFn(PostRegister)

    const HandleSignUp=()=> {
        const details = PostRegisterFn
                .execute({title: title, body: body, topic: topic, year: year, email: email, password: password})
                .then(temp=>{
                    console.log(temp)
                    if(temp === null) {
                      window.alert("Post not registered")
                    } else {
                        window.alert("You are registered kindly login")
                    }
                })

    }

    return <>
    <div>
        <h2>Register your post</h2>
        <form>
            <input title="title" placeholder="title"
            value={title}
            onChange={(e=> setTitle(e.target.value))}
            />
            <input title="body" placeholder="Body"
            value={body}
            onChange={(e=> setBody(e.target.value))}
            />
            <input title="topic" placeholder="Topic"
            value={topic}
            onChange={(e=> setTopic(e.target.value))}
            />
            <input title="year" placeholder="year"
            value={year}
            onChange={(e=> setYear(e.target.value))}
            />
            <input title="email" placeholder="email"
            value={email}
            onChange={(e=> setEmail(e.target.value))}
            />
            <input title="password" placeholder="password"
            value={password}
            onChange={(e=> setPassword(e.target.value))}
            />
            <button type="button" onClick={HandleSignUp}>RegisterPost</button>
        </form>
    </div>   
    </>
}