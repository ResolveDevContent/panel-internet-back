import Cookies from 'js-cookie'

export const listar = (model) => {
    const token = Cookies.get("token");
    return (
        fetch(`http://vps-4375167-x.dattaweb.com/abm/${model}/listar`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
            }
        })
        .then((res) => res.json())
        .catch((err) => console.log(err))
    )
}

export const listarUno = (model, id) => {
    const token = Cookies.get("token");
    return (
        fetch(`http://vps-4375167-x.dattaweb.com/abm/${model}/listar/${id}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
            }
        })
        .then((res) => res.json())
        .catch((err) => console.log(err))
    )
}

export const listarByComercio = (model, id) => {
    const token = Cookies.get("token");
    return (
        fetch(`http://vps-4375167-x.dattaweb.com/abm/${model}/listar/comercio/${id}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
            }
        })
        .then((res) => res.json())
        .catch((err) => console.log(err))
    )
}

export const listarByAdmin = (model, email) => {
    const token = Cookies.get("token");
    return (
        fetch(`http://vps-4375167-x.dattaweb.com/abm/${model}/listar/admin/${email}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
            }
        })
        .then((res) => res.json())
        .catch((err) => console.log(err))
    )
}

export const listarByAdminAndParam = (model, email, param) => {
    const token = Cookies.get("token");
    return (
        fetch(`http://vps-4375167-x.dattaweb.com/abm/${model}/listar/admin/${email}/${param}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
            }
        })
        .then((res) => res.json())
        .catch((err) => console.log(err))
    )
}

export const listarByEmail = (model, email) => {
    const token = Cookies.get("token");
    return (
        fetch(`http://vps-4375167-x.dattaweb.com/abm/${model}/listarByEmail/${email}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
            }
        })
        .then((res) => res.json())
        .catch((err) => console.log(err))
    )
}

export const importarCSV = (model, body) => {
    const token = Cookies.get("token");
    return (
        fetch(`http://vps-4375167-x.dattaweb.com/abm/${model}/importarcsv`, {
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

export const agregar = (model, body) => {
    const token = Cookies.get("token");
    return (
        fetch(`http://vps-4375167-x.dattaweb.com/abm/${model}/agregar`, {
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

export const modificar = (model, id, body) => {
    const token = Cookies.get("token");
    return (
        fetch(`http://vps-4375167-x.dattaweb.com/abm/${model}/modificar/${id}`, {
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

export const borrar = (model, id) => {
    const token = Cookies.get("token");
    return(
        fetch(`http://vps-4375167-x.dattaweb.com/abm/${model}/borrar/${id}`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`,
            },
        })
        .then((res) => res.json())
        .catch((err) => console.log(err))
    )
}

export const makeBackup = () => {
    const token = Cookies.get("token");
    return(
        fetch(`http://vps-4375167-x.dattaweb.com/abm/backup`, {
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

export const listBackups = () => {
    const token = Cookies.get("token");
    return(
        fetch(`http://vps-4375167-x.dattaweb.com/abm/backups`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        })
        .then((res) => res.json())
        .catch((err) => console.log(err))
    )
}

export const restoreBackup = (body) => {
    const token = Cookies.get("token");
    return(
        fetch(`http://vps-4375167-x.dattaweb.com/abm/restore`, {
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