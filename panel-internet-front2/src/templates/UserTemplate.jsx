import { useEffect, useState } from "react"

export const UserTemplate = ({user = {}, values = []}) => { 
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if(user && user.role) {
            console.log(user)
            setLoading(true)
        }

    }, [values])

    return (
        <li>
            <input type="hidden" id="user" name="user" value={JSON.stringify(user)}/>
        </li>
    )
}