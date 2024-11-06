import "../assets/css/sidebar.css";
import { NavLink, useNavigate } from 'react-router-dom'
import { LogoutAuth } from "../services/auth";
import AuthContext from "../context/Auth";
import { Admin, Coin, Dolar, HamburgerMenu, History, Location, LogOut, Money, Notepad, Save, Shop, User, Wallet } from "../assets/icons/icons";
import { useContext, useState, useEffect } from "react";
import { Toast } from "./Toast";
import { PerfilAuth } from "../services/auth";
import { listarByEmail } from "../services/abm";
import { Refresh } from "../assets/icons/icons";

export const Sidebar = ({user}) => {
  const [state, setState] = useState("")
  const {auth, setAuth} = useContext(AuthContext)
  const [total, setTotal] = useState({})

  const navigate = useNavigate()

  const logout = () => {
    LogoutAuth(setAuth, setState)
    navigate("/login")

    setTimeout(() => {
      setState({
        text: "", 
        res: ""
      })
    },6000)
  }

  const getMonto = () => {
    PerfilAuth().then((result) => {
      if(result && result.message.role == "comercio") {
        listarByEmail("comercios", result.message.email)
        .then((comercio) => {
          if(comercio.error) {
            setState({
                text: comercio.error,
                res: "secondary"
            })
            return;
          }

          setTotal(comercio[0]);
        })
        .catch(err => {
          setState({
            text: "Ha ocurrido un error, intente nuevamente o comuniquese con nosotros", 
            res: "secondary"
          })
        })
      }
    })
  }

  useEffect(() => {
    getMonto()
  }, [])

  return (
    <>
      <nav className="navbar">
        <label htmlFor="mobile-bar">
          <HamburgerMenu />
        </label>
      </nav>

      <input type="checkbox" id="mobile-bar"/>
      <label htmlFor="mobile-bar" className="background-menu"></label>
      <aside className="sidebar">
        <div className="user">
          <div className="user-avatar">
            <p>{user ? (user.email ? user.email[0] : user.nombre_completo ? user.nombre_completo[0] : "A") : "A"}</p>
          </div>
          <div className="user-info">
            <span>{user ? (user.email ? user.email : user.nombre_completo ? user.nombre_completo : "Usuario") : "Usuario"}</span>
          </div>
          {user && user.role == "superadmin" ? (
            <NavLink className={({isActive}) => isActive ? 'active' : ''} to="cambiarcontraseña">Cambiar contraseña</NavLink>
          ) : null}
        </div>
        {user && user.role == "comercio" ? (
          <div className="totales d-flex align-center">
            <div className=" d-flex flex-column">
              <em>Monto a pagar</em>
              {
                total.puntos_totales && Number(total.puntos_totales) > 0 
                ? <span>${total.puntos_totales}</span> 
                : <span>Saldado</span> 
              }
            </div>
            <button onClick={getMonto}><Refresh/></button>
          </div>
        ) : null}
        <ul className="menu one">
          {user && user.role == "superadmin" ? (
            <>
              <li>
                <input type="radio" id="backups" name="solapa"/>
                <label htmlFor="backups">
                  <Save />
                  <span>Backups</span>
                </label>
                <ul>
                  <li>
                    <NavLink className={({isActive}) => isActive ? 'active' : ''} to="backups">Ver</NavLink>
                  </li>
                </ul>
              </li>
              <li>
                <input type="radio" id="puntos" name="solapa"/>
                <label htmlFor="puntos">
                  <Coin />
                  <span>Puntos</span>
                </label>
                <ul>
                  <li>
                    <NavLink className={({isActive}) => isActive ? 'active' : ''} to="puntos/fecha">Ver</NavLink>
                  </li>
                </ul>
              </li>
              <li>
                <input type="radio" id="historial" name="solapa"/>
                <label htmlFor="historial">
                  <History />
                  <span>Historial</span>
                </label>
                <ul>
                  <li>
                    <NavLink className={({isActive}) => isActive ? 'active' : ''} to="historial/listar">Ver</NavLink>
                  </li>
                </ul>
              </li>
            </>
          ) : null}
          {user && (user.role == "admin" || user.role == "superadmin") ? (
            <>
              <li>
                <input type="radio" id="clientes" name="solapa"/>
                <label htmlFor="clientes">
                  <Location />
                  <span>Zonas</span>
                </label>
                <ul>
                  <li>
                    <NavLink className={({isActive}) => isActive ? 'active' : ''} to="zonas/listar">Listar</NavLink>
                  </li>
                  <li>
                    <NavLink className={({isActive}) => isActive ? 'active' : ''} to="zonas/agregar">Agregar</NavLink>
                  </li>
                </ul>
              </li>
              <li>
                <input type="radio" id="clientes" name="solapa"/>
                <label htmlFor="clientes">
                  <User />
                  <span>Clientes</span>
                </label>
                <ul>
                  <li>
                    <NavLink className={({isActive}) => isActive ? 'active' : ''} to="clientes/listar">Listar</NavLink>
                  </li>
                  {user.role == "superadmin" ? (
                    <>
                      <li>
                        <NavLink className={({isActive}) => isActive ? 'active' : ''} to="clientes/importarcsv">Importar CSV</NavLink>
                      </li>
                      <li>
                        <NavLink className={({isActive}) => isActive ? 'active' : ''} to="clientes/agregar">Agregar</NavLink>
                      </li>
                    </>
                  ) : null}
                </ul>
              </li>
            </>
          ) : null}
          {user && (user.role == "admin" || user.role == "superadmin") ? (
            <>
              {user && user.role == "superadmin" ? (
                <li>
                  <input type="radio" id="admins" name="solapa"/>
                  <label htmlFor="admins" >
                    <Admin />
                    <span>Admins</span>
                  </label>
                  <ul>
                    <li>
                      <NavLink className={({isActive}) => isActive ? 'active' : ''} to="admins/listar">Listar</NavLink>
                    </li>
                    <li>
                      <NavLink className={({isActive}) => isActive ? 'active' : ''} to="admins/agregar">Agregar</NavLink>
                    </li>
                  </ul>
                </li>
              ) : null}
              <li>
                <input type="radio" id="asoc-comercios" name="solapa"/>
                <label htmlFor="asoc-comercios" >
                  <Notepad />
                  <span>Asociaciones Clientes</span>
                </label>
                <ul>
                  <li>
                    <NavLink className={({isActive}) => isActive ? 'active' : ''} to="asociaciones/listar">Listar</NavLink>
                  </li>
                  <li>
                    <NavLink className={({isActive}) => isActive ? 'active' : ''} to="asociaciones/agregarclientes/agregar">Agregar Clientes</NavLink>
                  </li>
                  <li>
                    <NavLink className={({isActive}) => isActive ? 'active' : ''} to="asociaciones/agregarcomercios/agregar">Agregar Comercios</NavLink>
                  </li>
                </ul>
              </li>
              <li>
                <input type="radio" id="comercios" name="solapa"/>
                <label htmlFor="comercios" >
                  <Shop />
                  <span>Comercios</span>
                </label>
                <ul>
                  <li>
                    <NavLink className={({isActive}) => isActive ? 'active' : ''} to="comercios/listar">Listar</NavLink>
                  </li>
                  {user.role == "superadmin" ? (
                    <li>
                      <NavLink className={({isActive}) => isActive ? 'active' : ''} to="comercios/agregar">Agregar</NavLink>
                    </li>
                  ) : null}
                </ul>
              </li>
              <li>
                <input type="radio" id="pagos-comercios" name="solapa"/>
                <label htmlFor="pagos-comercios" >
                  <Money />
                  <span>Pagos Comercios</span>
                </label>
                <ul>
                  <li>
                    <NavLink className={({isActive}) => isActive ? 'active' : ''} to="comercios/pagos/listar">Listar</NavLink>
                  </li>
                  <li>
                    <NavLink className={({isActive}) => isActive ? 'active' : ''} to="comercios/pagos/agregar">Agregar</NavLink>
                  </li>
                </ul>
              </li>
            </>
          ) : null}
          {user && (user.role == "admin" || user.role == "superadmin" || user.role == "cobrador") ? (
              <li>
                <input type="radio" id="clientes" name="solapa"/>
                <label htmlFor="clientes">
                  <Dolar />
                  <span>Cobranzas</span>
                </label>
                <ul>
                  <li>
                    <NavLink className={({isActive}) => isActive ? 'active' : ''} to="cobranzas/listar">Listar</NavLink>
                  </li>
                  <li>
                    <NavLink className={({isActive}) => isActive ? 'active' : ''} to="cobranzas/agregar">Agregar</NavLink>
                  </li>
                </ul>
              </li>
          ) : null}
          {user && (user.role == "admin" || user.role == "superadmin") ? (
            <li>
              <input type="radio" id="transacciones" name="solapa"/>
              <label htmlFor="transacciones" >
                <Wallet />
                <span>Transacciones</span>
              </label>
              <ul>
                <li>
                  <NavLink className={({isActive}) => isActive ? 'active' : ''} to="transacciones/listar">Listar</NavLink>
                </li>
                <li>
                  <NavLink className={({isActive}) => isActive ? 'active' : ''} to="transacciones/agregar">Agregar</NavLink>
                </li>
              </ul>
            </li>
          ) : null}
          {user && user.role == "cliente" ? (
            <>
              <li>
                <input type="radio" id="clientes" name="solapa"/>
                <NavLink className={({isActive}) => isActive ? 'active' : ''} to="cliente">Mis puntos</NavLink>
              </li>
              <li>
                <input type="radio" id="clientes" name="solapa"/>
                <NavLink className={({isActive}) => isActive ? 'active' : ''} to="historial/transacciones/listar">Historial</NavLink>
              </li>
            </>
          ) : null}
          {user && user.role == "comercio" ? (
            <li>
              <input type="radio" id="transacciones" name="solapa"/>
              <label htmlFor="transacciones" >
                <Wallet />
                <span>Transacciones</span>
              </label>
              <ul>
                <li>
                  <NavLink className={({isActive}) => isActive ? 'active' : ''} to="transaccionesComercio/listar">Listar</NavLink>
                </li>
                <li>
                  <NavLink className={({isActive}) => isActive ? 'active' : ''} to="transaccionesComercio/agregar">Agregar</NavLink>
                </li>
              </ul>
            </li>
          ) : null}
        </ul>
        <ul className="menu two">
          <li>
            <button onClick={logout}>
              <LogOut />
              <span>Cerrar sesion</span>
            </button>
          </li>
        </ul>
      </aside>
      { state.text ? <Toast texto={state.text} res={state.res}/> : null }
    </>
  );
};