import { Link } from "react-router-dom"
import { useAsync } from "../hooks/useAsync"
import { GetAllInvesters } from "../services/posts"

export function DashboardStartup() {
    const navigate = useNavigate()
    const user_id = localStorage.getItem("user_id") 
    const invester_id = localStorage.getItem("invester_id")
    const startup_id = localStorage.getItem("startup_id")
    if(startup_id==null){
        const goToHome = () => navigate(`/Login`)
        goToHome()
    }
    const {loading, error, value:investers} = useAsync(GetAllInvesters)
    if(loading) return <h1>loading</h1>
    if(error) return <h1 className="msg-error">{error}</h1>
    return investers.map(inv=>{
        return <>
            <h1>
                <Link to={`/Invester/${inv.name}`}>{inv.name}</Link>
            </h1>
        </>
    })
}