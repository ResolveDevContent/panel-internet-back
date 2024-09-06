export const InputTemplate = ({data, disabledEmail, values = {}}) => { 
    const { nombre, tipo, placeholder } = data
    console.log(disabledEmail)
    return(
        <li>
            <div className="mb-3">
                <label htmlFor={nombre} className="form-label text-capitalize">{placeholder}</label>
                {tipo == "number" ? (
                    <input type={tipo} min="0" step="0.01" className="form-control" id={nombre} name={nombre} placeholder={placeholder} defaultValue={values[data.nombre]} required={nombre != "puntos_pago"}/>
                ) : (
                    <input type={tipo} className="form-control" id={nombre} name={nombre} placeholder={placeholder} defaultValue={values[data.nombre]} required={nombre != "puntos_pago" && tipo != "password"} disabled={nombre == "email" && values[data.nombre] && disabledEmail ? true : false}/>
                )}
            </div>
        </li>
    ) 
}