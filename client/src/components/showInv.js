import { useAsync } from "../hooks/useAsync";
import { getInvesters } from "../services/posts";

export function SingleInvester() {
    const inv_id = "";
    const {loading, error, value: invester}=useAsync(()=>getInvesters(inv_id),[inv_id])
    if(loading) return <h1>loading</h1>
    if(error) return <h1 className="msg-error">{error}</h1>

    console.log(invester)
    // this map only constains one elements so directly possible but anyways by messup
    return invester.map(inv=>{
        return  <>
            <h1>{inv.name}</h1>
            <h1>{inv.intrest}</h1>
        </>
    })

}