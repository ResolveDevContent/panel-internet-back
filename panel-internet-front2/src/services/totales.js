import Cookies from 'js-cookie'

export const puntosTotales = (id) => {
  const token = Cookies.get("token");
  return (
    fetch(`http://vps-4375167-x.dattaweb.com/abm/clientes/puntos/${id}`, {
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
    fetch(`http://vps-4375167-x.dattaweb.com/abm/comercios/puntos/${id}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      }
    }).then(res => res.json())
  )
}