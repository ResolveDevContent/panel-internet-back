import '../assets/css/filtros.css'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Toast } from './Toast'
import { Loading } from '../components/Loading'
import { listar, listarByAdmin, listarByComercio, listarByEmail, listarUno } from '../services/abm'
import { PerfilAuth } from '../services/auth'
import { Filter, Search } from '../assets/icons/icons'
import { Tabla } from './Tabla'
import { comercioTotales } from '../services/totales'

export const Listado = ({titulo}) => {
    const [ state, setState ] = useState({
        text: "",
        res: ""
    })
    const [ listado, setListado ] = useState([])
    const [ sortedListado, setSortedListado ] = useState([])
    const [ loading, setLoading ] = useState(false)
    const [ nombre, setNombre ] = useState(null);
    const [ rubro, setRubro ] = useState(null);
    const [ nombreComercio, setnombreComercio ] = useState(null);
    const [ date, setDate ] = useState({first: "", second: ""});

    const originalListado = useRef([])

    const filteredNombre = useMemo(() => {
        let newArr = [];
        if(titulo != "asociaciones" && titulo != "transacciones") {
            newArr = nombre != null && nombre.length > 0
                ? listado.filter(row => {
                    return row.nombre_completo.toLowerCase().includes(nombre.toLowerCase())
                })
                : listado
        } else {
            newArr = nombre != null && nombre.length > 0
                ? listado.filter(row => {
                    return row.ID_Cliente.toLowerCase().includes(nombre.toLowerCase())
                })
                : listado
        }

        setSortedListado(newArr)
    }, [listado, nombre])

    const filteredComercio = useMemo(() => {
        let newArr = [];
        if(titulo != "asociaciones" && titulo != "transacciones" && titulo != "comercios/pagos") {
            newArr = nombreComercio != null && nombreComercio.length > 0
                ? listado.filter(row => {
                    return row.nombre_comercio.toLowerCase().includes(nombreComercio.toLowerCase())
                })
                : listado
        } else {
            newArr = nombreComercio != null && nombreComercio.length > 0
                ? listado.filter(row => {
                    return row.ID_Comercio.toLowerCase().includes(nombreComercio.toLowerCase())
                })
                : listado
        }

        setSortedListado(newArr)
    }, [nombreComercio])

    const filteredRubro = useMemo(() => {
        const newArr = rubro != null && rubro.length > 0
        ? listado.filter(row => {
            return row.rubro.toLowerCase().includes(rubro.toLowerCase())
        })
        : listado

        setSortedListado(newArr)
    }, [rubro])

    const handleDates = () => {
        if(date.first == '' || date.second == '') {
            setState({
                text: "Complete ambas fechas para poder buscar",
                res: "secondary"
            });
            setTimeout(() => {
                setState({text: "", res: ""})
            }, 4000)
            return
        }

        const newArr = listado.filter(row => {
            const fecha = new Date(row.fecha.split("/").reverse().join("/")).getTime();
            let firstDate = new Date(date.first.replace(/-/g, '\/'));
            firstDate = firstDate.setHours(0,0,0,0);
            let secondDate = new Date(date.second.replace(/-/g, '\/'));
            secondDate = secondDate.setHours(23,59,59,99);

            return Number(fecha) >= firstDate && Number(fecha) <= secondDate;
        })
        setSortedListado(newArr)
    }

    const handleSubmit = e => {
        e.preventDefault()

        const form = e.target;
        form.reset();
    }

    const cleanFilters = () => {
        setSortedListado(originalListado.current)
    }

    async function totales(datos) {
        const actualizaciones = datos.map(async (row, idx) => {
            try {
                const total = await comercioTotales(row.ID_Comercio);
                
                if (total.error) {
                    throw new Error(total.error); // Maneja el error lanzando una excepción
                }

                row.puntos_totales = total[0].puntos_totales;
                return row;
            } catch (error) {
                // Maneja el error aquí
                setState({
                    text: error.message,
                    res: "secondary"
                });
                return null;
            }
        })

        const resultados = await Promise.all(actualizaciones);

        // Filtra los resultados nulos (en caso de errores)
        const datosActualizados = resultados.filter(row => row !== null);

        // Actualiza el estado después de que todos los datos se han procesado
        setLoading(false);
        setListado(datosActualizados);
        originalListado.current = datosActualizados;
    }

    async function formatToNombres(data) {
        let resultados = []
        const actualizaciones = data.map(async (row, idx) => {
            try {
                if(row.ID_Comercio) {
                    const comercio = await listarUno("comercios", row.ID_Comercio);
                    if(comercio.length <= 0) {
                        return null;
                    }

                    row.ID_Comercio = comercio[0].nombre_comercio
                }

                if(row.ID_Cliente) {
                    const cliente = await listarUno("clientes", row.ID_Cliente);
                    if(cliente.length <= 0) {
                        return null;
                    }

                    row.ID_Cliente = cliente[0].nombre_completo
                }

                return row;
            } catch (error) {
                // Maneja el error aquí
                setState({
                    text: error.error,
                    res: "secondary"
                });
                return null;
            }
        })

        resultados = await Promise.all(actualizaciones);
        // Filtra los resultados nulos (en caso de errores)
        const datosActualizados = resultados.filter(row => row !== null);

        // Actualiza el estado después de que todos los datos se han procesado
        setLoading(false);
        setListado(datosActualizados);
        originalListado.current = datosActualizados;
    }

    useEffect(() => {
        setLoading(true)

        // limpiando
        setNombre(null);
        setnombreComercio(null);
        setDate({first: "", second: ""});
        originalListado.current = []

        PerfilAuth().then(user => {
            if(user.message.role == "superadmin" || user.message.role == "cliente") {
                listar(titulo).then(datos => {
                    if(datos.error) {
                        setLoading(false);
                        setState({
                            text: datos.error,
                            res: "secondary"
                        })
                        setTimeout(() => {
                            setState({text: "", res: ""})
                        }, 4000)
                        return;
                    }

                    if(!datos || datos.length == 0) {
                        setLoading(false);
                        setListado([])
                        originalListado.current = [];
                        return;
                    }

                    if(titulo == "comercios") {
                        totales(datos)
                    } else if(titulo == "asociaciones" || titulo == "transacciones" || titulo == "comercios/pagos") {
                        formatToNombres(datos)
                    } else {
                        setLoading(false);
                        setListado(datos)
                        originalListado.current = datos;
                    }


                })
            }

            if (user.message.role == "admin") {
                listarByAdmin(titulo, user.message.email)
                .then(datos => {
                    if(datos.error) {
                        setLoading(false);
                        setState({
                            text: datos.error,
                            res: "secondary"
                        })
                        setTimeout(() => {
                            setState({text: "", res: ""})
                        }, 4000)
                        return;
                    }

                    if(!datos || datos.length == 0) {
                        setLoading(false);
                        setListado([])
                        originalListado.current = [];
                        return;
                    }

                    if(titulo == "comercios") {
                        totales(datos)
                    } else if(titulo == "asociaciones" || titulo == "transacciones" || titulo == "comercios/pagos") {
                        formatToNombres(datos)
                    } else {
                        setLoading(false);
                        setListado(datos)
                        originalListado.current = datos;
                    }
                })
            } 
            if(user.message.role == "comercio" ) {
                listarByEmail("comercios", user.message.email)
                .then((comercio) => {
                    if(comercio.error) {
                        setLoading(false)
                        setState({
                            text: comercio.error,
                            res: "secondary"
                        })
                        setTimeout(() => {
                            setState({text: "", res: ""})
                        }, 4000)
                        return;
                    }
                    comercio = comercio[0]
                    listarByComercio(titulo, comercio.ID_Comercio).then(datos => {
                        if(datos.error) {
                            setLoading(false);
                            setState({
                                text: datos.error,
                                res: "secondary"
                            })
                            setTimeout(() => {
                                setState({text: "", res: ""})
                            }, 4000)
                            return;
                        }

                        if(!datos || datos.length == 0) {
                            setLoading(false);
                            setListado([])
                            originalListado.current = [];
                            return;
                        }

                        if(titulo == "transacciones") {
                            formatToNombres(datos)
                        } else {
                            setLoading(false);
                            setListado(datos)
                            originalListado.current = datos;
                        }
                    })
                })
            }
        })
    }, [titulo])

    return loading ? (
        <Loading />
    ) : (
        <>
            {titulo != "admins"
                ? <>
                    <nav className="navbar-filter">
                        <label htmlFor="filtros">
                            Filtros <Filter />
                        </label>
                    </nav>

                    <input type="checkbox" id='filtros'/>
                    <label htmlFor="filtros" className="background-menu"></label>
                    <header className='filtros'>
                        <form onSubmit={handleSubmit}>
                        {titulo != 'admins'
                            ? <div className='buscador w-100'>
                                    <em>B&uacute;squeda</em>
                                    <div>
                                        {titulo == "clientes" || titulo == "asociaciones" || titulo == "transacciones" 
                                            ? <div className='buscador-field'>
                                                <input type="text" onChange={e => {
                                                    setNombre(e.target.value)
                                                }} placeholder='Nombre...' />
                                                <span>
                                                    <Search />
                                                </span>
                                            </div>
                                        : null}
                                        {titulo != "clientes" 
                                            ? <div className='buscador-field'>
                                                <input type="text" onChange={e => {
                                                    setnombreComercio(e.target.value)
                                                }} placeholder='Nombre comercio...' />
                                                <span>
                                                    <Search />
                                                </span>
                                            </div>
                                        : null}
                                        {titulo == "comercios" 
                                            ? <div className='buscador-field'>
                                                <input type="text" onChange={e => {
                                                    setRubro(e.target.value)
                                                }} placeholder='Rubro...' />
                                                <span>
                                                    <Search />
                                                </span>
                                            </div>
                                        : null}
                                    </div>
                                </div>
                            : null}
                            {titulo == "transacciones" || titulo == 'comercios/pagos'
                                ? <div className='fechas'>
                                        <em>B&uacute;squeda por fecha</em>
                                        <div>
                                            <div>
                                                <span>Desde</span>
                                                <input type="date" name='first' onChange={e => {
                                                    setDate({...date, first: e.target.value})
                                                }}/>
                                            </div>
                                            <div>
                                                <span>Hasta</span>
                                                <input type="date" name='second' onChange={e => {
                                                    setDate({...date, second: e.target.value})
                                                }}/>
                                            </div>
                                            <p onClick={handleDates}>Buscar</p>
                                        </div>
                                    </div>
                                : null}
                        <button onClick={cleanFilters}>Limpiar filtros</button>
                        </form>
                    </header>
                </>
                : null
            }
            <Tabla titulo={titulo} datos={sortedListado} />
            { state.text ? <Toast texto={state.text} res={state.res}/> : null }
        </>
    )
}