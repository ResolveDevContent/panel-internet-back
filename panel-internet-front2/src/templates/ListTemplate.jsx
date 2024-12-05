import { useState, useRef, useMemo, useEffect } from "react";
import { listar, listarByAdmin } from "../services/abm";
import { Toast } from "../components/Toast";

export const ListTemplate = ({data, titulo, values = {}, user = {}}) => {
    const [ nombreCliente, setNombreCliente ] = useState(null);
    const [ nombreComercio, setNombreComercio ] = useState(null);
    const [ nombreZona, setNombreZona ] = useState(null);
    const [ sortedListado, setSortedListado ] = useState([]);
    const [ state, setState ] = useState({text: "", res: ""})
    const [ loading, setLoading] = useState(false)
    const [ datos, setDatos ] = useState([]);
    const [ datosMostrar, setDatosMostrar ] = useState([]);

    const originalListado = useRef([])

    const { nombre, placeholder, tipo, lista} = data;

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

    const filteredZona = useMemo(() => {
      setLoading(true)
      const newArr = nombreZona != null && nombreZona.length > 0
      ? originalListado.current.filter(row => {
          return row.zona.toLowerCase().includes(nombreZona.toLowerCase())
      })
      : originalListado.current

      setLoading(false)
      setSortedListado(newArr)
  }, [nombreZona])

    const handleChange = async e => {
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
        let arr = []
        if(e.target.checked) {
          if(!datosMostrar.includes(e.target.name)) {
            arr = [
              ...datosMostrar,
              e.target.name
            ];
          }
        } else {
          arr = datosMostrar.filter(row => row != e.target.name);
        }
        setDatosMostrar(arr)
      }
    }

    const handleChangeRadio = e => {
      setDatos(e.target.value);
      const find = originalListado.current.find(row => row.ID_Zona == e.target.value)
      setDatosMostrar([find.zona])
    }

    const handleChangeAll = e => {
      if(e.target.checked) {
        let newArr = []

        newArr = sortedListado.map(function(row) { 
          if(placeholder == "clientes") {
            return row.ID_Cliente
          } else if(placeholder == "comercios") {
            return row.ID_Comercio
          } else {
            return row.ID_Zona
          }
        })
        setDatos(newArr)
      } else {
        setDatos([]);
      }

      if(values) {
        if(e.target.checked) {
          const arr = sortedListado.map(function(row) { 
            if(placeholder == "comercios") {
              return row.nombre_comercio
            } else {
              return row.nombre
            }
          })
          
          setDatosMostrar(arr);
        } else {
          setDatosMostrar([]);
        }
      }
    }

  useEffect(() => {
      if(Object.keys(user).length == 0) {
        setState({
          text: "Ha ocurrido un error, intente nuevamente o comuniquese con nosotros", 
          res: "secondary"
        })
        setSortedListado([])
        originalListado.current = [];

        setTimeout(() => {
            setState({text: "", res: ""})
        }, 6000)

        return;
      } 
      setLoading(true)

      const controller = new AbortController();
      const signal = controller.signal;

      setSortedListado([])
      originalListado.current = [];

      if(user.role == "superadmin" || placeholder == 'zonas') {
          listar(placeholder, signal)
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
                  res: "secondary"
                })
              }

              if(Object.keys(values).length > 0) {
                if(titulo == 'admins') {
                  listarByAdmin("permisos", values.email, signal)
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
                          res: "secondary"
                      })
                  })
                } else if(titulo == 'clientes') {
                  setDatos(values.zona);
                  const findZona = datos.find(row => row.ID_Zona == values.zona)
                  setDatosMostrar([findZona.zona])
                }
              } 

              setSortedListado(datos)
              originalListado.current = datos;
          })
          .catch(err => {
              setState({
                  text: "Ha ocurrido un error, intente nuevamente o comuniquese con nosotros", 
                  res: "secondary"
              })
          })
          .finally(setLoading(false))
      } else {
          listarByAdmin(placeholder, user.email, signal)
          .then(datos => {
              if(!datos || datos.length == 0) {
                  setSortedListado([])
                  originalListado.current = [];
                  return;
              }

              if(datos.error) {
                setState({
                  text: "Ha ocurrido un error, intente nuevamente o comuniquese con nosotros", 
                  res: "secondary"
                })
              }

              if(Object.keys(values).length > 0) {
                if(titulo == 'clientes') {
                  setDatos(values.zona);
                  const findZona = datos.find(row => row.ID_Zona == values.zona)
                  setDatosMostrar([findZona.zona])
                }
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
    }, [values])
  
    return (
        <li className="list-template">
            <label htmlFor={nombre} className="text-capitalize">{placeholder}</label>
            {placeholder == 'clientes'
                ? <div className='buscador-field'>
                    <input type="text" onChange={e => {
                        setNombreCliente(e.target.value)
                    }} placeholder='Nombre cliente...' />
                  </div>
                : placeholder == 'zonas' ?
                  <div className='buscador-field'>
                    <input type="text" onChange={e => {
                        setNombreZona(e.target.value)
                    }} placeholder='Nombre zona...' />
                  </div>
                :
                  <div className='buscador-field'>
                      <input type="text" onChange={e => {
                          setNombreComercio(e.target.value)
                      }} placeholder='Nombre comercio...' />
                  </div>
            }
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
                              <input type={tipo} id={placeholder == "clientes"  ? row.ID_Cliente : placeholder == "zonas" ? row.ID_Zona : row.ID_Comercio} name={tipo == "radio" ? "list" : placeholder == "clientes"   ? row.nombre : placeholder == "zonas" ? row.ID_Zona :  row.nombre_comercio} value={placeholder == "clientes"  ? row.ID_Cliente : placeholder == "zonas" ? row.ID_Zona :  row.ID_Comercio} onChange={tipo == 'checkbox' ? handleChange : handleChangeRadio}/>
                              <span className="text-ellipsis">{placeholder == "clientes"   ? row.nombre + " " + row.apellido + " - " + row.direccion_principal : placeholder == "zonas" ? row.zona : row.nombre_comercio}</span>
                            </label>
                          </li>
                        )
                      )}
                    </ul>
                  </>
                }
                </div>
              : null}
              { lista && values && datosMostrar.length > 0 ? (
                  <div className="d-flex flex-column gap-1 mt-1">
                    <span>{placeholder} asignados: </span>
                    <ul className="datos-mostrar">
                      {datosMostrar.map((row, idx) => (
                          <li key={idx}>
                              <span>{row}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
              ) : null}
            <input type="hidden" name={nombre} value={JSON.stringify(datos)} required/>
            { state.text ? <Toast texto={state.text} res={state.res} /> : null }
        </li>
    )
}
