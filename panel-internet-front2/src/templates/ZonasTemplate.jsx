import { useState, useRef, useMemo, useEffect } from "react";
import { listarByZona, listar, listarByAdmin } from "../services/abm";
import { Toast } from "../components/Toast";

export const ZonasTemplate = ({data, titulo, user = {}}) => {
    const [ nombreZona, setNombreZona ] = useState(null);
    const [ sortedListado, setSortedListado ] = useState([]);
    const [ state, setState ] = useState({text: "", res: ""})
    const [ loading, setLoading] = useState(false)
    const [ datos, setDatos ] = useState([]);

    const originalListado = useRef([])

    const { nombre, placeholder, tipo, lista, zona } = data;

    const filteredZona = useMemo(() => {
        setLoading(true)
        const newArr = nombreZona != null && nombreZona.length > 0
        ? originalListado.current.filter(row => {
            return row.toLowerCase().includes(nombreZona.toLowerCase())
        })
        : originalListado.current

        setLoading(false)
        setSortedListado(newArr)
    }, [nombreZona])

    const handleChange = async e => {
        let newArr = [];
        const clientesZona = await listarByZona(e.target.value);
        if(e.target.checked) {
            if(clientesZona && clientesZona.length > 0) {
                const clientesId = clientesZona.map((cliente => cliente.ID_Cliente))

                newArr = [
                    ...datos,
                    ...clientesId
                ]
            }
        } else {
            newArr = datos.filter(item => !clientesZona.map(x => x.ID_Cliente).includes(item));
        }
        setDatos(newArr)
    }

    const handleChangeRadio = e => {
      setDatos(e.target.value);
    }

    const handleChangeAll = e => {
      if(e.target.checked) {
        let newArr = []
        listar("clientes")
        .then((cliente) => {
        newArr = cliente.map((row) => row.ID_Cliente);
        setDatos(newArr)
        })
      } else {
        setDatos([]);
      }
    }

    const zonaList = newArr => {
        const result = newArr.reduce((acc, row) => {
            if(!acc.includes(row.zona)) {
              acc.push(row.zona)
            }
            return acc;
        }, []);

        setSortedListado(result);
        originalListado.current = result;
    }
  
    useEffect(() => {
      setLoading(true)

      const controller = new AbortController();
      const signal = controller.signal;

      setSortedListado([])
      originalListado.current = [];

      if(user && user.role == "superadmin") {
          listar(placeholder, signal)
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

            zonaList(datos)
          })
          .catch(err => {
              setState({
                  text: "Ha ocurrido un error, intente nuevamente o comuniquese con nosotros", 
                  res: "danger"
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
                  res: "danger"
                })
              }

            zonaList(datos)
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
  
    return (
        <li className="list-template">
            <label htmlFor={nombre} className="text-capitalize">{zona}</label>
             <div className='buscador-field'>
                <input type="text" onChange={e => {
                    setNombreZona(e.target.value)
                }} placeholder='Zona...' />
            </div>
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
                                <input type={tipo} id={row} value={row} onChange={tipo == 'checkbox' ? handleChange : handleChangeRadio}/>
                                <span className="text-ellipsis">{row}</span>
                            </label>
                            </li> 
                        )
                      )}
                    </ul>
                  </>
                }
                </div>
              : null}
            <input type="hidden" name={"ID_Zonas"} value={JSON.stringify(datos)} required/>
            { state.text ? <Toast texto={state.text} res={state.res} /> : null }
        </li>
    )
}
