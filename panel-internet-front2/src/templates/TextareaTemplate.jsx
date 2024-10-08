export const TextareaTemplate = ({data, disabledEmail, values = {}}) => { 
    const { nombre, tipo, placeholder, valor } = data
    return(
        <li>
            <div className="mb-3">
                <label htmlFor={nombre} className="form-label text-capitalize">{placeholder}</label>
                <textarea className="form-control" id={nombre} name={nombre} placeholder={placeholder} defaultValue={values[data.nombre]}></textarea> 
            </div>
        </li>
    ) 
}