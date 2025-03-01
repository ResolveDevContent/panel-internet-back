import '../assets/css/filtros.css'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Toast } from './Toast'
import { Loading } from '../components/Loading'
import { listar, listarByAdmin, listarByCobrador, listarByComercio, listarByEmail, listarUno } from '../services/abm'
import { PerfilAuth } from '../services/auth'
import { Filter, Search } from '../assets/icons/icons'
import { Tabla } from './Tabla'
import { puntosTotales } from '../services/totales'

export const Listado = ({titulo, user = {}}) => {
    const [ state, setState ] = useState({
        text: "",
        res: ""
    })
    const [ listado, setListado ] = useState([])
    const [ sortedListado, setSortedListado ] = useState([])
    const [ loading, setLoading ] = useState(false)
    const [ nombre, setNombre ] = useState(null);
    const [ rubro, setRubro ] = useState(null);
    const [ cobrador, setCobrador ] = useState(null);
    const [ factura, setFactura ] = useState(null);
    const [ nombreComercio, setnombreComercio ] = useState(null);
    const [ date, setDate ] = useState({first: "", second: ""});
    const [ calculosTotales, setcalculosTotales ] = useState(null);

    const originalListado = useRef([])

    const filteredNombre = useMemo(() => {
        let newArr = [];
        if(titulo == "clientes" || titulo == "cobranzas") {
            newArr = nombre != null && nombre.length > 0
                ? listado.filter(row => {
                    return row.nombre.toLowerCase().includes(nombre.toLowerCase())
                })
                : titulo == 'cobranzas' 
                    ? listado
                    : user.role == 'superadmin' ? listado : []
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
        if(titulo != "asociaciones" && titulo != "transacciones" && titulo != "comercios/pagos" && titulo != "historial/transacciones") {
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

    const filteredCobrador = useMemo(() => {
        let newArr = [];
        if(titulo == "cobradores") {
            newArr = cobrador != null && cobrador.length > 0
            ? listado.filter(row => {
                return row.nombre.toLowerCase().includes(cobrador.toLowerCase())
            })
            : listado
        } else {
            newArr = cobrador != null && cobrador.length > 0
            ? listado.filter(row => {
                return row.cobrador.toLowerCase().includes(cobrador.toLowerCase())
            })
            : listado
        }

        setSortedListado(newArr)
    }, [cobrador])


    const filteredFactura = useMemo(() => {
        const newArr = factura != null && factura.length > 0
        ? listado.filter(row => {
            return row.ID_Factura.toLowerCase().includes(factura.toLowerCase())
        })
        : listado

        setSortedListado(newArr)
    }, [factura])

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
            const fecha = row.fecha.split(",")[0]
            const fechaReverse = fecha.split("/").reverse().join("/");
            const fechaCompleta = fechaReverse + row.fecha.split(",")[1];

            const timestamp = new Date(fechaCompleta).getTime();
            let firstDate = new Date(date.first.replace(/-/g, '\/'));
            firstDate = firstDate.setHours(0,0,0,0);
            let secondDate = new Date(date.second.replace(/-/g, '\/'));
            secondDate = secondDate.setHours(23,59,59,99);
            
            return Number(timestamp) >= firstDate && Number(timestamp) <= secondDate;
        })

        if(titulo == 'transacciones') {
            calculoDeTotales(newArr);
        }

        setSortedListado(newArr)
    }

    const handleSubmit = e => {
        e.preventDefault()

        const form = e.target;
        form.reset();
    }

    const cleanFilters = () => {
        if(titulo == 'clientes') {
            setSortedListado([])
        } else {
            setSortedListado(originalListado.current)
        }

        setcalculosTotales(null)
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

                if(titulo != 'clientes' && row.ID_Cliente) {
                    const cliente = await listarUno("clientes", row.ID_Cliente);
                    if(cliente.length <= 0) {
                        return null;
                    }

                    row.ID_Cliente = cliente[0].nombre
                    if(titulo != 'historial/transacciones' && titulo != 'comercios-adheridos') {
                        row.apellido = cliente[0].apellido
                        row.email = cliente[0].email
                        row.direccion_principal = cliente[0].direccion_principal
                    }
                }

                if(titulo != 'zonas' && row.zona) {
                    const zona = await listarUno("zonas", row.zona);
                    if(zona.length <= 0) {
                        return null;
                    }

                    row.zona = zona[0].zona
                }

                if(titulo == 'cobranzas' && row.tipo != 'superadmin') {
                    let newArr = [];
                    if(row.tipo == 'admin') {
                        newArr = await listarByEmail("admins", row.cobrador);
                        if(newArr.length <= 0) {
                            return null;
                        }
                    } else if(row.tipo == 'cobrador') {
                        newArr = await listarByEmail("cobradores", row.cobrador);
                        if(newArr.length <= 0) {
                            return null;
                        }
                    }

                    if(newArr.length > 0) {
                        row.cobrador = newArr[0].nombre
                    }
                }

                if(row.activo) {
                    row.activo = 'Activo'
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
        const datosActualizados = resultados.filter(row => row !== null);
        setLoading(false);
        setListado(datosActualizados);
        originalListado.current = datosActualizados;
    }

    const calculoDeTotales = newArr => {
        const result = newArr.reduce((acc, row) => {
            if(!acc.hasOwnProperty('puntos_totales')) {
                acc['puntos_totales'] = 0;
            }
            if(!acc.hasOwnProperty('puntos_pagos')) {
                acc['puntos_pagos'] = 0;
            }
            if(!acc.hasOwnProperty('monto_total')) {
                acc['monto_total'] = 0;
            }

            acc['puntos_totales'] += Number(row.puntos_parciales);
            acc['puntos_pagos'] += Number(row.puntos_pago);
            acc['monto_total'] += Number(row.monto_parcial);

            return acc;
        }, {});

        setcalculosTotales(result);
    }

    async function totales(datos) {
        const actualizaciones = datos.map(async (row, idx) => {
            try {
                const total = await puntosTotales(row.ID_Cliente);
                
                if (total.error) {
                    throw new Error(total.error); // Maneja el error lanzando una excepción
                }

                if(total.length > 0 && total[0].puntos.length > 0) {
                    row.puntos = total[0].puntos[0].total;
                } else {
                    row.puntos = 0;
                }

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

    useEffect(() => {
        const controller = new AbortController()
        const signal = controller.signal

        setLoading(true)

        // limpiando
        setNombre(null);
        setnombreComercio(null);
        setDate({first: "", second: ""});
        setcalculosTotales(null);
        originalListado.current = [];

        PerfilAuth(signal).then(user => {
            if(user.message.role == "superadmin" || user.message.role == "cliente" 
                || titulo == 'zonas' || titulo == 'cobranzas') {
                if(user.message.role == "cliente" && titulo == 'historial/transacciones') {
                    listarByEmail('clientes', user.message.email, signal)
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

                        listarUno(titulo, datos[0].ID_Cliente, signal)
                        .then(result => {
                            if(result.error) {
                                setLoading(false);
                                setState({
                                    text: result.error,
                                    res: "secondary"
                                })
                                setTimeout(() => {
                                    setState({text: "", res: ""})
                                }, 4000)
                                return;
                            }

                            if(!result || result.length == 0) {
                                setLoading(false);
                                setListado([])
                                originalListado.current = [];
                                return;
                            }

                            formatToNombres(result)
                            setLoading(false);
                        })
                    })
                } else if (titulo == 'comercios-adheridos') {
                    listarUno(titulo, user.message.ID_Cliente, signal).then(datos => {
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

                        formatToNombres(datos)
                    })
                } else {
                    listar(titulo, signal).then(datos => {
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

                        if(titulo == 'clientes') {
                            totales(datos);
                        }

                        if(titulo == "asociaciones" || titulo == "transacciones" || titulo == "comercios/pagos" 
                            || titulo == 'clientes' || titulo == "cobranzas" || titulo == "zonas") {
                            formatToNombres(datos)
                        } else {
                            setLoading(false);
                            setListado(datos)
                            originalListado.current = datos;
                        }
                    })
                }
            }

            if (user.message.role == "admin" && titulo != 'zonas' && titulo != 'cobranzas') {
                listarByAdmin(titulo, user.message.email, signal)
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

                    if(titulo == 'clientes') {
                        totales(datos);
                    }

                    if(titulo == "asociaciones" || titulo == "transacciones" || titulo == "comercios/pagos" || titulo == 'clientes') {
                        formatToNombres(datos)
                    } else {
                        setLoading(false);
                        setListado(datos)
                        originalListado.current = datos;
                    }
                })
            } 
            if(user.message.role == "comercio") {
                listarByEmail("comercios", user.message.email, signal)
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
                    listarByComercio(titulo, comercio.ID_Comercio, signal).then(datos => {
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

                        if(titulo == 'clientes') {
                            totales(datos);
                        }

                        if(titulo == "transacciones" || titulo == 'clientes') {
                            formatToNombres(datos)
                        } else {
                            setLoading(false);
                            setListado(datos)
                            originalListado.current = datos;
                        }
                    })
                })
            }

            if(user.role == "cobrador" && titulo == "cobranzas") {
                listarByCobrador()
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

                    formatToNombres(datos)
                })
            }
        })

        return () => controller.abort()
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
                                        {titulo == "clientes" || titulo == "asociaciones" || titulo == "transacciones" || titulo == 'cobranzas'
                                            ? <div className='buscador-field'>
                                                <input type="text" onChange={e => {
                                                    setNombre(e.target.value)
                                                }} placeholder='Nombre cliente...' />
                                                <span>
                                                    <Search />
                                                </span>
                                            </div>
                                        : null}
                                        {titulo != "clientes" && titulo != "historial" && titulo != "historial/transacciones" && titulo != "cobranzas" && titulo != "zonas"
                                            && titulo != "cobradores" && titulo != "comercios-adheridos"
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
                                        {titulo == 'cobranzas' || titulo == 'cobradores'
                                            ? 
                                                <div className='buscador-field'>
                                                    <input type="text" onChange={e => {
                                                        setCobrador(e.target.value)
                                                    }} placeholder='Cobrador...' />
                                                    <span>
                                                        <Search />
                                                    </span>
                                                </div>
                                        : null}
                                        {titulo == "cobranzas" ? (
                                            <div className='buscador-field'>
                                                <input type="text" onChange={e => {
                                                    setFactura(e.target.value)
                                                }} placeholder='Nro factura...' />
                                                <span>
                                                    <Search />
                                                </span>
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                            : null}
                            {titulo == "transacciones" || titulo == 'comercios/pagos' || titulo == "historial" || 
                            titulo == "historial/transacciones" || titulo == 'cobranzas'
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
                                        {calculosTotales != null
                                            ? <ul>
                                                    <li>
                                                        <span>Puntos totales: <span>{calculosTotales.puntos_totales}</span></span>
                                                    </li>
                                                    {/* <li>
                                                        <span>Puntos utilizados: <span>{calculosTotales.puntos_pagos}</span></span>
                                                    </li> */}
                                                    <li>
                                                        <span>Monto total: <span>{calculosTotales.monto_total}</span></span>
                                                    </li>
                                                </ul>
                                            : null}
                                    </div>
                                : null}
                        <button onClick={cleanFilters}>Limpiar filtros</button>
                        </form>
                    </header>
                </>
                : null
            }
            <Tabla titulo={titulo} datos={sortedListado} user={user}/>
            { state.text ? <Toast texto={state.text} res={state.res}/> : null }
        </>
    )
}