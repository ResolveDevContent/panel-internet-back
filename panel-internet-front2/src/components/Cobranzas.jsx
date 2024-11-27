import { useEffect, useMemo, useRef, useState } from "react";
import { listarFacturas, pagarFacturas } from "../services/Mikrowisp";
import { Loading } from "./Loading";
import { listarUno, agregar, listar, listarByAdmin } from '../services/abm'
import { puntosTotales } from '../services/totales'
import { Toast } from '../components/Toast'
import { useNavigate } from 'react-router-dom'
import { EmptyState } from "./EmptyState";

export const Cobranzas = ({user = {}}) => {
    const [ ID_Cliente, setID_Cliente ] = useState('');
    const [ clienteId, setClienteId ] = useState('');
    const [ loading, setLoading ] = useState(false);
    const [ facturasList, setFacturasList ] = useState({total: 0, arr: []});
    const [ state, setState ] = useState({text: '', res: ''});
    const [ clienteObj, setClienteObj ] = useState(null);
    const [ totalFacturas, setTotalFacturas ] = useState({total: 0, arr: []});
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
            setTotalFacturas(prevState => ({total: prevState.total + Number(values[1]), arr: newArr}))
            totalFacturasRef.current += Number(values[1]);
        } else {
            newArr = totalFacturas.arr.filter(row => row.id != values[0])
            setTotalFacturas(prevState => ({total: prevState.total - Number(values[1]), arr: newArr}))
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

        console.log(dataObj)

        if(totalFacturas.arr.length > 0 && (Number(dataObj.monto_total) > 0 || Number(dataObj.puntos_pago) == Number(dataObj.monto_total)) &&
            (Number(dataObj.puntos_pago) == 0 || Number(dataObj.puntos_pago) <= Number(clienteObj.puntos))) {
            setLoading(true)

            console.log(totalFacturas)
            // const fetchPromises = totalFacturas.arr.map(async row => {
            //     pagarFacturas({token: import.meta.env.VITE_TOKEN, idfactura: row.id, pasarela: 'efectivo', cantidad: row.total})
            //     .then(data => {
            //         console.log(data)

            //         return true
            //     })
            //     .catch((err) => {
            //         console.log(err)
            //         return null
            //     })
            // });

            // const results = await Promise.all(fetchPromises);

            if(results.some(res => res === true)) {
                console.log(results)
                dataObj.results = results;
                dataObj.facturas = totalFacturas.arr
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
                    text: "Ha ocurrido un error en la API de Mikrowisp, intente nuevamente o comuniquese con nosotros",
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

        setLoading(true)

        listarFacturas({token: import.meta.env.VITE_TOKEN, idcliente: clienteId})
        .then(facturas => {
            console.log(facturas)
            let newArr = [];            
            if(facturas.facturas.length > 0) {
                newArr = facturas.facturas.filter(row => row.estado != 'pagado' && row.estado != 'anulado')
            }
            setFacturasList({ total: 0, arr: newArr });
        })
        .catch(err => {
            setFacturasList({ total: 0, arr: [] }); 
            setState({
                text: "Ha ocurrido un error en la API de Mikrowisp, intente nuevamente o comuniquese con nosotros",
                res: "secondary"
            })
        })
        .finally(() => setLoading(false))
    }
  },[clienteId])

  return (
    <>
        {loading 
            ? <Loading />
            : null}
        <article id="form" className="mt-3">
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
                                    : null}
                                <ul>
                                    {sortedListado.map((row, idx) => (
                                        <li key={idx}>
                                        <label>
                                            <input type='radio' id={row.ID_Cliente} name="clientes" value={row.ID_Cliente + '-' + row.Id} onChange={handleChange}/>
                                            <span className="text-ellipsis">{row.nombre + " " + row.apellido + " - " + row.direccion_principal}</span>
                                        </label>
                                        </li>
                                    )
                                    )}
                                </ul>
                            </div>
                            : null}
                        <input type="hidden" name='ID_Cliente' value={JSON.stringify(ID_Cliente)} required/>
                    </li>
                    <li className="list-template">
                        <div className="info-cliente">
                            <p><span className="bolder">Nombre y apellido: </span> {clienteObj == null ? '' : clienteObj.nombre + " " + clienteObj.apellido}</p>
                            <p><span className="bolder">Direccion: </span> {clienteObj == null ? '' : clienteObj.direccion_principal}</p>
                            <p><span className="bolder">Email: </span> {clienteObj == null ? '' : clienteObj.email}</p>
                            <p><span className="bolder">Puntos: </span> {clienteObj == null ? '' : !clienteObj.puntos ? "Sin puntos" : clienteObj.puntos}</p>
                            <input type="hidden" name="nombre" value={clienteObj == null ? '' : clienteObj.nombre + " " + clienteObj.apellido}/>
                        </div>
                    </li>
                    <li className="list-template">
                        <label className="text-capitalize">Facturas</label>
                        {facturasList.arr.length > 0 ? 
                            <div className="dropdown-list">
                                <ul className="facturas">      
                                    {facturasList.arr.map((row, idx) => (
                                        <li key={idx}>
                                            <label>
                                                <input type="checkbox" id={row.id} name={row.id} value={row.id + '-' + row.total} onChange={handleFacturas}/>
                                                <div className="d-flex">
                                                    <span>{row.estado} - {row.total2}</span>
                                                    <span><span className="bolder">vencimiento:</span> {row.vencimiento}</span>
                                                </div>
                                            </label>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        : <EmptyState texto="No hay facturas disponible" />}
                    </li>
                    <li className="list-template">
                        <div>
                            <select name="pasarela">
                                <option value="Efectivo Oficina/Sucursal">Efectivo Oficina/Sucursal</option>
                                <option value="Depósito bancario">Depósito bancario</option>
                                <option value="Transferencia Bancaria">Transferencia Bancaria</option>
                                <option value="Mercadopago">Mercadopago</option>
                                <option value="Oxxo Pay">Oxxo Pay</option>
                                <option value="Conekta">Conekta</option>
                                <option value="Pagofácil">Pagofácil</option>
                                <option value="Kushki">Kushki</option>
                                <option value="khipu">khipu</option>
                                <option value="Webpay">Webpay</option>
                                <option value="Epayco">Epayco</option>
                                <option value="Cobro Digital">Cobro Digital</option>
                                <option value="Cuenta Digital">Cuenta Digital</option>
                                <option value="Flow">Flow</option>
                                <option value="PayPal/Visa/Mastercard">PayPal/Visa/Mastercard</option>
                            </select> 
                        </div>
                    </li>
                    <li className="list-template">
                        <div>
                            <label htmlFor="clientes" className="text-capitalize">Utilizar puntos</label>
                            <input type='number' min="0" step="0.01" className="form-control" id='puntos_pago' name='puntos_pago' defaultValue="0" onInput={e => setTotalFacturas(prevState => ({...prevState, total: totalFacturasRef.current - e.target.value}))}/>
                        </div>
                    </li>
                    <li className="list-template">
                        <label htmlFor="clientes" className="text-capitalize">Monto a pagar</label>
                        <span>${totalFacturas?.total}</span>
                        <input type='hidden' id='monto_total' name='monto_total' value={totalFacturas?.total}/>
                    </li>
                    <li className="mt-4 p-2 text-end">
                        <button className="btn btn-success">Confirmar</button>
                    </li>
                </ul>
                <input type="hidden" name="cobrador" value={user.nombre ? user.nombre : user.mail}/>
            </form>
            { state.text ? <Toast texto={state.text} res={state.res}/> : null }
        </article>
    </>
    )
}