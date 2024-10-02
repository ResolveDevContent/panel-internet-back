import { EmptyState } from "./EmptyState"
import { useNavigate, useParams } from 'react-router';
import { useEffect, useState } from "react";
import { listarUno } from "../services/abm";
import { Toast } from "./Toast";
import { InputTemplate } from '../templates/InputTemplate'
import { MultipleSelectTemplate } from '../templates/MultipleSelectTemplate'
import { ListTemplate } from "../templates/ListTemplate"
import { Loading } from "./Loading"
import { PermisosTemplate } from "../templates/permisosTemplate";

export const Ver = ({elementos = [], titulo = '', user = {}}) => {
    const [ data, setData ] = useState({})
    const [ state, setState ] = useState({
        text: "",
        res: ""
    }) 
    const [ loading, setLoading ] = useState(false)
    const { id } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        if(!id) return

        setLoading(true)

        listarUno(titulo, id)
        .then(datos => {
            if(!datos || datos.length == 0) {
                setState({
                    text: "Ha ocurrido un error, intente nuevamente o comuniquese con nosotros", 
                    res: "secondary"
                })
                return
            }

            if(datos.error) {
                setLoading(false)
                setState({
                    text: datos.error,
                    res: "secondary"
                })
                return;
            }

            setLoading(false)
            setData(datos)
        })
    }, [])

    return (
        <>
            {loading 
                ? <div className="form-loading">
                    <Loading />
                    <span>Cargando...</span>
                </div>
                :null
            }
            <article id="form" className="mt-3">
                <strong className="p-3 text-capitalize">{titulo} - {id ? "Editar" : "Agregar"}</strong>
                {elementos.length == 0
                    ? <EmptyState texto="No hay informacion disponible" />
                    :<>
                        <form className="card mt-3 ver">
                            <ul className="card-body">
                                {elementos.map((row, idx) => {
                                    if(row.element == 'input') { return <InputTemplate key={idx} data={row} disabledEmail={titulo == "comercios" || titulo == "admins"} values={data.length > 0 && id ? data[0] : {}}/> }
                                    if(row.element == 'multiple') { return <MultipleSelectTemplate key={idx} user={user} titulo={titulo} data={row} values={id && data.length > 0 ? data[0] : {}}/> }
                                    if(row.element == "list") {return <ListTemplate key={idx} user={user} titulo={titulo} data={row} values={id && data.length > 0 ? data[0] : {}} />}
                                    if(row.element == "permisos") {return <PermisosTemplate key={idx} titulo={titulo} data={row} values={id && data.length > 0 ? data[0] : {}} />}
                                })}
                                <li className="mt-4 p-2 text-end">
                                    <button className="btn btn-success" onClick={() => {navigate("/")}}>Volver</button>
                                </li>
                            </ul>
                        </form>
                    </>
                }
                { state.text ? <Toast texto={state.text} res={state.res}/> : null }
            </article>
        </>
    )
}