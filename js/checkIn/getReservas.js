import {hotelApi} from '../api'
let endPointReservas = 'reservations?'

const formatDate = (dateString = '') => {
  return dateString.split('T').shift()
}

document
  .getElementById('selectedSearch')
  .addEventListener('change', function () {
    const param = document.getElementById('selectedSearch').value
    if (param === 'Todo') {
      document.getElementById('searchDocument').style.display = 'none'
      document.getElementById('searchDate').style.display = 'none'
    } else if (param === 'Documento') {
      console.log('documento')
      document.getElementById('searchDocument').style.display = 'block'
      document.getElementById('searchDate').style.display = 'none'
    } else if (param === 'Entrada') {
      console.log('Entrada')
      document.getElementById('searchDocument').style.display = 'none'
      document.getElementById('searchDate').style.display = 'block'
    } else {
      console.log('todos')
    }
  })

document
  .getElementById('btnFiltroReservas')
  .addEventListener('click', function () {
    const param = document.getElementById('selectedSearch').value
    //filtro
    if (param === 'Documento') {
      const doc = document.getElementById('searchHostDocument').value
      endPointReservas = 'reservations?hostDocument=' + doc
    } else if (param === 'Entrada') {
      const entrada =
        document.getElementById('searchEntryDate').value + 'T00:00:00.000Z'
      endPointReservas = 'reservations?fechaIngreso=' + entrada
    } else {
      endPointReservas = 'reservations?'
    }
    console.log(endPointReservas)
    getReservationsCheckIn()
  })

export const getReservationsCheckIn = async () => {
  try {
    const response = await hotelApi.get(endPointReservas, {
      params: {
        limit: 10000000000,
      },
    })

    const reservations = response.data.data.reservation || []

    // Obtiene una referencia al cuerpo de la tabla en el HTML
    const tableBody = document.getElementById('table-body-reservations')

    // Limpia cualquier contenido previo en la tabla
    tableBody.innerHTML = ''

    // Itera a través de los datos de las reservas y agrega filas a la tabla
    for (const reservation of reservations) {
      const row = document.createElement('tr')
      row.innerHTML = `
        <td>${reservation.id}</td>
        <td>${reservation.hostDocument}</td>
        <td>${reservation.host ? reservation.host.name : ''}</td>
        <td>${reservation.host ? reservation.host.numberPhone : ''}</td>
        <td>${reservation.roomNumber}</td>
        <td>${formatDate(reservation.dateEntry)}</td>
        <td>${formatDate(reservation.dateOutput)}</td>
        <td>
          <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#reservationDetailsModal" data-reservation-id="${
            reservation.id
          }">Registrar</button>
        </td>
        <td>
          <button class="btn btn-danger delete-reservation" data-reservation-id="${
            reservation.id
          }">Eliminar</button>
        </td>
      `
      tableBody.appendChild(row)
    }
  } catch (error) {
    console.error('Error al obtener las reservas:', error)
  }
}

// Llama a la función para obtener y mostrar las reservas cuando se cargue la página
window.addEventListener('load', getReservationsCheckIn)
