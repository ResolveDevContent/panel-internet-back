import { useEffect, useState } from "react"
import { PerfilAuth } from '../services/auth'


export const UserTemplate = () => { 
    const [userObj, setUserObj] = useState({});
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)

        const controller = new AbortController();
        const signal = controller.signal;

        PerfilAuth(signal).then((result) => {
            setUserObj(result.message)
        }).finally((res) => {
            setLoading(false)
        })

        return () => controller.abort();
    }, [])

    return loading ? null : (
        <li>
            <input type="hidden" id="user" name="user" value={JSON.stringify(userObj)}/>
        </li>
    )
}