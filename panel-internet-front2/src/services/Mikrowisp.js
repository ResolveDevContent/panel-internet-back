export const listarFacturas = (token, body) => {
    return (
        fetch(`https://private-anon-26a6f2b941-mikrowisp.apiary-mock.com/api/v1/GetInvoices`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
        .then((res) => res.json())
        .catch((err) => console.log(err))
    )
}

export const pagarFacturas = (token, body) => {
    return (
        fetch(`https://private-anon-26a6f2b941-mikrowisp.apiary-mock.com/api/v1/PaidInvoice`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
        .then((res) => res.json())
        .catch((err) => console.log(err))
    )
}