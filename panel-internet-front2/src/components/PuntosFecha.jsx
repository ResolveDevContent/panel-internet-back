import { useEffect, useState } from "react";
import { Toast } from "./Toast";

export const PuntosFecha = (titulo) => { 
  const [ date, setDate ] = useState(null);
  const [ state, setState ] = useState({
          text: "",
          res: ""
      })

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

    // guardar fechas nuevas
  }

  useEffect(() => {
    // fechas de la base de datos
  }, [])

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

        {true 
          ? <div className="d-flex flex-column">
              <em>las fechas actuales: </em> 
              <div className="d-flex align-center">
                <div>
                    <span>Fecha desde: <span>Fecha</span></span>
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