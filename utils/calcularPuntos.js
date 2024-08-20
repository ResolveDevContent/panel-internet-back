
function calcularPuntos(porcentaje, monto) {
    let puntos = 0;

    porcentaje = Number(porcentaje) / 100;
    monto = Number(monto);

    puntos = puntos * monto

    return puntos
}

module.exports = { calcularPuntos };