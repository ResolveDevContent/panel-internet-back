import { useEffect, useState } from "react"
import { listBackups, makeBackup, restoreBackup } from "../services/abm"
import '../assets/css/panel.css'
import { Loading } from "./Loading"
import { Modal } from "./Modal"
import { Toast } from "./Toast"

export const Backups = () => {
    const [backups, setBackups] = useState([])
    const [loading, setLoading] = useState(false)
    const [ state, setState ] = useState({
        text: "",
        res: ""
    })
    const [update, setUpdate] = useState(null)
    const [ modalState, setModalState ] = useState({
        open: false,
        backup: ""
    })

    const makeBackups = () => {
        setLoading(true)

        makeBackup()
        .then(data => {
            if(data.error) {
                setState({text: data.error, res: "secondary"})
                setLoading(false)
                setTimeout(() => {
                    setState({text: "", res: ""})
                }, 4000)
                return
            }

            setLoading(false)
            setState({text: data.message, res: "primary"})
            setUpdate(Date.now())
            setTimeout(() => {
                setState({text: "", res: ""})
            }, 4000)
        })
    }

    const restaurarBackup = (file) => {
        setLoading(true)

        restoreBackup(file)
        .then(data => {
            if(data.error) {
                setState({text: data.error, res: "secondary"})
                setLoading(false)
                setTimeout(() => {
                    setState({text: "", res: ""})
                }, 4000)
                return
            }

            setLoading(false)
            setState({text: data.message, res: "primary"})
            setModalState({open: false})

            setTimeout(() => {
                setState({text: "", res: ""})
            }, 4000)
        })
    }
    
    useEffect(() => {
        setLoading(true)
        listBackups().then(datos => {
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

            if(!datos || datos.length == 0) {
                setLoading(false);
                setBackups([])
                return;
            }
            
            setLoading(false);
            setBackups(datos);
        })
    }, [update])

    return (
        <>
            {loading 
                ? <div className="form-loading">
                    <Loading />
                </div>
                :null
            }
            <article className='d-flex flex-column w-100 h-100 mt-1 backups'>
                <strong className='p-3 text-capitalize'>Backups - listado</strong>
                <button onClick={makeBackups} className="makebackups">Hacer backup</button>
                <ul className="list-backups">
                    {backups.map((backup, idx) => (
                        <li key={idx}>
                            <span>{backup}</span>
                            <button onClick={() => setModalState({open: !modalState.open, backup: backup})}>Restaurar</button>
                        </li>
                    ))}
                </ul>
            {modalState.open ? (
                <Modal show={"show"} titulo={`Restaurar`} texto={"¿Estás seguro que deseas restaurar a este backup?"}>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={() => setModalState({open: false, id: ""})}>Cerrar</button>
                        <button type="button" className="btn btn-primary" onClick={() => restaurarBackup(modalState.backup)}>Aceptar</button>
                    </div>
                </Modal>
            ) : null}
            { state.text ? <Toast texto={state.text} res={state.res} /> : null }
            </article>
        </>
    )
}