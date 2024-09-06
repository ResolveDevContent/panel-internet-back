import { totales } from "../services/totales"

export function useTotales() {
  const getotales = async () => {
    const doc = await totales()
    if (!doc) return null

    return doc
  }

  return { 
    getotales
  }
} 