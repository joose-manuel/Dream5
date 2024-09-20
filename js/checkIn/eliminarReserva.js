
import { hotelApi } from "../api";
import { getReservationsCheckIn } from "./getReservas";

// Función para eliminar una reserva
async function deleteReservation(reservationId) {
  try {
    const response = await hotelApi.delete(`reservations/${reservationId}`);
    if (response.status === 200) {
      console.log('Reserva eliminada con éxito');
      getReservationsCheckIn();
    } else {
      console.error('Error al eliminar la reserva');
    }
  } catch (error) {
    console.error('Error al realizar la solicitud DELETE:', error);
  }
}

// Agrega un evento de clic a los botones "Eliminar" dentro de la tabla
document.addEventListener('click', function (event) {
  if (event.target && event.target.classList.contains('btn-danger')) {
    const reservationId = parseInt(event.target.dataset.reservationId);
    if (confirm('¿Estás seguro de que deseas eliminar esta reserva?')) {
      deleteReservation(reservationId);
    }
  }
});
