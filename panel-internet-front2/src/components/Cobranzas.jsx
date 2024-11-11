import { useEffect, useMemo, useRef, useState } from "react";
import { listarFacturas, pagarFacturas } from "../services/Mikrowisp";
import { Loading } from "./Loading";
import { listarUno, agregar, listar, listarByAdmin } from '../services/abm'
import { puntosTotales } from '../services/totales'
import { Toast } from '../components/Toast'
import { useNavigate } from 'react-router-dom'

export const Cobranzas = ({user = {}}) => {
    const [ ID_Cliente, setID_Cliente ] = useState('');
    const [ clienteId, setClienteId ] = useState('');
    const [ loading, setLoading ] = useState(false);
    const [ facturasList, setFacturasList ] = useState({total: 0, arr: []});
    const [ state, setState ] = useState({text: '', res: ''});
    const [ clienteObj, setClienteObj ] = useState(null);
    const [ totalFacturas, setTotalFacturas ] = useState(null);
    const [ sortedListado, setSortedListado ] = useState([]);
    const [ nombreCliente, setNombreCliente ] = useState('')

    const totalFacturasRef = useRef(0)
    const originalListado = useRef([])
    const navigate = useNavigate();

    const filteredNombre = useMemo(() => {
        setLoading(true)
        const newArr = nombreCliente != null && nombreCliente.length > 0
            ? originalListado.current.filter(row => {
                return row.nombre.toLowerCase().includes(nombreCliente.toLowerCase())
            })
            : originalListado.current

        setLoading(false)
        setSortedListado(newArr)
    }, [nombreCliente])

    const handleChange = e => {
        const values = e.target.value.split('-');
        setID_Cliente(values[0])
        setClienteId(values[1])
    }

    const handleFacturas = e => {
        let newArr = [];
        const values = e.target.value.split('-');
        if(e.target.checked) {
            newArr = [
                ...totalFacturas.arr,
                {
                    id: values[0],
                    total: values[1]
                }
            ];
            setTotalFacturas(prevState => ({total: prevState + Number(values[1]), arr: newArr}))
            totalFacturasRef.current += Number(values[1]);
        } else {
            newArr = totalFacturas.arr.filter(row => row.id != values[0])
            setTotalFacturas(prevState => ({total: prevState - Number(values[1]), arr: newArr}))
            totalFacturasRef.current -= Number(values[1]);
        }
    } 

    const buscarCliente = id => {
        if(!id) return;

        listarUno("clientes", id)
        .then(datos => {
            if(!datos || datos.length == 0) {
                setClienteObj(null)
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
                setClienteObj(datos[0])
            })
        })
    }

    const handlesubmit = async evt => {
        evt.preventDefault()

        const form = evt.target
        const formData = new FormData(form)
        let dataObj = {}

        for(let [name, value] of formData) {
            dataObj[name] = value
        }

        if(totalFacturas.arr > 0 && (dataObj.monto_total > 0 || dataObj.puntos_pago == dataObj.monto_total) &&
            (dataObj.puntos_pago == 0 || dataObj.puntos_pago <= clienteObj.puntos)) {
            setLoading(true)

            const fetchPromises = totalFacturas.arr.map(async row => {
                pagarFacturas('token', {idfactura: row.id, pasarela: 'efectivo', cantidad: row.total})
                .then(data => {
                    if(data.error) {
                        return null
                    }

                    return true
                })
                .catch(() => null)
            });

            const results = await Promise.all(fetchPromises);

            if(results.every(res => res === true)) {
                agregar('cobranzas', dataObj)
                .then(data => {
                    if(data.error) {
                        setState({text: data.error, res: "secondary"})
                        return
                    }

                    setState({text: data.message, res: "primary"})

                    navigate(`/cobranzas/listar`)
                })
                .catch(err => {
                    setState({
                        text: "Ha ocurrido un error, intente nuevamente o comuniquese con nosotros",
                        res: "secondary"
                    })
                })
                .finally(() => setLoading(false))
            } else {
                setState({
                    text: "Ha ocurrido un error con en la API de Mikrowisp, intente nuevamente o comuniquese con nosotros",
                    res: "secondary"
                })
                setLoading(false)
            }
        } else {
            setState({
                text: "Verifique que todos los campos ingresados sean correctos",
                res: "secondary"
            })
        }

        setTimeout(() => {
            setState({text: "", res: ""})
        }, 6000)
    }

  useEffect(() => {
      setLoading(true)

      const controller = new AbortController();
      const signal = controller.signal;

      setSortedListado([])
      originalListado.current = [];

      if(user && user.role == "superadmin") {
          listar('clientes', signal)
          .then(datos => {
                console.log(datos)
                if(!datos || datos.length == 0) {
                    setSortedListado([])
                    originalListado.current = [];
                    return;
                }

                if(datos.error) {
                    setState({
                    text: "Ha ocurrido un error, intente nuevamente o comuniquese con nosotros", 
                    res: "danger"
                    })
                }

                setSortedListado(datos)
                originalListado.current = datos;
          })
          .catch(err => {
              setState({
                  text: "Ha ocurrido un error, intente nuevamente o comuniquese con nosotros", 
                  res: "danger"
              })
          })
          .finally(setLoading(false))
      } else {
          listarByAdmin('clientes', user.email, signal)
          .then(datos => {
              if(!datos || datos.length == 0) {
                  setSortedListado([])
                  originalListado.current = [];
                  return;
              }

              if(datos.error) {
                setState({
                  text: "Ha ocurrido un error, intente nuevamente o comuniquese con nosotros", 
                  res: "danger"
                })
              }

                setSortedListado(datos)
                originalListado.current = datos;
          }).catch(err => {
              setState({
                  text: "Ha ocurrido un error, intente nuevamente o comuniquese con nosotros", 
                  res: "secondary"
              })
          })
          .finally(setLoading(false))
      }

      return () => controller.abort()
  }, [])

  useEffect(() => {
    if(ID_Cliente != '') {
      buscarCliente(ID_Cliente)
    }
  },[clienteId])

  useEffect(() => {
    console.log(clienteId)
    if(clienteId != '') {
      setLoading(true)

      listarFacturas({token: 'Smx2SVdkbUZIdjlCUlkxdFo1cUNMQT09', idcliente: clienteId, estado: 1})
      .then(facturas => {
            console.log(facturas)
            const textFormat = Object.entries(facturas)
            .map(([key, value]) => key + ':' + value)
            .join('\n');
            
            console.log(textFormat);
            if(facturas.length > 0) {
                const newArr = facturas.filter(row => row.estado != 'pagadas')
                totalFacturasRef.current = newArr;
                setFacturasList(newArr);
            }
      })
      .catch(err => {
        console.log(err)
        setState({
            text: "Ha ocurrido un error, intente nuevamente o comuniquese con nosotros",
            res: "secondary"
        })
      })
      .finally(() => setLoading(false))
    }
  },[clienteId])

  return loading 
      ? <Loading />
      : <article id="form" className="mt-3">
          <strong className="p-3 text-capitalize">Cobranzas - Agregar</strong>
          <form className="card mt-3" onSubmit={handlesubmit}>
              <ul className="card-body">
                  <li className="list-template">
                      <label htmlFor="clientes" className="text-capitalize">Clientes</label>
                      <div className='buscador-field'>
                        <input type="text" onChange={e => {
                            setNombreCliente(e.target.value)
                        }} placeholder='Nombre cliente...' />
                      </div>
                      {sortedListado.length > 0 
                        ? <div className="dropdown-list">
                          {loading 
                            ? <div className="list-loading-container">
                                  <div className="list-loading"></div>
                              </div>
                            : <ul>
                                {sortedListado.map((row, idx) => (
                                    <li key={idx}>
                                      <label>
                                        <input type='radio' id={row.ID_Cliente} name={row.nombre} value={row.ID_Cliente + '-' + row.Id} onChange={handleChange}/>
                                        <span className="text-ellipsis">{row.nombre + " " + row.apellido + " - " + row.direccion_principal}</span>
                                      </label>
                                    </li>
                                  )
                                )}
                              </ul>
                          }
                          </div>
                        : null}
                      <input type="hidden" name='ID_Cliente' value={JSON.stringify(ID_Cliente)} required/>
                  </li>
                  <li className="list-template">
                      {clienteObj != null ?
                          <div className="info-cliente">
                              <strong>Nombre y apellido: {clienteObj.nombre + " " + clienteObj.apellido}</strong>
                              <p>Direccion: {clienteObj.direccion_principal}</p>
                              <p>Email: {clienteObj.email}</p>
                              <p>Puntos: {!clienteObj.puntos ? "Sin puntos" : clienteObj.puntos}</p>
                          </div>
                      : null}
                  </li>
                  <li className="list-template">
                      <label className="text-capitalize">Facturas</label>
                        {facturasList.arr.length > 0 ? 
                            <div className="dropdown-list">
                                <ul>      
                                    {facturasList.arr.map((row, idx) => (
                                        <li key={idx}>
                                            <label>
                                                <input type="checkbox" id={row.idfactura} name={row.idfactura} value={row.idfactura + '-' + row.total} onChange={handleFacturas}/>
                                                <div className="d-flex flex-column ">
                                                    <span>{row.total} - {row.estado}</span>
                                                    <span>Emitido: {row.emitido} - vencimiento: {row.vencimiento}</span>
                                                </div>
                                            </label>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        : null}
                  </li>
                  <li className="list-template">
                      <label htmlFor="clientes" className="text-capitalize">Utilizar puntos</label>
                      <input type='number' min="0" step="0.01" className="form-control" id='puntos_pago' name='puntos_pago' defaultValue="0" onInput={e => setTotalFacturas(prevState => ({...prevState, total: totalFacturasRef.current - e.target.value}))}/>
                  </li>
                  <li className="list-template">
                      <label htmlFor="clientes" className="text-capitalize">Monto a pagar</label>
                      <span>Total a pagar: ${totalFacturas?.total}</span>
                      <input type='hidden' id='monto_total' name='monto_total' value={totalFacturas?.total}/>
                  </li>
                  <li className="mt-4 p-2 text-end">
                      <button className="btn btn-success">Confirmar</button>
                  </li>
              </ul>
          </form>
          { state.text ? <Toast texto={state.text} res={state.res}/> : null }
        </article>
}