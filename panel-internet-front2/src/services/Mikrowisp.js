export const listarFacturas = (body) => {
    console.log(body)
    return (
        fetch(`https://autogestion.winetinternet.com.ar/api/v1/GetInvoices`, {
            method: "POST",
            headers: {
                "𝙰𝚌𝚌𝚎𝚜𝚜-𝙲𝚘𝚗𝚝𝚛𝚘𝚕-𝙰𝚕𝚕𝚘𝚠-𝙾𝚛𝚒𝚐𝚒𝚗": "*",

                "𝙰𝚌𝚌𝚎𝚜𝚜-𝙲𝚘𝚗𝚝𝚛𝚘𝚕-𝙰𝚕𝚕𝚘𝚠-𝙷𝚎𝚊𝚍𝚎𝚛𝚜": "𝙲𝚘𝚗𝚝𝚎𝚗𝚝-𝚃𝚢𝚙𝚎, 𝙰𝚞𝚝𝚑𝚘𝚛𝚒𝚣𝚊𝚝𝚒𝚘𝚗" ,
                
                "𝙰𝚌𝚌𝚎𝚜𝚜-𝙲𝚘𝚗𝚝𝚛𝚘𝚕-𝙰𝚕𝚕𝚘𝚠-𝙼𝚎𝚝𝚑𝚘𝚍𝚜": "𝙶𝙴𝚃,𝙷𝙴𝙰𝙳,𝙿𝙾𝚂𝚃,𝙾𝙿𝚃𝙸𝙾𝙽𝚂,𝙿𝚄𝚃,𝙵𝙴𝚃𝙲𝙷,𝙿𝚛𝚎𝚏𝚕𝚒𝚐𝚑𝚝"
                
            },
            body: JSON.stringify(body)
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
                "Access-Control-Allow-Headers" : "Content-Type",
                "Access-Control-Allow-Origin": "*",
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        })
        .then((res) => res.json())
        .catch((err) => console.log(err))
    )
}