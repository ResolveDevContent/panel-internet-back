import { useEffect, useState } from "react";
import { Toast } from "./Toast";
import { agregar, listar } from "../services/abm";
import { Loading } from "./Loading";

export const PuntosFecha = ({titulo}) => { 
  const [ date, setDate ] = useState(null);
  const [ state, setState ] = useState({
          text: "",
          res: ""
      })
  const [ result, setResult ] = useState(null);
  const [ update, setUpdate ] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleDates = () => {
    setLoading(true);

    agregar(titulo, {fecha: date})
    .then(data => {
        if(data.error) {
            setState({text: data.error, res: "secondary"})
            setLoading(false)
            return
        }
        setLoading(false)

        setUpdate(data);
        setState({text: data.message, res: "primary"})
    });

    setTimeout(() => {
        setState({text: "", res: ""})
    }, 4000)
  }

  useEffect(() => {
    setLoading(true);

    const controller = new AbortController()
    const signal = controller.signal

    listar(titulo, signal)
    .then(datos => {
        if(datos.error) {
            setLoading(false);
            setState({
                text: datos.error, 
                res: "secondary"
            })
            setTimeout(() => {
                setState({text: "", res: ""})
            }, 4000)
            return;
        }

        let fechaHora = '';
        if(datos.length > 0) {
          fechaHora = datos[0].fecha;
        }

        setLoading(false);
        setResult(fechaHora);
    })

    return () => controller.abort();
  }, [update])

  return(
    loading ? 
      <Loading />
    :
      <>
        <article className="d-flex flex-column w-100 h-100 mt-1">
          <strong className="p-3 text-capitalize">{titulo}</strong>

          <div className='puntos-fechas'>
            <em>Definir fecha limite para utilizar los puntos</em>
            <div>
                <div>
                    <span>D&iacute;a limite</span>
                    <input type="number" step="1" min="1" max="28" name='second' placeholder="Ingrese del 1 al 28" onChange={e => {
                        setDate(e.target.value)
                    }}/>
                </div>
                <p onClick={handleDates}>Guardar</p>
            </div>
          </div>

          {result != null && result != ''
            ? <div className="d-flex flex-column mt-1">
                <em>D&iacute;a defin&iacute;do</em> 
                <div className="d-flex align-center">
                  <div>
                      <span className="d-flex gap-5 align-center mt-1">El <span>{result}</span> de cada mes</span>
                  </div>
                </div>
            </div>
            : <div>
                <em>No hay una d&iacute;a defin&iacute;do</em>
            </div>
          }
        </article>
        { state.text ? <Toast texto={state.text} res={state.res}/> : null }
      </>
  ) 
}