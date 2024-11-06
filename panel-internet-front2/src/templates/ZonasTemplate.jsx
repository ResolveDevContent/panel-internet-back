import { useState, useRef, useMemo, useEffect } from "react";
import { listarByZona, listar, listarByAdmin, listaZonaByAdmin } from "../services/abm";
import { Toast } from "../components/Toast";

export const ZonasTemplate = ({data, titulo, user = {}}) => {
    const [ nombreZona, setNombreZona ] = useState(null);
    const [ sortedListado, setSortedListado ] = useState([]);
    const [ state, setState ] = useState({text: "", res: ""})
    const [ loading, setLoading] = useState(false)
    const [ datos, setDatos ] = useState([]);

    const originalListado = useRef([])

    const { tipo } = data;

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
        let newArr = [];
        let clientesZona = [];
        if(user && user.role == 'superadmin') {
            clientesZona = await listarByZona(e.target.value);
        } else {
            clientesZona = await listaZonaByAdmin(e.target.value, user.email);
        }

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

    const handleChangeAll = e => {
      if(e.target.checked) {
        let newArr = []
        if(user && user.role == "superadmin") {
            listar("clientes")
            .then((cliente) => {
                newArr = cliente.map((row) => row.ID_Cliente);
                setDatos(newArr)
            })
        } else {
            listarByAdmin('clientes', user.email, signal)
            .then(datos => {
                if(!datos || datos.length == 0) {
                    setState({
                      text: "Este admin no posee clientes en la zonas seleccionada", 
                      res: "danger"
                    })
                    setDatos([])
                    return;
                }

                if(datos.error) {
                  setState({
                    text: "Ha ocurrido un error, intente nuevamente o comuniquese con nosotros", 
                    res: "danger"
                  })
                  return;
                }

                newArr = datos.map((row) => row.ID_Cliente);
                setDatos(newArr)
            }).catch(err => {
                setState({
                    text: "Ha ocurrido un error, intente nuevamente o comuniquese con nosotros", 
                    res: "secondary"
                })
            })
            .finally(setLoading(false))
        }
      } else {
        setDatos([]);
      }
    }
  
    useEffect(() => {
      setLoading(true)

      const controller = new AbortController();
      const signal = controller.signal;

      setSortedListado([])
      originalListado.current = [];

      listar('zonas', signal)
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

      return () => controller.abort()
    }, [])
  
    return (
        <li className="list-template">
            <label htmlFor={nombre} className="text-capitalize">zonas</label>
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
                      <label>
                        <input type="checkbox" value={'todos'} onChange={handleChangeAll}/>
                        <span>Seleccionar todos ({sortedListado.length})</span>
                      </label>
                      <ul>
                        {sortedListado.map((row, idx) => (
                              <li key={idx}>
                              <label>
                                  <input type={tipo} id={row.id} value={row.id} onChange={handleChange}/>
                                  <span className="text-ellipsis">{row-zona}</span>
                              </label>
                              </li> 
                          )
                        )}
                      </ul>
                    </>
                }
                </div>
              : null}
            <input type="hidden" name={"ID_Zona"} value={JSON.stringify(datos)} required/>
            { state.text ? <Toast texto={state.text} res={state.res} /> : null }
        </li>
    )
}
