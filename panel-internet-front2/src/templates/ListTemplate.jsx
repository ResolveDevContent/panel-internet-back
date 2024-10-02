import { useState, useRef, useMemo, useEffect } from "react";
import { listar, listarByAdmin } from "../services/abm";
import { Toast } from "../components/Toast";

export const ListTemplate = ({data, titulo, values = [], user = {}}) => {
    const [ nombreCliente, setNombreCliente ] = useState(null);
    const [ nombreComercio, setNombreComercio ] = useState(null);
    const [ sortedListado, setSortedListado ] = useState([]);
    const [ state, setState ] = useState({text: "", res: ""})
    const [ loading, setLoading] = useState(false)
    const [ datos, setDatos ] = useState([]);
    const [ datosMostrar, setDatosMostrar ] = useState([]);

    const originalListado = useRef([])

    const { nombre, placeholder, tipo } = data;

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

    const filteredComercio = useMemo(() => {
        setLoading(true)
        const newArr = nombreComercio != null && nombreComercio.length > 0
        ? originalListado.current.filter(row => {
            return row.nombre_comercio.toLowerCase().includes(nombreComercio.toLowerCase())
        })
        : originalListado.current

        setLoading(false)
        setSortedListado(newArr)
    }, [nombreComercio])

    const handleChange = e => {
      setLoading(true)
      let newArr = [];
      if(e.target.checked) {
        newArr = [
          ...datos,
          e.target.value
        ];
      } else {
        newArr = datos.filter(row => row != e.target.value);
      }

      setLoading(false)
      setDatos(newArr);

      if(values) {
        newArr = [
          ...datosMostrar,
          e.target.name
        ];
        setDatosMostrar(newArr)
      }
    }

    const handleChangeRadio = e => {
      setDatos(e.target.value);
    }

    const handleChangeAll = e => {
      const newArr = sortedListado.map(function(row) { 
        if(placeholder == "clientes") {
          return row.ID_Cliente
        } else {
          return row.ID_Comercio
        }
      })

      e.target.checked ? setDatos(newArr) : setDatos([]);

      if(values) {
        const newArr = sortedListado.map(function(row) { 
          if(placeholder == "clientes") {
            return row.nombre
          } else {
            return row.nombre_comercio
          }
        })
        setDatosMostrar(newArr)
      }
    }

  
  useEffect(() => {
      setLoading(true)

      if(values.length > 0) {
        setSortedListado(values)
        originalListado.current = values;
        setLoading(false)
      } else if(user && user.role == "superadmin") {
          listar(placeholder)
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

              if(titulo == 'admins' && values) {
                listar(placeholder)
                .then(permisos => {
                    if(!permisos || permisos.error|| permisos.length == 0) {
                        return;
                    }

                    const idsComercio = [];
                    const nombresComercio = [];

                    permisos.forEach(row => {
                      idsComercio.push(row.ID_Comercio)

                      const comercio = datos.find((_row) => _row.ID_Comercio == row.ID_Comercio)
                      if(comercio) {
                        nombresComercio.push(comercio.nombre_comercio)
                      }
                    })

                    setDatos(idsComercio);
                    setDatosMostrar(nombresComercio)
                })
                .catch(err => {
                    setState({
                        text: "Ha ocurrido un error, intente nuevamente o comuniquese con nosotros", 
                        res: "danger"
                    })
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
          listarByAdmin(placeholder, user.email)
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
    }, [])
  
    return (
        <li className="list-template">
            <label htmlFor={nombre} className="text-capitalize">{placeholder}</label>
            {placeholder == 'clientes'
                ? <div className='buscador-field'>
                    <input type="text" onChange={e => {
                        setNombreCliente(e.target.value)
                    }} placeholder='Nombre cliente...' />
                  </div>
                : <div className='buscador-field'>
                    <input type="text" onChange={e => {
                        setNombreComercio(e.target.value)
                    }} placeholder='Nombre comercio...' />
                  </div>}
            {sortedListado.length > 0 
              ? <div className="dropdown-list">
                {loading 
                  ? <div className="list-loading-container">
                        <div className="list-loading"></div>
                    </div>
                  : <>
                    { tipo != 'radio'
                      ? <label>
                          <input type="checkbox" value={'todos'} onChange={handleChangeAll}/>
                          <span>Seleccionar todos ({sortedListado.length})</span>
                        </label>
                      : null
                    }
                    <ul>
                      {sortedListado.map((row, idx) => (
                          <li key={idx}>
                            <label>
                              <input type={tipo} id={placeholder == "clientes" ? row.ID_Cliente : row.ID_Comercio} name={tipo == "radio" ? "list" : placeholder == "clientes" ? row.nombre : row.nombre_comercio} value={placeholder == "clientes" ? row.ID_Cliente : row.ID_Comercio} onChange={tipo == 'checkbox' ? handleChange : handleChangeRadio}/>
                              <span>{placeholder == "clientes" ? row.nombre : row.nombre_comercio}</span>
                            </label>
                          </li>
                        )
                      )}
                    </ul>
                  </>
                }
                </div>
              : null}
              { values && datosMostrar.length > 0 ? (
                  <ul>
                    {datosMostrar.map((row, idx) => (
                        <li key={idx}>
                            <span>{row}</span>
                        </li>
                      )
                    )}
                  </ul>
              ) : null}
            <input type="hidden" name={nombre} value={JSON.stringify(datos)} required/>
            { state.text ? <Toast texto={state.text} res={state.res} /> : null }
        </li>
    )
}
