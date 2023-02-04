import { useLocation } from "react-router-dom"

export function Loginnav(){
    const CurrRoute = useLocation();
    return <>
    <ul class="nav">
            <li><a href={CurrRoute.pathname==="/login" ? "/" : "/login"}>Login/Back</a></li>
            <li><a href={CurrRoute.pathname==="/signup" ? "/" : "/signup"}>SignUp/Back</a></li>
            <li><a href="/">About Us</a></li>
            <li><a href="/">Services</a></li>
            <li><a href="/">Products</a></li>
            <li><a href="/">Contact</a></li>
    </ul>
    </>
}