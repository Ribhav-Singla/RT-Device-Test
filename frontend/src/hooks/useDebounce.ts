import { useEffect, useState } from "react";

export default function useDebouce(value:string, delay:number) {
    const [debounceValue, setDebounceValue] = useState('')
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebounceValue(value)
        }, delay)
        return () => {
            clearTimeout(timer)
        }
    }, [value, delay])
    return debounceValue
}