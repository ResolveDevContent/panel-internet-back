export const listarFacturas = (body) => {
    console.log(body)
    return (
        fetch(`https://autogestion.winetinternet.com.ar/api/v1/GetInvoices`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify(body)
        })
        .then((res) => res.text())
        .catch((err) => console.log(err))
    )
}

export const pagarFacturas = (body) => {
    return (
        fetch(`https://autogestion.winetinternet.com.ar/api/v1/PaidInvoice`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify(body)
        })
        .then((res) => res.json())
        .catch((err) => console.log(err))
    )
}