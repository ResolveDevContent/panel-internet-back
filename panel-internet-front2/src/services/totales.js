import Cookies from 'js-cookie'

export const puntosTotales = (id) => {
  const token = Cookies.get("token");
  return (
    fetch(`https://panel.winetinternet.com.ar/abm/clientes/puntos/${id}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      }
    }).then(res => res.json())
  )
}