import { useEffect } from "react"

export const UserTemplate = ({user}) => { 
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if(user && user.role) {
            setLoading(true)
        }

    }, [])

    return loading ? (
        <li>
            <input type="hidden" id="user" name="user" value={JSON.stringify(user)}/>
        </li>
    ) : null
}