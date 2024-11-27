export const deleteRecordMikrowisp = async (body) => {
  try {
    fetch(`https://autogestion.winetinternet.com.ar/api/v1/GetInvoices`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
    })
    .then((res) => ({message: "Se elimino correctamente"}))
    .catch((err) => ({error: "Ha ocurrido un error en la API de Mikorwisp."}))
  } catch (err) {
    return ({error: "Ha ocurrido un error en la API de Mikorwisp."})
  }
}