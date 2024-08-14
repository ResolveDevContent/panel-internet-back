
function calcularPuntos(porcentaje, monto) {
    let puntos = 0;

    porcentaje = Number(porcentaje);
    monto = Number(monto);

    puntos = porcentaje / 100
    puntos = puntos * monto

    return puntos
}

module.exports = { calcularPuntos };