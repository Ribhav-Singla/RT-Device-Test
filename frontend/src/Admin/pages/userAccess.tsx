import { useEffect } from "react"
import { useParams,useNavigate } from "react-router-dom"


export default function(){
    const navigate = useNavigate()
    const {userLoginToken} = useParams()

    useEffect(()=>{
        if(userLoginToken){
            sessionStorage.setItem('userLoginAllowed',"True")
            sessionStorage.setItem('userLoginToken',userLoginToken)
            navigate('/user/availableDevices')
        }
    },[])

    return (
        <>
        <div className="bg-white">
            hello
        </div>
        </>
    )
}