import { useState } from "react";

export default function useInput(){
    const [value,setValue] = useState<File | null | string>("")
    const [error,setError] = useState("")

    const onChange = (e:any)=>{
        if(e.target.files && e.target.files[0]){
            setValue(e.target.files[0])
            setError("")
        }
    }
    
    return {value,setValue,error,setError,onChange}
}