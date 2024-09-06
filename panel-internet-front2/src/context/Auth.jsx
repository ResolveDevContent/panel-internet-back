import { createContext } from "react";

const AuthContext = createContext({
    auth: false,
    setAuth: () => { }
});

export default AuthContext;