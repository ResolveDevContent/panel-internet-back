import Cookies from 'js-cookie'

export const listar = (model, signal) => {
    const token = Cookies.get("token");
    return (
        fetch(`https://panel.winetinternet.com.ar/abm/${model}/listar`, {
            signal,
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
            }
        })
        .then((res) => res.json())
        .catch((err) => console.log(err))
    )
}

export const listarUno = (model, id, signal) => {
    const token = Cookies.get("token");
    return (
        fetch(`https://panel.winetinternet.com.ar/abm/${model}/listar/${id}`, {
            signal,
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
            }
        })
        .then((res) => res.json())
        .catch((err) => console.log(err))
    )
}

export const listarByZona = (zona, signal) => {
    const token = Cookies.get("token");
    return (
        fetch(`https://panel.winetinternet.com.ar/abm/clientes/listar/zona/${zona}`, {
            signal,
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
            }
        })
        .then((res) => res.json())
        .catch((err) => console.log(err))
    )
}

export const listaZonaByAdmin = (zona, email, signal) => {
    const token = Cookies.get("token");
    return (
        fetch(`https://panel.winetinternet.com.ar/abm/clientes/listar/zona/admin/${email}?zona=${zona}`, {
            signal,
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
            }
        })
        .then((res) => res.json())
        .catch((err) => console.log(err))
    )
}

export const listarByComercio = (model, id, signal) => {
    const token = Cookies.get("token");
    return (
        fetch(`https://panel.winetinternet.com.ar/abm/${model}/listar/comercio/${id}`, {
            signal,
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
            }
        })
        .then((res) => res.json())
        .catch((err) => console.log(err))
    )
}

export const listarByAdmin = (model, email, signal) => {
    const token = Cookies.get("token");
    return (
        fetch(`https://panel.winetinternet.com.ar/abm/${model}/listar/admin/${email}`, {
            signal,
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
            }
        })
        .then((res) => res.json())
        .catch((err) => console.log(err))
    )
}

export const listarByAdminAndParam = (model, email, param, signal) => {
    const token = Cookies.get("token");
    return (
        fetch(`https://panel.winetinternet.com.ar/abm/${model}/listar/admin/${email}/${param}`, {
            signal,
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
            }
        })
        .then((res) => res.json())
        .catch((err) => console.log(err))
    )
}

export const listarByEmail = (model, email, signal) => {
    const token = Cookies.get("token");
    return (
        fetch(`https://panel.winetinternet.com.ar/abm/${model}/listarByEmail/${email}`, {
            signal,
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
            }
        })
        .then((res) => res.json())
        .catch((err) => console.log(err))
    )
}

export const listarByCobrador = (model, email, signal) => {
    const token = Cookies.get("token");
    return (
        fetch(`https://panel.winetinternet.com.ar/abm/${model}/listarByCobrador/${email}`, {
            signal,
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
            }
        })
        .then((res) => res.json())
        .catch((err) => console.log(err))
    )
}

export const importarCSV = (model, body, signal) => {
    const token = Cookies.get("token");
    return (
        fetch(`https://panel.winetinternet.com.ar/abm/${model}/importarcsv`, {
            signal,
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(body)
        })
        .then((res) => res.json())
        .catch((err) => console.log(err))
    )
}

export const agregar = (model, body, signal) => {
    const token = Cookies.get("token");
    return (
        fetch(`https://panel.winetinternet.com.ar/abm/${model}/agregar`, {
            signal,
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(body)
        })
        .then((res) => res.json())
        .catch((err) => console.log(err))
    )
}

export const modificar = (model, id, body, signal) => {
    const token = Cookies.get("token");
    return (
        fetch(`https://panel.winetinternet.com.ar/abm/${model}/modificar/${id}`, {
            signal,
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(body)
        })
        .then((res) => res.json())
        .catch((err) => console.log(err))
    )
}

export const borrar = (model, id, body) => {
    const token = Cookies.get("token");
    return(
        fetch(`https://panel.winetinternet.com.ar/abm/${model}/borrar/${id}`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(body)
        })
        .then((res) => res.json())
        .catch((err) => console.log(err))
    )
}

export const makeBackup = (signal) => {
    const token = Cookies.get("token");
    return(
        fetch(`https://panel.winetinternet.com.ar/abm/backup`, {
            signal,
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`,
            },
        })
        .then((res) => res.json())
        .catch((err) => console.log(err))
    )
}

export const listBackups = (signal) => {
    const token = Cookies.get("token");
    return(
        fetch(`https://panel.winetinternet.com.ar/abm/backups`, {
            signal,
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        })
        .then((res) => res.json())
        .catch((err) => console.log(err))
    )
}

export const restoreBackup = (file, signal) => {
    const token = Cookies.get("token");
    const body = {file: file}
    return(
        fetch(`https://panel.winetinternet.com.ar/abm/restore`, {
            signal,
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(body)
        })
        .then((res) => res.json())
        .catch((err) => console.log(err))
    )
}

export const downloadFile = () => {
    return(
        fetch(`https://panel.winetinternet.com.ar/descargar-archivo`, {
            method: "GET"
        })
        .then((res) => res.blob())
        .catch((err) => console.log(err))
    )
}