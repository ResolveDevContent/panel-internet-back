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

function App() {
  const [auth, setAuth] = useState(false);
  const [user, setUser] = useState({});

  const readCookie = () => {
    const user = Cookies.get("token");
    if (user) {
      setAuth(true)
    } else {
      setAuth(false)
    }
  }

  useEffect(() => {
    readCookie();
    PerfilAuth().then((result) => {
      console.log(result.message)
      setUser(result.message)
    })
  }, [auth])

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
        <BrowserRouter>
          <Routes>
            <Route path="/panel/login" element={<Login />} />
            <Route path="/panel/login/cliente" element={<LoginClienteForm />} />
            <Route path="/panel/" element={
              <Panel user={user}/>
            }>
              <Route element={<PrivateRoutes user={user} roles={['superadmin']}/>}>
                <Route path="clientes/agregar" element={<ImportCsv titulo={"clientes"} />} />
                <Route path="admins/listar" element={<Listado titulo={"admins"}/>} />
                <Route path="admins/agregar" element={<Form elementos={ELEMENTOS.admins} user={user} titulo={'admins'}/>} />
                <Route path="admins/editar/:id" element={<Form elementos={ELEMENTOS.admins} titulo={'admins'}/>} />
                <Route path="comercios/agregar" element={<Form elementos={ELEMENTOS.comercios} titulo={'comercios'}/>} />
                <Route path="comercios/editar/:id" element={<Form elementos={ELEMENTOS.comercios} titulo={'comercios'}/>} />
              </Route>
              <Route element={<PrivateRoutes user={user} roles={['admin', 'superadmin']}/>}>
                <Route path="comercios/listar" element={<Listado titulo={"comercios"}/>} />
                <Route path="comercios/pagos/listar" element={<Listado titulo={'comercios/pagos'}/>} />
                <Route path="comercios/pagos/agregar" element={<Form elementos={ELEMENTOS.pagos} user={user} titulo={'comercios/pagos'}/> } />
                <Route path="comercios/pagos/editar/:id" element={<Form elementos={ELEMENTOS.pagos} titulo={'comercios/pagos'}/>} />
                <Route path="asociaciones/listar" element={<Listado titulo={"asociaciones"}/>} />
                <Route path="asociaciones/agregarclientes/agregar" element={<Form elementos={ELEMENTOS.asociacionesClientes} titulo={'asociaciones/clientes'} user={user}/>} />
                <Route path="asociaciones/agregarcomercios/agregar" element={<Form elementos={ELEMENTOS.asociacionesComercios} titulo={'asociaciones/comercios'} user={user}/>} />
              </Route>
              <Route element={<PrivateRoutes user={user} roles={['admin', 'comercio', 'superadmin']}/>}>
                <Route path="clientes/listar" element={<Listado titulo={"clientes"}/>} />
                <Route path="transacciones/listar" element={<Listado titulo={"transacciones"}/>} />
                <Route path="transacciones/agregar" element={<Form elementos={ELEMENTOS.transacciones} titulo={'transacciones'} user={user} />}  />
                <Route path="transacciones/editar/:id" element={<Form elementos={ELEMENTOS.transacciones} titulo={'transacciones'}/>} user={user} />
              </Route>
              <Route element={<PrivateRoutes user={user} roles={['cliente', 'superadmin']}/>}>
                <Route path='cliente' element={<User />} />
              </Route>
            </Route>
            <Route path='*' element={<Component404 />}/>
          </Routes>
        </BrowserRouter>
    </AuthContext.Provider>
  )
}

export default App