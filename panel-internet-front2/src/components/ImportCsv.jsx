import { useRef, useState } from "react"
import { agregar } from "../services/abm"
import { useNavigate } from "react-router-dom"

export const ImportCsv = ({titulo}) => {
    const [ fileName, setFileName ] = useState("")
    const [ csvFile, setCsvFile ] = useState()
    const [ state, setState ] = useState({
        text: "",
        res: ""
    })
    const [ loading, setLoading ] = useState(false)
    const navigate = useNavigate()

    const change = (e) => {
        setCsvFile(e.target.files[0])
        if(e.target.files[0] && e.target.files[0].name) {
            setFileName(e.target.files[0].name)
        }
    }
  
    const handlesubmit = (e) => {
        e.preventDefault();
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

                result.push(obj);
            }

            const filteredData = filterKeys(result, 'Id', 'Codigo', 'Nombre', 'Direccion Principal', 'Telefono');
            console.log(filteredData)
            agregar(titulo, filteredData)
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

    function filterKeys(array, key1, key2, key3, key4, key5) {
        return array.map(item => {
            return {
                [key1]: item[key1],
                [key2]: item[key2],
                [key3]: item[key3],
                [key4]: item[key4],
                [key5]: item[key5],

            };
        });
    }
    
    return (
        <article id="form" className="mt-3 agregar-cliente">
            <strong className="p-3 text-capitalize">{titulo} - {"Agregar"}</strong>

            <form className="card mt-3" onSubmit={handlesubmit}>
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