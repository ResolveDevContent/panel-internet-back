import '../assets/css/user.css'
import { Coin, Wallet } from '../assets/icons/icons'
import { puntosTotales } from '../services/totales'
import { useEffect, useState } from 'react'
import { PerfilAuth } from '../services/auth'
import { Toast } from './Toast'
import { Loading } from './Loading'
import { listarUno } from '../services/abm'

export const User = () => {
  const [ state, setState ] = useState({
      text: "",
      res: ""
  })
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(null)
  const [cliente, setCliente] = useState({})

  useEffect(() => {
    setLoading(true)

    PerfilAuth().then((result) => {
      if(result && result.message.role == "cliente") {
        listarUno("clientes", result.message.ID_Cliente)
        .then((cliente) => {
          if(cliente.error) {
            setLoading(false)
            setState({
                text: cliente.error,
                res: "secondary"
            })
            return;
          }
          setCliente(cliente[0])
          puntosTotales(cliente[0].ID_Cliente)
          .then(datos => {
            if(datos.error) {
              setLoading(false)
              setState({
                  text: datos.error,
                  res: "secondary"
              })
              return;
            }
            setTotal(datos[0])
            setLoading(false)
          })
        })
      }
    })
  }, [])
    return (
      <>
        {loading 
          ? <div className="form-loading">
              <Loading />
          </div>
          :null
        }
        <div className="user-container d-flex align-center flex-column justify-center">
            {cliente ? (
              <div className='d-flex flex-column mb-1'>
                <strong className='mb-1'>Bienvenido {cliente.nombre}!</strong>
                <ul className='d-flex flex-column gap-1'>
                  <li>
                    <span>Tus datos:</span>
                  </li>
                  <li>
                    <span>Nombre y apellido: {cliente.nombre + " " + cliente.apellido}</span>
                  </li>
                  <li>
                    <span>Direccion Principal: {cliente.direccion_principal}</span>
                  </li>
                  <li>
                    <span>Email: {cliente.email}</span>
                  </li>
                  <li>
                    <span>Zona: {cliente.zona}</span>
                  </li>
                </ul>
              </div>
            ) : null}
            <div className="d-flex align-center flex-column">
                <em>Monto total gastado</em>
                <div className='d-flex align-center wallet'>
                  <Wallet />
                  {
                    total != null && total.monto_total[0].total && total.monto_total[0].total > 0 
                    ? <span>$ {total.monto_total[0].total}</span> 
                    :<span className="saldado">$0</span> 
                  }
                </div>
            </div>
            <div className="d-flex align-center flex-column">
                <em>Puntos totales</em>
                <div className='d-flex align-center'>
                  <Coin />
                  {
                    total != null && total.puntos[0].total && total.puntos[0].total > 0 
                    ? <span>{total.puntos[0].total}</span> 
                    :<span className="saldado">Sin puntos</span> 
                  }
                </div>
          </div>
        </div>
        { state.text ? <Toast texto={state.text} res={state.res}/> : null }
      </>
    )
}