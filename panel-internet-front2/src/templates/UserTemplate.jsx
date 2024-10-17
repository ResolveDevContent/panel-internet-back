import { useEffect, useState } from "react"
import { PerfilAuth } from '../services/auth'


export const UserTemplate = ({user = {}}) => { 
    const [userObj, setUserObj] = useState({});
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        console.log(user)
        if(!user) {
            setLoading(true)
            PerfilAuth().then((result) => {
                console.log(result)
                setUserObj(result.message)
            }).finally((res) => {
                setLoading(false)
            })
        }
    }, [user])

    return loading ? null : (
        <li>
            <input type="hidden" id="user" name="user" value={JSON.stringify(user ? user : userObj)}/>
        </li>
    )
}