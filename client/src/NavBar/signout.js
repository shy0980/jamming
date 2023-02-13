import { useCookies } from 'react-cookie';

export function SignOut() {
    const [cookies, setCookie, removeCookie] = useCookies(['user']);

    return <>
    <li><a href={"/"} onClick={()=>removeCookie('user',{ path: '/' })}>SignOut</a></li>
    </>
}