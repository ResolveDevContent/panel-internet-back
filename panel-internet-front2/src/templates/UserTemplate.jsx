import { useEffect, useState } from "react"
import { PerfilAuth } from '../services/auth'


export const UserTemplate = () => { 
    const [userObj, setUserObj] = useState({});
    const [loading, setLoading] = useState(false)

    useEffect(() => {
            setLoading(true)
            PerfilAuth().then((result) => {
                console.log(result)
                setUserObj(result.message)
            }).finally((res) => {
                setLoading(false)
            })
    }, [])

    return loading ? null : (
        <li>
            <input type="hidden" id="user" name="user" value={JSON.stringify(userObj)}/>
        </li>
    )
}