import { useEffect, useState } from "react"
import { listBackups, makeBackup, restoreBackup } from "../services/abm"
import '../assets/css/panel.css'
import { Loading } from "./Loading"

export const Backups = () => {
    const [backups, setBackups] = useState([])
    const [loading, setLoading] = useState(false)
    const [ state, setState ] = useState({
        text: "",
        res: ""
    })
    const [update, setUpdate] = useState(null)

    const makeBackups = () => {
        setLoading(true)

        makeBackup()
        .then(data => {
            if(data.error) {
                setState({text: data.error, res: "secondary"})
                setLoading(false)
                return
            }

            setLoading(false)
            setState({text: data.message, res: "primary"})
            setUpdate(Date.now())
        })
    }

    const restaurarBackup = (file) => {
        setLoading(true)

        restoreBackup(file)
        .then(data => {
            if(data.error) {
                setState({text: data.error, res: "secondary"})
                setLoading(false)
                return
            }

            setLoading(false)
            setState({text: data.message, res: "primary"})
        })
    }
    
    useEffect(() => {
        setLoading(true)
        listBackups().then(datos => {
            console.log(datos)
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
                            <button onClick={() => restaurarBackup(backup)}>Restaurar</button>
                        </li>
                    ))}
                </ul>
            </article>
        </>
    )
}