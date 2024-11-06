import { useState } from "react"
import { importarCSV } from "../services/abm"
import { useNavigate } from "react-router-dom"
import { ListTemplate } from "../templates/ListTemplate"

export const ImportCsv = ({titulo, user = {}}) => {
    const [ fileName, setFileName ] = useState("")
    const [ csvFile, setCsvFile ] = useState()
    const [ idZona, setIdZona ] = useState()
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

        const form = evt.target
        const formData = new FormData(form)
        for(let [name, value] of formData) {
            if(name == "ID_Zona") {
                setIdZona(value)
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

                obj.zona = idZona;
                result.push(obj);
            }

            const filteredData = filterKeys(result, 'Id', 'Codigo', 'Nombre', 'Apellido', 'Direccion Principal', 'Email', 'zona');
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

    function filterKeys(array, key1, key2, key3, key4, key5, key6, key7) {
        return array.map(item => {
            return {
                [key1]: item[key1],
                [key2]: item[key2],
                [key3]: item[key3],
                [key4]: item[key4],
                [key5]: item[key5],
                [key5]: item[key6],
                [key5]: item[key7]
            };
        });
    }
    
    return (
        <article id="form" className="mt-3 agregar-cliente">
            <strong className="p-3 text-capitalize">{titulo} - {"Agregar"}</strong>

            <form className="card mt-3" onSubmit={handlesubmit}>
                <ul>
                    <ListTemplate titulo="zona" data={{nombre: 'ID_Zona', placeholder: 'zonas', tipo: 'radio', lista: false}} user={user} />
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