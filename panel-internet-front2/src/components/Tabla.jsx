import { useEffect, useState } from 'react'
import { EmptyState } from './EmptyState'
import { Modal } from './Modal'
import { Delete, Edit } from '../assets/icons/icons'
import { modificar, borrar } from '../services/abm'
import { useNavigate } from 'react-router-dom'
import { Toast } from './Toast'
import { PerfilAuth } from '../services/auth'

export const Tabla = ({titulo, datos}) => {
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

const navigate = useNavigate();

const formatearDatos = (datos) => {
    if(!datos || datos.length == 0) {
        setTable({
            columns: [],
            rows: []
        })
        return;
    }

    const columns = Object.keys(datos[0]).slice(1, Object.keys(datos[0]).length)

    const rows = datos.map((data) => {
        if((titulo == 'transacciones' || titulo == 'comercios/pagos') && !data["fecha"].includes("/")) {
            let date = new Date(Number(data['fecha']))
            date = date.toLocaleDateString();

            data.fecha = date
        }

        if(titulo == 'comercios') {
            data.puntos_totales = new Intl.NumberFormat('es-ES').format(data.puntos_totales)
        }

        if(titulo == "admins") {
            delete data.password
        }

        const newArr = Object.values(data)

        return newArr
    })

    if(titulo == "comercios") {
        const idx = columns.findIndex(column => column == "puntos_totales");
        columns[idx] = "deudas"
    }
    
    if(titulo == "admins") {
        const idx = columns.findIndex(column => column == "password");
        columns.splice(idx, 1);
    }

    if(titulo == "transacciones" || titulo == "asociaciones" || titulo == "comercios/pagos") {
        const idxComercio = columns.findIndex(column => column == "ID_Comercio");
        columns[idxComercio] = "Nombre Comercio" 

        const idxCliente = columns.findIndex(column => column == "ID_Cliente");
        columns[idxCliente] = "Nombre Cliente" 
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
      if((user.message.role == "admin" || user.message.role == "superadmin") && titulo == "comercios") {
          modificar(titulo, id, {activo: 0})
          .then(data => {
                if(data.error) {
                  setState({
                      text: data.error,
                      res: "secondary"
                  })
                  return;
                }
              
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
            })    
      } else {
          borrar(titulo, id).then(result => {
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

  setTimeout(() => {
      setState({text: "", res: ""})
  }, 4000)
  setModalState({open: false})
}

useEffect(() => {
    formatearDatos(datos)
}, [datos])

return (
        <>
          <article className='d-flex flex-column w-100 h-100 mt-1'>
            <strong className='p-3 text-capitalize'>{titulo} - listado</strong>
            { !table || table.columns.length == 0 ? (
                <EmptyState texto="No hay informacion disponible" />
            ) : (
                <div className='table-container'>
                    <div className="d-table p-3 tables">
                        <ul style={{display: "grid", gridTemplateColumns: `repeat(${table.columns.length + 1},1fr)`}}>
                            { table.columns.map((key, idx) => (
                                <li key={idx} className='d-table-cell p-3 text-white bg-black text-capitalize'><span>{key}</span></li>
                            ))}
                            {titulo == 'comercios' || titulo == 'admins' || titulo == 'transacciones' ? (
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
                                        {titulo == 'comercios'
                                            ? <li>
                                                <a href="#" className='btn btn-primary' onClick={(e) => editar(e, row[0])}><Edit /></a>
                                            </li>
                                            : null
                                        }
                                        {titulo == 'comercios' || titulo == 'admins' || titulo == 'transacciones'
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