import { Hidden, Show } from "../assets/icons/icons"
import { useState, useEffect, useContext, useRef } from "react"
import { PerfilAuth, CambiarContraseña } from "../services/auth"
import AuthContext from "../context/Auth"

export const ChangePassword = () => {
    const [dataLogin, setDataLogin] = useState({})
    const [error, setError] = useState('')
    const [visible, setVisible] = useState(false)
    const [user, setUser] = useState({})

    const password = useRef()
    const { auth, setAuth } = useContext(AuthContext)

    const handleChange = (e) => {
        const { name, value } = e.target;

        setDataLogin({
            ...dataLogin,
            [name]: value,
        })
    }
    
    const cambiarPass = (e) => {
        e.preventDefault()

        if(Object.values(dataLogin).length <= 1) {
            setError({text: "Complete todos los datos"})
            setTimeout(() => {
                setError('')
            },3000)
            return;
        }

        CambiarContraseña(dataLogin, setAuth, setError)

        setTimeout(() => {
            setError('')
        },6000)
    }

    const visibilityPassword = (e) => {
        e.preventDefault()
        setVisible(!visible)
    }

    useEffect(() => {
        PerfilAuth().then((result) => {
            setUser(result.message)
        }).catch((err) => {
            console.log(err)
        })

        if(visible) {
            password.current.type = "text"
        } else {
            password.current.type = "password"
        }

    }, [auth, visible])

    return (
        <>
            <form onSubmit={cambiarPass} className='w-100' >
                <ul className="form d-flex flex-column gap-2 w-100">
                    <li className='d-flex flex-column'>
                        <label htmlFor="user" className='text-uppercase fs-6 px-0 py-2'>Usuario</label>
                        <input type="text" 
                            name="email" 
                            id="user" 
                            onChange={handleChange}
                            defaultValue={user.email}
                            value={user.email}
                            disabled
                            className='p-3 fs-6 rounded-2 border-0 text-white disabled'
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
                        <button type='submit' className='p-3 rounded-2 border-0 text-uppercase text-white'>Cambiar contraseña</button>
                    </li>
                </ul>
            </form>
            <span className='fs-6 msg-error'>
                {error.text}
            </span>
        </>
    )
}