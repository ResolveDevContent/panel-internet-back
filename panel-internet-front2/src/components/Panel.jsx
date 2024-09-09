import '../assets/css/panel.css'
import { useContext, useEffect } from "react"
import { Sidebar } from "./Sidebar"
import { Outlet, useNavigate } from "react-router-dom"
import AuthContext from "../context/Auth"

export const Panel = ({user}) => {
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate()

    useEffect(() => {
        if(!auth) {
            navigate("/login")
        }
    }, [auth])

    return (
        <main className='d-flex'>
            <Sidebar user={user}/>
            <section id="panel" className="container">
                <Outlet />
            </section>
        </main>
    )
}