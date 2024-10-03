export const InputTemplate = ({data, disabledEmail, values = {}}) => { 
    const { nombre, tipo, placeholder, valor } = data
    return(
        <li>
            <div className="mb-3">
                <label htmlFor={nombre} className="form-label text-capitalize">{placeholder}</label>
                {tipo == "number" ? (
                    <input type={tipo} min="0" step="0.01" className="form-control" id={nombre} name={nombre} placeholder={placeholder} defaultValue={values[data.nombre]} required={nombre != "puntos_pago"}/>
                ) : (
                    <input type={tipo} className={nombre == "email" && values[data.nombre] && disabledEmail ? "form-control disabled" : "form-control"} id={nombre} name={nombre} placeholder={placeholder} defaultValue={values[data.nombre]} required={nombre != "puntos_pago" && tipo != "password"}/>
                )}
            </div>
        </li>
    ) 
}