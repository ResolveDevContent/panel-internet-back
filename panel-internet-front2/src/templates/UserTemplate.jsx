import { useEffect } from "react"

export const UserTemplate = ({user = {}}) => { 

    useEffect(() => {
        console.log(user)
    }, [user])

    return (
        <li>
            <input type="hidden" id="user" name="user" value={JSON.stringify(user)}/>
        </li>
    )
}