import Cookies from 'js-cookie'

export const listar = (model) => {
    const token = Cookies.get("token");
    return (
        fetch(`http://localhost:3009/abm/${model}/listar`, {
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
        fetch(`http://localhost:3009/abm/${model}/listar/${id}`, {
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
        fetch(`http://localhost:3009/abm/${model}/listar/comercio/${id}`, {
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
        fetch(`http://localhost:3009/abm/${model}/listar/admin/${email}`, {
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
        fetch(`http://localhost:3009/abm/${model}/listar/admin/${email}/${param}`, {
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
        fetch(`http://localhost:3009/abm/${model}/listarByEmail/${email}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
            }
        })
        .then((res) => res.json())
        .catch((err) => console.log(err))
    )
}

export const agregar = (model, body) => {
    const token = Cookies.get("token");
    return (
        fetch(`http://localhost:3009/abm/${model}/agregar`, {
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
        fetch(`http://localhost:3009/abm/${model}/modificar/${id}`, {
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
        fetch(`http://localhost:3009/abm/${model}/borrar/${id}`, {
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