const deleteRecordMikrowisp = async (body) => {
  try {
    return (
      fetch(`https://autogestion.winetinternet.com.ar/api/v1/DeleteTransaccion`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
      })
      .then((res) => {
        return {message: "Se elimino correctamente"}
      })
      .catch((err) => {
        return {error: "Ha ocurrido un error en la API de Mikorwisp."}
      })
    )
  } catch (err) {
    return ({error: "Ha ocurrido un error en la API de Mikorwisp."})
  }
}

module.exports = {
  deleteRecordMikrowisp
}