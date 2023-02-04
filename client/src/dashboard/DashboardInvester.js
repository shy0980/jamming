import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAsync, useAsyncFn } from "../hooks/useAsync"
import { GetInvestersTopic } from "../services/comment"
import { getInvesters, getPostTopic } from "../services/posts"
import { Link } from "react-router-dom"
export function DashboardInv() {
    const navigate = useNavigate()
    const userID = localStorage.getItem("user_id") 
    const investerID = localStorage.getItem("invester_id")
    const startupID = localStorage.getItem("startup_id")
    if(investerID===null) {
        if(investerID===null){
            const goToHome = () => navigate(`/Login`)
            goToHome()
        }
    }
    
    const [topic, setTopic] = useState(null)

    const GetInvesterTopicFn = useAsyncFn(GetInvestersTopic)

    const temp = GetInvesterTopicFn
        .execute({id: investerID})
        .then(invester=>{
            setTopic(invester.intrest)
        })

    const {loading, error, value : posts} = useAsync(()=> getPostTopic(topic)
    ,[topic])
    if(loading) return <h1>loading</h1>
    if(error) return <h1 className="msg-error">{error}</h1>
    
    return posts.map(post => {
        return (
            <h1 key={post.id}>
                <Link to={`/posts/${post.id}`}>{post.title}</Link>
            </h1>
        )
    })
}