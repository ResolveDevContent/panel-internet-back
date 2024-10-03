import { useRef, useEffect } from "react"

export const PermisosTemplate = ({data, values = {}}) => { 
    const { nombre, placeholder } = data
    const refSi = useRef()
    const refNo = useRef()

    useEffect(() => {
      console.log(values["permisos"])
      console.log(refSi, refNo)
  
      if(values["permisos"] && values["permisos"] == 1 && refSi.current) {
        refSi.current.checked = true;
      } else if(values["permisos"] && values["permisos"] == 0 && refNo.current){
        refNo.current.checked = true;
      }
    }, [values])

    return(
        <li>
            <div className="mb-3">
                <label htmlFor={nombre} className="form-label text-capitalize">{placeholder}</label>
                <div className="d-flex align-center gap-1">
                  <label className="d-flex align-center gap-5">
                    No
                    <input type="radio" className="form-control" name={nombre} value={0} ref={refNo} />
                  </label>
                  <label className="d-flex align-center gap-5">
                    Si
                    <input type="radio" className="form-control" name={nombre} value={1} ref={refSi}/>
                  </label>
                </div>
            </div>
        </li>
    ) 
}