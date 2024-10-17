import { EmptyState } from "./EmptyState"
import { useNavigate, useParams } from 'react-router';
import { useEffect, useState } from "react";
import { listarUno, agregar, modificar } from "../services/abm";
import { Toast } from "./Toast";
import { InputTemplate } from '../templates/InputTemplate'
import { MultipleSelectTemplate } from '../templates/MultipleSelectTemplate'
import { ListTemplate } from "../templates/ListTemplate"
import { Loading } from "./Loading"
import { PermisosTemplate } from "../templates/permisosTemplate";

export const Form = ({elementos = [], titulo = '', user = {}}) => {
    const [ data, setData ] = useState({})
    const [ state, setState ] = useState({
        text: "",
        res: ""
    }) 
    const [ loading, setLoading ] = useState(false)

    const { id } = useParams()

    const navigate = useNavigate()
    
    const handlesubmit = evt => {
        evt.preventDefault()

        const form = evt.target
        const formData = new FormData(form)
        let dataObj = {}

        for(let [name, value] of formData) {
            if(name == "puntos_pago" && value == "") {
                value = 0
            }

            if(name == "user") {
                console.log(value)
                value = JSON.parse(value)
                console.log(value)
            }

            if((titulo == "admins" && name == "ID_Comercio") ||
            titulo == "asociaciones/clientes" ||
            titulo == "asociaciones/comercios" ||
            titulo == "comercios/pagos" || 
            titulo == "transacciones") { 
                value = JSON.parse(value)    
            }

            dataObj[name] = value
        }

        if(id) {
            setLoading(true)
            console.log(dataObj)
            modificar(titulo, id, dataObj)
            .then(data => {
                if(data.error) {
                    setLoading(false)
                    setState({
                        text: data.error,
                        res: "secondary"
                    })
                    return;
                }
                setLoading(false)
                setState({text: data.message, res: "primary"})
                navigate(`/${titulo}/listar`)
            })
        } else {
            setLoading(true)

            if(dataObj.list) {
                delete dataObj.list
            }

            if(dataObj.listComercio) {
                delete dataObj.listComercio
            }

            if(dataObj.listCliente) {
                delete dataObj.listCliente
            }

            agregar(titulo, dataObj)
            .then(data => {
                if(data.error) {
                    setState({text: data.error, res: "secondary"})
                    setLoading(false)
                    return
                }
                setLoading(false)

                setState({text: data.message, res: "primary"})

                if(titulo == "asociaciones/clientes" || titulo == "asociaciones/comercios") {
                    navigate(`/asociaciones/listar`)
                } else {
                    navigate(`/${titulo}/listar`)
                }
            })
            form.reset()
        }

        setTimeout(() => {
            setState({text: "", res: ""})
        }, 6000)
    }

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
                        <form className="card mt-3" onSubmit={handlesubmit}>
                            <ul className="card-body">
                                {elementos.map((row, idx) => {
                                    if(row.element == 'input') { return <InputTemplate key={idx} data={row} disabledEmail={titulo == "comercios" || titulo == "admins"} values={data.length > 0 && id ? data[0] : {}}/> }
                                    if(row.element == 'multiple') { return <MultipleSelectTemplate key={idx} user={user} titulo={titulo} data={row} values={id && data.length > 0 ? data[0] : {}}/> }
                                    if(row.element == "list") {return <ListTemplate key={idx} user={user} titulo={titulo} data={row} values={id && data.length > 0 ? data[0] : {}} />}
                                    if(row.element == "permisos") {return <PermisosTemplate key={idx} titulo={titulo} data={row} values={id && data.length > 0 ? data[0] : {}} />}
                                })}
                                <li>
                                    {user ? (
                                        <input type="hidden" id="user" name="user" value={JSON.stringify(user)}/>
                                    ) : null}
                                </li>
                                <li className="mt-4 p-2 text-end">
                                    <button className="btn btn-success">Confirmar</button>
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