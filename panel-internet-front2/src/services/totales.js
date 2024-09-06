import Cookies from 'js-cookie'

export const puntosTotales = (id) => {
  const token = Cookies.get("token");
  return (
    fetch(`http://localhost:3009/abm/clientes/puntos/${id}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      }
    }).then(res => res.json())
  )
}

export const comercioTotales = (id) => {
  const token = Cookies.get("token");
  return (
    fetch(`http://localhost:3009/abm/comercios/puntos/${id}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      }
    }).then(res => res.json())
  )
}