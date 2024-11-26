export const listarFacturas = (body) => {
    return (
        fetch(`https://autogestion.winetinternet.com.ar`, {
            method: "GET",
            headers: {
                "Access-Control-Allow-Headers" : "Content-Type",
                "Access-Control-Allow-Origin": "*",
                'Content-Type': 'application/json',
            }
        })
        .then((res) => res.json())
        .catch((err) => console.log(err))
    )
}

export const pagarFacturas = (body) => {
    return (
        fetch(`https://autogestion.winetinternet.com.ar/api/v1/PaidInvoice`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        })
        .then((res) => res.json())
        .catch((err) => console.log(err))
    )
}