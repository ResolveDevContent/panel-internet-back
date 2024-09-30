export const PermisosTemplate = ({data, values = {}}) => { 
    const { nombre, placeholder } = data
    return(
        <li>
            <div className="mb-3">
                <label htmlFor={nombre} className="form-label text-capitalize">{placeholder}</label>
                <div className="d-flex align-center gap-1">
                  <label className="d-flex align-center gap-5">
                    No
                    <input type="radio" className="form-control" name={nombre} value={0} />
                  </label>
                  <label className="d-flex align-center gap-5">
                    Si
                    <input type="radio" className="form-control" name={nombre} value={1} />
                  </label>
                </div>
            </div>
        </li>
    ) 
}