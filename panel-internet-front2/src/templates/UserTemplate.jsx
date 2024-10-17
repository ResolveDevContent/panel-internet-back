import { useEffect, useState } from "react"

export const UserTemplate = ({user = {}, values = []}) => { 
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if(user && user.role) {
            setLoading(true)
        }

    }, [values])

    return loading ? (
        <li>
            <input type="hidden" id="user" name="user" value={JSON.stringify(user)}/>
        </li>
    ) : null
}