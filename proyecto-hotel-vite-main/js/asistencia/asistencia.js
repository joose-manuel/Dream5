
import { hotelApi } from "../api";

const formatDate = (dateString = "") => {
    return dateString.split("T").shift()
};

const formatTime = (dateTimeString) => {
    if (dateTimeString) {
        const fechaHora = new Date(dateTimeString);
        const zonaHorariaColombia = 'America/Bogota';
        fechaHora.toLocaleString('es-CO', { timeZone: zonaHorariaColombia });
        const horaColombia = fechaHora.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
        return horaColombia;
    } else {
        return "";
    }
};

const transcurrido =(llegada, salida) => {
    if (salida) {
        const llegadaPR = new Date(llegada);
        const salidaPR = new Date(salida);
        const resta = salidaPR-llegadaPR;
        const horas = Math.floor(resta/3600000);
        const minutos = Math.floor(resta % 3600000/60000)
        return (horas+"h "+minutos+"m")
    }
};

const getAssistence = async () => {
    try {
        const response = await hotelApi.get('assistance?');
        const assistanceList = response.data.data.assistances || [];
        const tableBody = document.getElementById('table-body-assistance');
        tableBody.innerHTML = '';
        if (response) {
            for (const assistances of assistanceList) {
                const row = document.createElement("tr");
                row.innerHTML = `
                <td>${assistances.userId || ""}</td>
                <td>${assistances.user ? assistances.user.name : ""}</td>
                <td>${assistances.user ? assistances.user.ficha : ""}</td>
                <td>${formatDate(assistances.loginDate) || ""}</td>
                <td>${formatTime(assistances.loginDate) || ""}</td>
                <td>${formatTime(assistances.logoutDate) || ""}</td>
                <td>${transcurrido(assistances.loginDate,assistances.logoutDate) || ""}</td>
                `;
                tableBody.appendChild(row);
            }
        } else {
            console.log("error en if");
        }
    } catch (error) {
        console.error("Error al obtener las entradas:", error);
    }
};

window.addEventListener("load", getAssistence);