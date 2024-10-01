import { useEffect, useState } from "react"
import { listBackups, makeBackup, restoreBackup } from "../services/abm"

export const Backups = () => {
    const [backups, setBackups] = useState([])
    const [loading, setLoading] = useState(false)
    const [ state, setState ] = useState({
        text: "",
        res: ""
    })

    const makeBackups = () => {
        makeBackup()
    }

    const restaurarBackup = (file) => {
        restoreBackup(file)
    }
    
    useEffect(() => {
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
    }, [])

    return (
        <div>
            <button onClick={makeBackups}>Hacer backup</button>
            <ul>
                {backups.map((backup, idx) => (
                    <li key={idx}>
                        <span>{backup}</span>
                        <button onClick={() => restaurarBackup(backup)}>Restaurar</button>
                    </li>
                ))}
            </ul>
        </div>
    )
}