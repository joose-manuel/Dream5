import {hotelApi} from '../api'
import {$} from '../utils/functions'

// botones
const $btnSaveHost = $('#btnSaveHost')
const $btnFindHost = $('#btn-find-host')
// Forms
const $formHuesped = $('#datos-huesped')
const $formReserva = $('#formReserva')
// inputs
const $inputInDate = $('#dateEntry')
const $inputExitDate = $('#dateOutput')
// alerts
const $roomsSelect = $('#rooms-select')
const $datesVoidsError = $('#errorAlertDates')

const nowDate = new Date().toISOString().split('T')[0]
$inputExitDate.setAttribute('min', nowDate)
$inputInDate.setAttribute('min', nowDate)

const getRoomsAvailable = async (start, end) => {
  const rooms = await hotelApi.get(
    `rooms/available?date_entry=${start}&date_output=${end}`,
  )
  return rooms
}

const fillRooms = async (e = event) => {
  const inDate = $inputInDate.value
  const outDate = $inputExitDate.value

  if (!!inDate && !!outDate) {
    const {data} = await getRoomsAvailable(inDate, outDate)
    $roomsSelect.innerHTML = ''
    data.data.rooms.forEach((el) => {
      const $option = document.createElement('option')
      $option.value = el.number
      $option.textContent = el.number
      $roomsSelect.appendChild($option)
    })
  }
}

const guardarHuesped = async (e = event) => {
  e.preventDefault()
  try {
    const {document, ...dataForm} = Object.fromEntries(
      new FormData($formHuesped),
    )

    await hotelApi.post('host', {
      ...dataForm,
      document: document.toString(),
    })
    alert('usuario guardado con exito')
  } catch (error) {
    alert('!Error al registrar usuario¡')
  }
}

const errorAlert = $('#errorAlert')
const errorAlertHost = $('#errorAlertHost')

export const reservar = async () => {
  const {document = 0} = Object.fromEntries(new FormData($formHuesped))
  const {numChildrens, numAdults, roomNumber, ...dataReservation} =
    Object.fromEntries(new FormData($formReserva))

  if (new Date($inputInDate.value) > new Date($inputExitDate.value)) {
    errorAlert.classList.remove('ocultar')
    throw new Error('error en las fechas')
  }

  if ($inputInDate.value === '' || $inputExitDate.value === '') {
    $datesVoidsError.classList.remove('ocultar')
    throw new Error('fechas deben estar llenas')
  }

  $datesVoidsError.classList.add('ocultar')
  errorAlert.classList.add('ocultar')

  // Suma 24 horas a la fecha de salida
  const exitDate = new Date($inputExitDate.value)
  exitDate.setHours(exitDate.getHours() + 23, 59, 0, 0)

  try {
    console.log({
      ...dataReservation,
      numChildrens: Number(numChildrens),
      numAdults: Number(numAdults),
      roomNumber: Number(roomNumber),
      hostDocument: document.toString(),
      userId: 1,
      dateOutput: exitDate,
    })

    const res = await hotelApi.post('/reservations', {
      ...dataReservation,
      numChildrens: Number(numChildrens),
      numAdults: Number(numAdults),
      roomNumber: Number(roomNumber),
      hostDocument: document.toString(),
      userId: 1,
      dateOutput: exitDate,
    })
    console.log('🚀 ~ file: dom.js:95 ~ reser ~ res:', res)
  } catch (error) {
    errorAlertHost.classList.remove('ocultar')
    throw new Error('error en el huesped')
  }

  errorAlertHost.classList.add('ocultar')
  await fillRooms()
}

const findHostById = async (e = event) => {
  e.preventDefault()
  const {document: hostDocument} = Object.fromEntries(
    new FormData($formHuesped),
  )

  const {
    data: {data},
  } = await hotelApi.get(`/host/${hostDocument}`)

  $('#email').value = data.host.email
  $('#name').value = data.host.name
  $('#numberPhone').value = data.host.numberPhone
}

$inputExitDate.addEventListener('change', fillRooms)
$inputInDate.addEventListener('change', fillRooms)
$btnSaveHost.addEventListener('click', guardarHuesped)
$btnFindHost.addEventListener('click', findHostById)
