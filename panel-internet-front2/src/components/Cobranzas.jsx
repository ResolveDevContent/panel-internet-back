import { useEffect, useRef, useState } from "react";
import { listarFacturas } from "../services/Mikrowisp";
import { Loading } from "./Loading";

export const Cobranzas = () => {
    const [ ID_Cliente, setID_Cliente ] = useState('');
    const [ clienteId, setClienteId ] = useState('');
    const [ loading, setLoading ] = useState(false);
    const [ facturasList, setFacturasList ] = useState(null);
    const [ state, setState ] = useState({text: '', res: ''});
    const [ clienteObj, setClienteObj ] = useState(null);
    const [ totalFacturas, setTotalFacturas ] = useState(0);

    const totalFacturasRef = useRef(0)

    const handleChange = e => {
        const values = e.target.value.split('-');
        setID_Cliente(values[0])
        setClienteId(values[1])
    }

    const buscarCliente = (id) => {
        if(!id) {
            return;
        }

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

    const handlesubmit = evt => {
        evt.preventDefault()

        const form = evt.target
        const formData = new FormData(form)
        let dataObj = {}

        for(let [name, value] of formData) {
            dataObj[name] = value
        }

        if(dataObj.puntos_pago == 0 || dataObj.puntos_pago <= clienteObj.puntos) {
            setLoading(true)

            let cantidadTotal = dataObj.monto_total + dataObj.puntos_pago;
            pagarFacturas('token', {idfactura: 'id', pasarela: 'efectivo', cantidad: cantidadTotal})
            .then(data => {
                if(data.error) {
                    setState({text: data.error, res: "secondary"})
                    return
                }

                setState({text: "Factura pagada con éxito", res: "primary"})

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
            })
            .catch(err => {
              setState({
                  text: "Ha ocurrido un error, intente nuevamente o comuniquese con nosotros",
                  res: "secondary"
              })
            })
            .finally(() => setLoading(false))

            setTimeout(() => {
                setState({text: "", res: ""})
            }, 6000)
        }
    }

  useEffect(() => {
    if(ID_Cliente != '') {
      buscarCliente(ID_Cliente)
    }
  },[clienteId])

  useEffect(() => {
    if(clienteId != '') {
      setLoading(true)

      listarFacturas('token', {idcliente: clienteId})
      .then(facturas => {
          console.log(facturas)
          if(facturas.length > 0) {
            let total = 0;
            facturas.forEach(row => {
              if(row.estado != 'pagadas') {
                total += row.total
              }
            })
            setTotalFacturas(total);
            totalFacturasRef.current = total;
            setFacturasList(facturas);
          }
      })
      .catch(err => {
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
                      <ul>      
                          {facturasList.length > 0 ? 
                              facturasList.map((row, idx) => (
                                <li key={idx}>
                                  <span>{row.total} - {row.estado}</span>
                                  <span>Emitido: {row.emitido} - vencimiento: {row.vencimiento}</span>
                                </li>
                              ))
                          : null}
                      </ul>
                  </li>
                  <li className="list-template">
                      <label htmlFor="clientes" className="text-capitalize">Utilizar puntos</label>
                      <input type='number' min="0" step="0.01" className="form-control" id='puntos_pago' name='puntos_pago' defaultValue="0" onInput={e => setTotalFacturas(totalFacturasRef.current - e.target.value)}/>
                  </li>
                  <li className="list-template">
                      <label htmlFor="clientes" className="text-capitalize">Monto a pagar</label>
                      <span>Total a pagar: ${totalFacturas}</span>
                      <input type='number' min="0" step="0.01" className="form-control" id='monto_total' name='monto_total' required/>
                  </li>
                  <li className="mt-4 p-2 text-end">
                      <button className="btn btn-success">Confirmar</button>
                  </li>
              </ul>
          </form>
          { state.text ? <Toast texto={state.text} res={state.res}/> : null }
        </article>
}