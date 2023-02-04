import { useNavigate } from "react-router-dom"
import { useAsync } from "../hooks/useAsync";

export function DashboardUser() {
    const navigate = useNavigate();
    const userID = localStorage.getItem("user_id") 
    const investerID = localStorage.getItem("invester_id")
    const startupID = localStorage.getItem("startup_id")
    if(userID===null){
        const goToHome = () => navigate(`/Login`)
        goToHome()
    }

    const {loading, error, value : posts} = useAsync(()=> PostWithUser(userID)
    ,[userID])
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