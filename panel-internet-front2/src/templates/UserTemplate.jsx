import { useEffect } from "react"

export const UserTemplate = ({user = {}}) => { 

    useEffect(() => {
        if(user && user.role) {
            console.log(user)
        }

    }, [user])

    return (
        <li>
            <input type="hidden" id="user" name="user" value={JSON.stringify(user)}/>
        </li>
    )
}