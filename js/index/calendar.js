import { Calendar } from "fullcalendar";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { hotelApi } from "../api.js";

import bootstrap5Plugin from "@fullcalendar/bootstrap5";
const getReservations = async () => {
  const { data } = await hotelApi.get("reservations/?limit=100", {
    params: { state: "checkIn" },
  });

  return data.data.reservation.map((el) => {
    const color = el.state === "checkIn" ? "#FFA67D" : "#F2D20C";
    const host = el.host.name;
    const dateIn = el.dateEntry;
    const dateExit = new Date(el.dateOutput);


    return {
      title: "🧙‍♂️ room " + el.roomNumber + " - " + host,
      start: dateIn,
      end: dateExit,
      color,
      description: `
        <b>codigo reserva :  ${el.id} </b>
        <hr/>
        documento: ${el.host.document}
        <br/>
        nombre: ${el.host.name} 
        <br/>
        tel: ${el.host.numberPhone} 
        <br/>
        email: ${el.host.email} 
      `,
      category: "Presentación",
    };
  });
};

document.addEventListener("DOMContentLoaded", async function () {
  const calendarEl = document.getElementById("calendar");

  
  let eventModal = new bootstrap.Modal(document.getElementById("eventModal"), {
    // backdrop: "static",
    // keyboard: false,
  });

  let eventModalLabel = document.getElementById("eventModalLabel");
  let eventModalBody = document.getElementById("eventModalBody");

  const calendar = new Calendar(calendarEl, {
    plugins: [bootstrap5Plugin],
    initialView: "dayGridMonth",
    themeSystem: "bootstrap5",
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
    },
    events: await getReservations(),
    timeZone: "UTC",
    locale: "es",
    displayEventTime: false,
    eventClick: function (info) {
      eventModalLabel.textContent = info.event.title;
      eventModalBody.innerHTML = info.event.extendedProps.description;
      eventModal.show();
    },
    eventMouseEnter: function(info) {
      var eventElement = info.el;
      eventElement.style.cursor = 'pointer'; // Cambia el cursor
    },
  });

  calendar.render();
});
