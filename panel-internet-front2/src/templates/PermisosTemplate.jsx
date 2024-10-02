export const PermisosTemplate = ({data, values = {}}) => { 
    const { nombre, placeholder } = data
    console.log(values)
    return(
        <li>
            <div className="mb-3">
                <label htmlFor={nombre} className="form-label text-capitalize">{placeholder}</label>
                <div className="d-flex align-center gap-1">
                  <label className="d-flex align-center gap-5">
                    No
                    <input type="radio" className="form-control" name={nombre} value={0} defaultChecked={values[nombre] && values[nombre] == 0 ? true : false}/>
                  </label>
                  <label className="d-flex align-center gap-5">
                    Si
                    <input type="radio" className="form-control" name={nombre} value={1} defaultChecked={values[nombre] && values[nombre] == 1 ? true : false}/>
                  </label>
                </div>
            </div>
        </li>
    ) 
}