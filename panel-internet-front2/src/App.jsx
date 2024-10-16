import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { useEffect, useState } from 'react'

import { Login } from './components/Login'
import { LoginClienteForm } from './components/LoginCliente'
import { Form } from './components/Form'
import { Listado } from './components/Listado'
import { Panel } from './components/Panel'
import { ELEMENTOS } from './Elementos'
import { Component404 } from './components/Component404'
import { User } from './components/User'
import AuthContext from './context/Auth'
import Cookies from 'js-cookie'
import PrivateRoutes from './components/ProtectedRoute.jsx'
import { PerfilAuth } from './services/auth.js'
import { ImportCsv } from './components/ImportCsv.jsx'
import { ChangePassword } from './components/ChangePassword.jsx'
import { PuntosFecha } from './components/PuntosFecha.jsx'
import { Backups } from './components/Backups.jsx'
import { Ver } from './components/Ver.jsx'

function App() {
  const [auth, setAuth] = useState(false);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false)

  const readCookie = () => {
    const user = Cookies.get("token");
    if (user) {
      setAuth(true)
    } else {
      setAuth(false)
    }
  }

  useEffect(() => {
    setLoading(true)
    readCookie();
    PerfilAuth().then((result) => {
      setUser(result.message)
    }).finally((res) => {
      setLoading(false)
    })
  }, [auth])

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/login/cliente" element={<LoginClienteForm />} />
            <Route path="/" element={
              <Panel user={user}/>
            }>
              <Route element={<PrivateRoutes user={user} roles={['superadmin']}/>}>
                <Route path="backups" element={<Backups titulo={"backups"}/>} />

                <Route path="puntos/fecha" element={<PuntosFecha titulo={"puntos/fecha"}/>} />
                <Route path="historial/listar" element={<Listado user={user} titulo={"historial"}/>} />
                <Route path="historial/ver/:id" element={<Ver elementos={ELEMENTOS.historial} titulo={"historial"}/>} />
                <Route path="cambiarcontraseña" element={<ChangePassword titulo={"users"} />} />
                <Route path="clientes/importarcsv" element={<ImportCsv titulo={"clientes"} />} />
                <Route path="clientes/agregar" element={<Form elementos={ELEMENTOS.clientes} user={user} titulo={"clientes"} />} />
                <Route path="clientes/editar/:id" element={<Form elementos={ELEMENTOS.clientes} titulo={'clientes'}/>} user={user}/>
                <Route path="admins/listar" element={<Listado user={user} titulo={"admins"}/>} />
                <Route path="admins/agregar" element={<Form elementos={ELEMENTOS.admins} user={user} titulo={'admins'}/>} />
                <Route path="admins/editar/:id" element={<Form elementos={ELEMENTOS.admins} titulo={'admins'} user={user}/>} />
                <Route path="comercios/agregar" element={<Form elementos={ELEMENTOS.comercios} titulo={'comercios'}/>} />
                <Route path="comercios/editar/:id" element={<Form elementos={ELEMENTOS.comercios} titulo={'comercios'}/>} />
              </Route>
              <Route element={<PrivateRoutes user={user} roles={['admin', 'superadmin']}/>}>
                <Route path="clientes/listar" element={<Listado user={user} titulo={"clientes"}/>} />
                <Route path="comercios/listar" element={<Listado user={user} titulo={"comercios"}/>} />
                <Route path="comercios/pagos/listar" element={<Listado user={user} titulo={'comercios/pagos'}/>} />
                <Route path="comercios/pagos/agregar" element={<Form elementos={ELEMENTOS.pagos} user={user} titulo={'comercios/pagos'}/> } />
                <Route path="comercios/pagos/editar/:id" element={<Form elementos={ELEMENTOS.pagos} titulo={'comercios/pagos'}/>} />
                <Route path="asociaciones/listar" element={<Listado user={user} titulo={"asociaciones"}/>} />
                <Route path="asociaciones/agregarclientes/agregar" element={<Form elementos={ELEMENTOS.asociacionesClientes} titulo={'asociaciones/clientes'} user={user}/>} />
                <Route path="asociaciones/agregarcomercios/agregar" element={<Form elementos={ELEMENTOS.asociacionesComercios} titulo={'asociaciones/comercios'} user={user}/>} />
              </Route>
              {!loading ? (
                <Route element={<PrivateRoutes user={user} roles={['admin', 'comercio', 'superadmin']}/>}>
                  <Route path="transacciones/listar" element={<Listado user={user} titulo={"transacciones"}/>} />
                  <Route path="transacciones/agregar" element={<Form elementos={ELEMENTOS.transacciones} titulo={'transacciones'} user={user} />}  />
                  <Route path="transacciones/editar/:id" element={<Form elementos={ELEMENTOS.transacciones} titulo={'transacciones'}/>} user={user} />
                </Route>
              ) : null}
              {!loading ? (
                <Route element={<PrivateRoutes user={user} roles={['cliente']}/>}>
                  <Route path='cliente' element={<User />} />
                  <Route path='historial/transacciones/listar' element={<Listado user={user} titulo={'historial/transacciones'} />} />
                </Route>
              ) : null}
            </Route>
            <Route path='*' element={<Component404 />}/>
          </Routes>
        </BrowserRouter>
    </AuthContext.Provider>
  )
}

export default App
