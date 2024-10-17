export const UserTemplate = ({user}) => { 
    return user && user.role ? (
        <li>
            <input type="hidden" id="user" name="user" value={JSON.stringify(user)}/>
        </li>
    ) : null
}