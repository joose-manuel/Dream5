import { hotelApi } from "../api";

function obtenerNombreMesAbreviado(numeroMes) {
    const nombresMeses = [
        "ENE", "FEB", "MAR", "ABR", "MAY", "JUN",
        "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"
    ];
    return nombresMeses[numeroMes];
}

async function getRegistros() {
    const response = await hotelApi.get("registers");
    const registers = response.data.data.registers;
    const tablaTotales = {};
    if (response) {
        registers.forEach(register => {
            const fecha = new Date(register.createdAt);
            const mes = fecha.getUTCMonth();
            const año = fecha.getUTCFullYear();
            const mesAño = `${mes + 1}-${año}`;
            const ocupantes = (register.companions.length) + 1;
            const dias = register.daysReserved;
            const descuento = register.discount;
            let tarifa;
            const opcionTarifa = register.priceSelected;
            if (opcionTarifa === "regular") {
                tarifa = register.regularPrice;
            } else {
                tarifa = register.executivePrice;
            }
            const totalProductos = register.totalProducts;
            if (!tablaTotales[mesAño]) {
                tablaTotales[mesAño] = {
                    mes: mes,
                    año: año,
                    totalGanancia: 0,
                    gananciaProducto: 0,
                    gananciaFinal:0,
                    numeroReservas:0,
                    totalDias:0
                };
            } else {
                console.log("genial, ya existe");
            }
            const gananciaEstadia = ((tarifa * ocupantes * dias) - 
                ((tarifa * ocupantes * dias) * (descuento / 100)));
            tablaTotales[mesAño].totalGanancia += gananciaEstadia;
            tablaTotales[mesAño].gananciaProducto += totalProductos;
            tablaTotales[mesAño].gananciaFinal += (gananciaEstadia+totalProductos);
            tablaTotales[mesAño].numeroReservas += 1;
            tablaTotales[mesAño].totalDias += dias;
            tablaTotales[mesAño].promedioDiasReservados = tablaTotales[mesAño].totalDias / tablaTotales[mesAño].numeroReservas;
        });
        return tablaTotales;
    } else {
        console.log("no se recibio respuesta");
    }
}

window.addEventListener("load", async () => {
    const tablaTotales = await getRegistros();
    const cuerpoTabla = document.getElementById("table-body-consolidado");
    Object.keys(tablaTotales).forEach(mesAño => {
        const fila = document.createElement("tr");
        // Agrega las celdas con los datos correspondientes
        const datos = tablaTotales[mesAño];
        const nombreMesAbreviado = obtenerNombreMesAbreviado(datos.mes);
        fila.innerHTML = `
            <td>${nombreMesAbreviado}-${datos.año}</td>
            <td>${datos.numeroReservas}</td>
            <td>${Math.round(datos.promedioDiasReservados)}</td>
            <td>${Math.round(datos.totalGanancia)}</td>
            <td>${Math.round(datos.gananciaProducto)}</td>
            <td>${Math.round(datos.gananciaFinal)}</td>
        `;

        // Agrega la fila al cuerpo de la tabla
        cuerpoTabla.appendChild(fila);
    });
});

window.addEventListener("load", async () => {
    const tablaTotales = await getRegistros();
    const orden = Object.keys(tablaTotales).sort((a, b) => {
        const [mesA, añoA] = a.split('-');
        const [mesB, añoB] = b.split('-');
        return new Date(`${añoA}-${mesA}`) - new Date(`${añoB}-${mesB}`);
    });
    const ctx = document.getElementById("ganancias").getContext("2d");
    const ganancias = new Chart(ctx, {
        type: "line",
        data: {
            labels: orden,
            datasets: [
                {
                    label: "Ganancias Mensuales por Estadia",
                    data: orden.map(mesAño => tablaTotales[mesAño].totalGanancia),
                    backgroundColor: "rgb(57, 169, 0)",
                    borderColor:"rgb(57, 169, 0,0.4)",
                    borderWidth: 2
                },
                {
                    label: "Ganancias Mensuales por Productos",
                    data: orden.map(mesAño => tablaTotales[mesAño].gananciaProducto),
                    backgroundColor: "rgb(0, 67, 169)",
                    borderColor:"rgb(0, 67, 169,0.4)",
                    borderWidth: 2
                },
                {
                    label: "Ganancias Totales Mensuales",
                    data: orden.map(mesAño => tablaTotales[mesAño].gananciaFinal),
                    backgroundColor: "rgb(0, 150, 255)",
                    borderColor:"rgb(0, 150, 255,0.4)",
                    borderWidth: 2
                }
            ]
        },
    });
});
