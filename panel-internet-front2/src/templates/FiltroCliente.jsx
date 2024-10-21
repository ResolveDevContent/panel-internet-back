import { useState, useEffect, useRef, useMemo } from "react";
import { listar, listarByComercio, listarByAdmin, listarByEmail, listarUno } from "../services/abm";
import { Toast } from "../components/Toast";
import { puntosTotales } from "../services/totales";

export const FiltroCliente = ({data, titulo, values = {}, user = {}}) => {
    const [ opciones, setOpciones ] = useState([])
    const [ otherOpciones, setotherOpciones ] = useState([])
    const [ nombreCliente, setNombreCliente ] = useState(null);
    const [ nombreComercio, setNombreComercio ] = useState(null);
    const [ state, setState ] = useState({text: "", res: ""})
    const [ loading, setLoading] = useState(false)
    const [ dato, setDato ] = useState([])
    const [ otherDato, setOtherDato ] = useState([])
    const [ cliente, setCliente ] = useState(null)

    const originalOpciones = useRef([])
    const originalOtherOpciones = useRef([])

    const { nombre, placeholder, otherNombre, otherPlaceholder } = data

    const handleChange = (e) => {
        setDato(e.target.value)
        setOtherDato([])
    }

    const filteredNombre = useMemo(() => {
        setLoading(true)
        const newArr = nombreCliente != null && nombreCliente.length > 0
            ? originalOtherOpciones.current.filter(row => {
                return row.nombre.toLowerCase().includes(nombreCliente.toLowerCase())
            })
            : []

        setLoading(false)
        setotherOpciones(newArr)
    }, [nombreCliente, otherOpciones])

    const buscarCliente = (id) => {
        console.log("HLOAL")
        if(!id) {
            return;
        }

        listarUno("clientes", id)
        .then(datos => {
            if(!datos || datos.length == 0) {
                setCliente(null)
                return;
            }

            puntosTotales(id)
            .then(total => {
                if (total.error) {
                    throw new Error(total.error); // Maneja el error lanzando una excepción
                }

                if(total.length > 0 && total[0].puntos.length > 0) {
                    datos[0].puntos = total[0].puntos[0].total;
                } else {
                    datos[0].puntos = 0;
                }
                console.log(total)
                setCliente(datos[0])
            })
        })
    }

    useEffect(() => {
        if(dato.length > 0) {
            setLoading(true)
            listarByComercio("clientes", dato)
            .then(datos => {
                if(!datos || datos.length == 0) {
                    originalOtherOpciones.current = [];
                    setotherOpciones([])
                    return;
                }

                if(datos.error) {
                    setState({
                      text: "Ha ocurrido un error, intente nuevamente o comuniquese con nosotros", 
                      res: "danger"
                    })
                }
                
                datos.forEach((row) => {
                    delete row.ID_Comercio;
                })
                
                originalOtherOpciones.current = datos;
                setotherOpciones(datos)
            })
            .catch(err => {
                setState({
                    text: "Ha ocurrido un error, intente nuevamente o comuniquese con nosotros", 
                    res: "secondary"
                })
            })
            .finally(setLoading(false))
        }
        console.log("SPRINEMR USEFEF",cliente)
    }, [dato])
    
    useEffect(() => {
        setLoading(true)

        listarByEmail('comercios', user.email)
        .then(datos => {
            if(!datos || datos.length == 0) {
                originalOtherOpciones.current = [];
                setotherOpciones([])
                return;
            }
            setDato([datos[0].ID_Comercio])
        }).catch(err => {
            setState({
                text: "Ha ocurrido un error, intente nuevamente o comuniquese con nosotros", 
                res: "secondary"
            })
        })
        .finally(setLoading(false))
    }, [])

    return (
        <>
            <li className="list-template"> 
                {user && user.role != "comercio" ? (
                    <> 
                        <label htmlFor={nombre} className="text-capitalize">{placeholder}</label>
                        <div className='buscador-field'>
                            <input type="text" onChange={e => {
                                setNombreComercio(e.target.value)
                            }} placeholder='Nombre comercio...' />
                        </div>
                        {opciones.length > 0 
                            ? <div className="dropdown-list">
                                {loading 
                                    ? <div className="list-loading-container">
                                            <div className="list-loading"></div>
                                        </div>
                                    : <>
                                        <ul>
                                        {opciones.map((row, idx) => (
                                            <li key={idx}>
                                                <label>
                                                <input type='radio' id={row.ID_Comercio} value={row.ID_Comercio} name="listComercio" onChange={handleChange}/>
                                                <span>{row.nombre_comercio}</span>
                                                </label>
                                            </li>
                                            )
                                        )}
                                        </ul>
                                    </>}
                            </div>
                            : null}
                    </> 
                ) : null}
                <input type="hidden" name={nombre} value={JSON.stringify(dato)} required/>
            </li>
            <li className="list-template">
                <label htmlFor={otherNombre} className="text-capitalize">{otherPlaceholder}</label>
                <div className='buscador-field'>
                    <input type="text" onChange={e => {
                        setNombreCliente(e.target.value)
                    }} placeholder='Nombre cliente...' />
                </div>
                {otherOpciones.length > 0 
                    ? 
                    <div className="dropdown-list">
                        {loading 
                            ? <div className="list-loading-container">
                                    <div className="list-loading"></div>
                                </div>
                            : <>
                                <ul>
                                {otherOpciones.map((row, idx) => (
                                    <li key={idx} onClick={()  => buscarCliente(row.ID_Cliente)}>
                                        <label>
                                            <input type='radio' id={row.ID_Cliente} value={row.ID_Cliente} name="listCliente" onChange={e => setOtherDato(e.target.value)}/>
                                            <span>{row.nombre}</span>
                                        </label>
                                    </li>
                                    )
                                )}
                                </ul>
                            </>}
                    </div>
                    : null}
                {cliente != null ? (
                    <div>
                        <strong>Nombre y apellido: {cliente.nombre + " " + cliente.apellido}</strong>
                        <p>Direccion: {cliente.direccion_principal}</p>
                        <p>Email: {cliente.email}</p>
                        <p>Puntos: {!cliente.puntos ? "Sin puntos" : cliente.puntos}</p>
                    </div>
                ) : null}
                <input type="hidden" name={otherNombre} value={JSON.stringify(otherDato)} required/>
                { state.text ? <Toast texto={state.text} res={state.res} /> : null }
            </li>
        </>
    ) 
}