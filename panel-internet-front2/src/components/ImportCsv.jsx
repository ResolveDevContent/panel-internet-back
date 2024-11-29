import { useState, useRef, useMemo, useEffect } from "react"
import { importarCSV } from "../services/abm"
import { useNavigate } from "react-router-dom"
import { ListTemplate } from "../templates/ListTemplate"
import { listar } from "../services/abm"

export const ImportCsv = ({titulo, user = {}}) => {
    const [ fileName, setFileName ] = useState("")
    const [ nombreZona, setNombreZona ] = useState("")
    const [ sortedListado, setSortedListado ] = useState([]);
    const [ csvFile, setCsvFile ] = useState()
    const [ idZona, setIdZona ] = useState()
    const [ state, setState ] = useState({
        text: "",
        res: ""
    })
    const [ loading, setLoading ] = useState(false)
    const navigate = useNavigate()

    const originalListado = useRef([])

    const filteredZona = useMemo(() => {
        setLoading(true)
        const newArr = nombreZona != null && nombreZona.length > 0
        ? originalListado.current.filter(row => {
            return row.zona.toLowerCase().includes(nombreZona.toLowerCase())
        })
        : originalListado.current
  
        setLoading(false)
        setSortedListado(newArr)
    }, [nombreZona])

    const change = (e) => {
        setCsvFile(e.target.files[0])
        if(e.target.files[0] && e.target.files[0].name) {
            setFileName(e.target.files[0].name)
        }
    }
  
    const handlesubmit = (e) => {
        e.preventDefault();

        let zona = "";

        const form = e.target
        const formData = new FormData(form)
        for(let [name, value] of formData) {
            if(name == "ID_Zona") {
                zona = value
            }
        }

        const input = csvFile;
        const reader = new FileReader();
        reader.onload = function(e) {
            const text = e.target.result;
            const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
            const headers = lines[0].split(',').map(header => header.replace(/^"|"$/g, '').trim());
            let result = [];

            for (let i = 1; i < lines.length; i++) {
                const obj = {};
                const currentline = lines[i].split(',').map(value => value.replace(/^"|"$/g, '').trim());

                for (let j = 0; j < headers.length; j++) {
                    if(headers[j] != "" || headers[j] == "Codigo" || headers[j] == "Id") {
                        obj[headers[j]] = currentline[j];
                    }
                }

                obj.zona = Number(zona);
                result.push(obj);
            }
            const filteredData = filterKeys(result, 'Id', 'Codigo', 'dni', 'nombre', 'apellido', 'direccion_principal', 'email', 'zona');
            importarCSV(titulo, filteredData)
            .then(data => {
                if(data.error) {
                    setState({text: data.error, res: "secondary"})
                    setLoading(false)
                    return
                }
                setLoading(false)

                setState({text: data.message, res: "primary"})

                navigate(`/${titulo}/listar`)
            })
        };
        reader.readAsText(input);
    };

    function filterKeys(array, key1, key2, key3, key4, key5, key6, key7, key8) {
        return array.map(item => {
            return {
                [key1]: item[key1],
                [key2]: item[key2],
                [key3]: item[key3],
                [key4]: item[key4],
                [key5]: item[key5],
                [key6]: item[key6],
                [key7]: item[key7],
                [key8]: item[key8]
            };
        });
    } 

    const handleDownload = () => {
        const link = document.createElement("a");
        link.href = "../assets/files/Plantilla.csv";
        link.target = "_blank";
        link.download = "Plantilla.csv";

        link.click();
    };

    useEffect(() => {
        setLoading(true)
  
        const controller = new AbortController();
        const signal = controller.signal;
  
        setSortedListado([])
        originalListado.current = [];
  
        listar("zonas", signal)
        .then(datos => {
            if(!datos || datos.length == 0) {
                setSortedListado([])
                originalListado.current = [];
                return;
            }

            if(datos.error) {
                setState({
                text: "Ha ocurrido un error, intente nuevamente o comuniquese con nosotros", 
                res: "danger"
                })
            }

            setSortedListado(datos)
            originalListado.current = datos;

        })
        .catch(err => {
            setState({
                text: "Ha ocurrido un error, intente nuevamente o comuniquese con nosotros", 
                res: "danger"
            })
        })
        .finally(setLoading(false))
  
        return () => controller.abort()
    }, [])
    
    return (
        <article id="form" className="mt-3 agregar-cliente">
            <strong className="p-3 text-capitalize">{titulo} - {"Agregar"}</strong>

            <div className="mt-1">
                <p>Descarga la plantilla CSV para poder agregar los clientes correctamente</p>
                <button onClick={handleDownload} className="btn btn-success mt-1">Descargar</button>
            </div>

            <form className="card mt-3" onSubmit={handlesubmit}>
                <ul className="card-body">
                    <li className="list-template">
                        <label htmlFor="zona" className="text-capitalize">Zonas</label>
                        <div className='buscador-field'>
                            <input type="text" onChange={e => {
                                setNombreZona(e.target.value)
                            }} placeholder='Nombre zona...' />
                        </div>
                        {sortedListado.length > 0 
                        ? <div className="dropdown-list">
                            {loading 
                            ? <div className="list-loading-container">
                                    <div className="list-loading"></div>
                                </div>
                            : <>
                                <ul>
                                {sortedListado.map((row, idx) => (
                                    <li key={idx}>
                                        <label>
                                            <input type="radio" id={row.ID_Zona} name="ID_Zona" value={row.ID_Zona}/>
                                            <span className="text-ellipsis">{row.zona}</span>
                                        </label>
                                    </li>
                                    )
                                )}
                                </ul>
                            </>
                            }
                            </div>
                        : null}
                    </li>
                </ul>
                <div className="custom-file">
                    <label className="custom-file-label d-flex align-center" htmlFor="input-file">
                        <input type="file" id="input-file" name="input-file" accept=".csv" onChange={change}/>
                        <span>Subir csv</span>
                    </label>
                </div>
                <span className="list-file" >{fileName}</span>
                <button className="btn btn-success">Confirmar</button>
            </form>
        </article>
    )
}