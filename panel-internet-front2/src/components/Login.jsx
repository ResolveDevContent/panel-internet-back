import '../assets/css/login.css'
import { useContext, useEffect, useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { LoginAuth } from '../services/auth'
import AuthContext from '../context/Auth'
import { Show, Hidden } from '../assets/icons/icons'

export const Login = () => {
    const [dataLogin, setDataLogin] = useState({})
    const [error, setError] = useState('')
    const [visible, setVisible] = useState(false)

    const password = useRef()
    const navigate = useNavigate()
    const { auth, setAuth } = useContext(AuthContext)

    const handleChange = (e) => {
        const { name, value } = e.target;

        setDataLogin({
            ...dataLogin,
            [name]: value,
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if(Object.values(dataLogin).length <= 1) {
            setError({text: "Complete todos los datos"})
            setTimeout(() => {
                setError('')
            },3000)
            return;
        }

        LoginAuth(dataLogin, setAuth, setError)

        setTimeout(() => {
            setError('')
        },6000)
    }

    const visibilityPassword = (e) => {
        e.preventDefault()
        setVisible(!visible)
    }

    useEffect(() => {
        if(auth) {
            navigate("/")
        }

        if(visible) {
            password.current.type = "text"
        } else {
            password.current.type = "password"
        }

    }, [auth, visible])

    return (
        <>
            <div className="background z-1 position-absolute w-100 top-0"></div>
            <section className="login d-flex flex-column flex-wrap align-center justify-center position-relative z-2">
                <div className='p-4 rounded-2 d-flex flex-column flex-wrap gap-2 align-items-center text-white'>
                    <header className='text-center'>
                        <h2 className='fs-2 fw-bolder'>¡Bienvenido/a!</h2>
                        <strong>Inicia sesion</strong>
                        <div className='btn-logincliente'>
                            <NavLink to="cliente">Iniciar como cliente</NavLink>
                        </div>
                    </header>
                    <form onSubmit={handleSubmit} className='w-100' >
                        <ul className="form d-flex flex-column gap-2 w-100">
                            <li className='d-flex flex-column'>
                                <label htmlFor="user" className='text-uppercase fs-6 px-0 py-2'>Usuario</label>
                                <input type="text" 
                                    name="email" 
                                    id="user" 
                                    onChange={handleChange}
                                    defaultValue={""}
                                    className='p-3 fs-6 rounded-2 border-0 text-white'
                                />
                            </li>
                            <li className='d-flex flex-column'>
                                <label htmlFor="password" className='text-uppercase fs-6 px-0 py-2'>Contraseña</label>
                                <div className='d-flex password-container'>
                                    <input type="password" 
                                        name="password" 
                                        id="password" 
                                        onChange={handleChange}
                                        defaultValue={""}
                                        className='p-3 fs-6 rounded-2 border-0 text-white'
                                        ref={password}
                                    />
                                    <button onClick={visibilityPassword} className='visible-btn'>
                                        {visible ? (
                                            <Hidden />
                                        ) : (
                                            <Show />
                                        )}
                                    </button>
                                </div>
                            </li>
                            <li className='d-flex flex-column align-center mt-3'>
                                <button type='submit' className='p-3 rounded-2 border-0 text-uppercase text-white'>Iniciar sesion</button>
                            </li>
                        </ul>
                    </form>
                    <span className='fs-6 msg-error'>
                        {error.text}
                    </span>
                    <footer>
                        <span className='fs-6 fw-lighter text-white'>Ante cualquier inconveniente, comunic&aacute;te con nosotros</span>
                    </footer>
                </div>
                <footer className='position-absolute bottom-0 p-3 w-100 d-flex justify-center'>
                    <span className='fs-6 text-uppercase'>© Resolve Dev</span>
                </footer>
            </section>
        </>
    )
}