import { useEffect, useState } from 'react'
import { EmptyState } from './EmptyState'
import { Modal } from './Modal'
import { Delete, Edit, Show } from '../assets/icons/icons'
import { modificar, borrar, listarByEmail } from '../services/abm'
import { useNavigate } from 'react-router-dom'
import { Toast } from './Toast'
import { PerfilAuth } from '../services/auth'

export const Tabla = ({titulo, datos, user = {}}) => {
    const [ modalState, setModalState ] = useState({
            open: false,
            id: "",
            nombre: ""
        });
    const [ table, setTable ] = useState({
            columns: [],
            rows: []
        });
    const [ state, setState ] = useState({
            text: "",
            res: ""
        });
    const [ admin, setAdmin ] = useState(null)

const navigate = useNavigate();

const formatearDatos = (datos) => {
    if(!datos || datos.length == 0) {
        setTable({
            columns: [],
            rows: []
        })
        return;
    }

    if(titulo == "historial") {
        datos = datos.sort((a, b) => b.fecha - a.fecha)
    }

    const columns = Object.keys(datos[0]).slice(1, Object.keys(datos[0]).length)
    const rows = datos.map((data) => {
        if((titulo == 'cobranzas' || titulo == 'historial' || titulo == 'transacciones' || titulo == 'comercios/pagos' || titulo == "historial/transacciones") && !data["fecha"].includes("/")) {
            if(!isNaN(Number(data['fecha']))) {
                let date = new Date(Number(data['fecha']));
                const fecha = date.toLocaleString();
    
                data.fecha = fecha;
            }
        }

        if(titulo == 'comercios') {
            data.puntos_totales = new Intl.NumberFormat('es-ES').format(Number(data.puntos_totales))
        }

        if((titulo == 'cobradores' || titulo == 'admins') && data.permisos) {
            data.permisos = Boolean(data.permisos) ? "Activo" : "Inactivo";
        }

        if((titulo == 'transacciones' || titulo == "historial/transacciones")) {
            delete data.puntos_pago
        }

        if((titulo == 'cobranzas')) {
            delete data.ID_Cliente;
        }

        if((titulo == 'cobradores')) {
            delete data.password
        }

        const newArr = Object.values(data)

        return newArr
    })

    if(titulo == "transacciones" || titulo == "asociaciones" || titulo == "comercios/pagos" || titulo == "historial/transacciones"
        || titulo == "comercios-adheridos") {
        const idxComercio = columns.findIndex(column => column == "ID_Comercio");
        columns[idxComercio] = "Nombre Comercio" 

        const idxCliente = columns.findIndex(column => column == "ID_Cliente");
        columns[idxCliente] = "Nombre Cliente" 
    }

    if(titulo == "transacciones" || titulo == "historial/transacciones") {
        const idx = columns.findIndex(column => column == "puntos_pago");
        if(idx > -1) {columns.splice(idx, 1)}
    }

    if(titulo == "cobranzas") {
        const idx = columns.findIndex(column => column == "ID_Cliente");
        if(idx > -1) {columns.splice(idx, 1)}
    }

    if(titulo == "cobradores") {
        const idx = columns.findIndex(column => column == "password");
        if(idx > -1) {columns.splice(idx, 1)}
    }   

    setTable({
        columns: columns,
        rows: rows
    })
}

const editar = (e, id) => {
  e.preventDefault()

  navigate(`/${titulo.toLowerCase()}/editar/${id}`)
}

const borrarDatos = (e, id, email) => {
  e.preventDefault()
  PerfilAuth().then(user => {
      if((user.message.role == "admin" || user.message.role == "superadmin") && (titulo == "comercios" || titulo == "clientes" || titulo == "zonas")) {
          modificar(titulo, id, {activo: 0, user: user.message})
          .then(data => {
                if(data.error) {
                  setState({
                      text: data.error,
                      res: "secondary"
                  })
                  return;
                }
              
                if(titulo != 'zonas') {
                    borrar("users", email)
                    .then(result => {
                        if(result.error) {
                            setState({
                                text: result.error,
                                res: "secondary"
                            })
                            return;
                        }
                        setState({text: result.message, res: "primary"})
                        
                        location.reload()
                    })
                }
            })    
      } else {
            borrar(titulo, id, {user: user.message}).then(result => {
                if(result.error) {
                    setState({
                        text: result.error,
                        res: "secondary"
                    })
                    return;
                }
                setState({text: result.message, res: "primary"})

                setTable(prevState => ({...prevState, rows: prevState.rows.filter(row => Number(row[0]) != id)}));
            })
      }
  })

  setTimeout(() => {
      setState({text: "", res: ""})
  }, 4000)
  setModalState({open: false})
}

useEffect(() => {
    const controller = new AbortController()
    const signal = controller.signal
    formatearDatos(datos)
    PerfilAuth(signal).then(user => {
        if(user && (user.message.role == 'admin' || user.message.role == 'cobrador')) {
            const table = user.message.role == 'admin' ? 'admins' : 'cobradores'
            listarByEmail(table, user.message.email, signal)
            .then(result => {
                setAdmin(result);
            })
        }
    })

    return () => controller.abort();
}, [datos])

return (
        <>
          <article className='d-flex flex-column w-100 h-100 mt-1'>
            <strong className='p-3 text-capitalize'>{titulo} - listado</strong>
            { !table || table.columns.length == 0 || table.rows.length == 0 ? (
                <EmptyState texto="No hay informacion disponible" />
            ) : (
                <div className='table-container'>
                    <div className="d-table p-3 tables">
                        <ul style={{display: "grid", gridTemplateColumns: `repeat(${table.columns.length + 1},1fr)`}}>
                            { table.columns.map((key, idx) => (
                                <li key={idx} className='d-table-cell p-3 text-white bg-black text-capitalize'><span>{key}</span></li>
                            ))}
                            {titulo == 'comercios' || titulo == 'admins' || titulo == 'transacciones' || titulo == "historial" ? (
                                <li className='text-white p-3 d-flex justify-center'>Acciones</li>
                            ) : null}
                        </ul>
                        { table.rows.map((row, idx) => (
                            <ul key={idx} className='listado-row' style={{display: "grid", gridTemplateColumns: `repeat(${table.columns.length + 1},1fr)`}}>
                                {row.map((item, idx) => (
                                    row[0] == item ? null 
                                    : <li key={idx} className='d-flex align-center px-3 py-1'><span>{item}</span></li>
                                ))}

                                <li className='px-3 py-1 d-flex justify-center'>
                                    <ul className='d-flex gap-2 align-center'>
                                        {titulo == "historial"
                                            ? <li>
                                                <a href="#" className='btn btn-primary icono-ver' onClick={() => {navigate("/historial/ver/" + row[0])}}><Show /></a>
                                            </li>
                                            : null
                                        }
                                        {(admin == null || admin[0].permisos == 1) && (titulo == 'comercios' || titulo == 'clientes' || titulo == 'admins' || titulo == 'cobradores' || titulo == 'zonas')
                                            ? <li>
                                                <a href="#" className='btn btn-primary' onClick={(e) => editar(e, row[0])}><Edit /></a>
                                            </li>
                                            : null
                                        }
                                        {(user.role != "comercio" || titulo != "transacciones") && (admin == null || admin[0].permisos == 1) && 
                                        (titulo == 'comercios' || titulo == 'admins' || titulo == 'transacciones' || titulo == 'comercios/pagos' || 
                                        titulo == 'asociaciones' || titulo == 'clientes' || titulo == 'cobranzas' || titulo == 'cobradores' || titulo == 'zonas')
                                            ? <li>
                                                <a href="#" className='btn btn-danger' onClick={() => setModalState({open: !modalState.open, id: row[0], email: row[4]})}><Delete /></a>
                                            </li>
                                            : null
                                        }
                                    </ul>
                                </li>
                            </ul>
                        ))}
                    </div>
                </div>
            )}
            { modalState.open ? (
                <Modal show={"show"} titulo={`Eliminar - ${titulo}`} texto={"¿Estás seguro que deseas eliminarlo?"}>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={() => setModalState({open: false, id: ""})}>Cerrar</button>
                        <button type="button" className="btn btn-primary" onClick={(e) => borrarDatos(e, modalState.id, modalState.email)}>Aceptar</button>
                    </div>
                </Modal>
            ) : null}
            { state.text ? <Toast texto={state.text} res={state.res} /> : null }
          </article>
        </>
)}