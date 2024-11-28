const deleteRecordMikrowisp = async (body) => {
  try {
    fetch(`https://autogestion.winetinternet.com.ar/api/v1/DeleteTransaccion`, {
          method: "POST",
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(body)
    })
    .then((res) => {
      console.log(res)
      return {message: "Se elimino correctamente"}
    })
    .catch((err) => {
      console.log(err)
      return {error: "Ha ocurrido un error en la API de Mikorwisp."}
    })
  } catch (err) {
    console.log("catch", err)
    return ({error: "Ha ocurrido un error en la API de Mikorwisp."})
  }
}

module.exports = {
  deleteRecordMikrowisp
}