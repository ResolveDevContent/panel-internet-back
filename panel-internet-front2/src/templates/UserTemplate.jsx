export const UserTemplate = ({user}) => { 
    return(
        <li>
            <input type="hidden" id="user" name="user" value={JSON.stringify(user)}/>
        </li>
    ) 
}