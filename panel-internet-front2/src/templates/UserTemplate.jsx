import { useEffect } from "react"

export const UserTemplate = ({user = {}, values = []}) => { 

    useEffect(() => {
        if(user && user.role) {
            console.log(user)
            setLoading(true)
        }

    }, [values, user])

    return (
        <li>
            <input type="hidden" id="user" name="user" value={JSON.stringify(user)}/>
        </li>
    )
}