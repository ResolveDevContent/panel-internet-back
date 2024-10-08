import { useEffect, useState } from "react";
import { Toast } from "./Toast";
import { agregar, listar } from "../services/abm";

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
    if(date == null) {
        setState({
            text: "Complete la fecha antes de guardar",
            res: "secondary"
        });
        setTimeout(() => {
            setState({text: "", res: ""})
        }, 4000)
        return
    }

    let fecha = new Date(date.replace(/-/g, '\/'));
    fecha = fecha.setHours(0,0,0,0);

    setLoading(true);

    agregar(titulo, {fecha: fecha})
    .then(data => {
        if(data.error) {
            setState({text: data.error, res: "secondary"})
            setLoading(false)
            return
        }
        setLoading(false)

        setUpdate(fecha);
        setState({text: data.message, res: "primary"})
    });

    setTimeout(() => {
        setState({text: "", res: ""})
    }, 4000)
  }

  useEffect(() => {
    setLoading(true);

    listar(titulo)
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
        
        if(datos.length > 0 && Number(datos[0].fecha) >= Date.now()) {
          let date = new Date(Number(datos[0].fecha));
          const fecha = date.toISOString();
          fechaHora = fecha.split('T')[0] + ' 00:00 hs';
        }

        setLoading(false);
        setResult(fechaHora);
    })
  }, [update])

  return(
    <>
      <article className="d-flex flex-column w-100 h-100 mt-1">
        <strong className="p-3 text-capitalize">{titulo}</strong>

        <div className='puntos-fechas'>
          <em>Definir fecha limite para utilizar los puntos</em>
          <div>
              <div>
                  <span>Hasta</span>
                  <input type="date" name='second' onChange={e => {
                      setDate(e.target.value)
                  }}/>
              </div>
              <p onClick={handleDates}>Guardar</p>
          </div>
        </div>

        {result != null && result != ''
          ? <div className="d-flex flex-column mt-1">
              <em>Las fechas actuales</em> 
              <div className="d-flex align-center">
                <div>
                    <span className="d-flex gap-5 align-center mt-1">Fecha desde: <span>{result}</span></span>
                </div>
              </div>
          </div>
          : <div>
              <em>No hay una fecha definida</em>
          </div>
        }
      </article>
      { state.text ? <Toast texto={state.text} res={state.res}/> : null }
    </>
  ) 
}