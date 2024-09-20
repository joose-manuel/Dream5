import {$} from '../utils/functions'

const $sidebar = $('#sidebar')

/**
 * todo: falta class active para los liks
 */

$sidebar.innerHTML = /*html*/ `
  <a href="#" class="brand"><i class="bx icon "></i></a>
  <ul class="side-menu">
    <li class="divider" data-text="main">Main</li>

    <li>
      <a href="index.html"><i class="bx bxs-calendar icon"></i>Inicio</a>
    </li>

    <li>
      <a href="reservas.html"><i class="bx bxs-calendar-check icon"></i>Reservar</a>
    </li>

    <li>
      <a href="checkIn.html"><i class="bx bxs-widget icon"></i>Check In</a>
    </li>

    <li>
      <a href="estadia.html"><i class="bx bxs-home-circle icon"></i>Estadia</a>
    </li>

    <li>
      <a href="tareas.html"><i class="bx bxs-check-square  icon"></i>Tareas</a>
    </li>

    <li>
      <a href="Asistencia.html"><i class="bx bxs-time  icon"></i>Asistencia</a>
    </li>

    <li>
      <a href="administracion.html"><i class="bx bxs-chart  icon"></i>Administracion</a>
    </li>
  </ul>
`

// SIDEBAR DROPDOWN
const allDropdown = document.querySelectorAll('#sidebar .side-dropdown')
const sidebar = document.getElementById('sidebar')
allDropdown.forEach((item) => {
  const a = item.parentElement.querySelector('a:first-child')
  a.addEventListener('click', function (e) {
    e.preventDefault()

    if (!this.classList.contains('active')) {
      allDropdown.forEach((i) => {
        const aLink = i.parentElement.querySelector('a:first-child')

        aLink.classList.remove('active')
        i.classList.remove('show')
      })
    }

    this.classList.toggle('active')
    item.classList.toggle('show')
  })
})
// SIDEBAR COLLAPSE
const toggleSidebar = document.querySelector('nav .toggle-sidebar')
const allSideDivider = document.querySelectorAll('#sidebar .divider')

if (sidebar.classList.contains('hide')) {
  allSideDivider.forEach((item) => {
    item.textContent = '-'
  })
  allDropdown.forEach((item) => {
    const a = item.parentElement.querySelector('a:first-child')
    a.classList.remove('active')
    item.classList.remove('show')
  })
} else {
  allSideDivider.forEach((item) => {
    item.textContent = item.dataset.text
  })
}

toggleSidebar.addEventListener('click', function () {
  // sidebar.classList.toggle("hide");

  if (sidebar.classList.contains('hide')) {
    allSideDivider.forEach((item) => {
      item.textContent = '-'
    })

    allDropdown.forEach((item) => {
      const a = item.parentElement.querySelector('a:first-child')
      a.classList.remove('active')
      item.classList.remove('show')
    })
  } else {
    allSideDivider.forEach((item) => {
      item.textContent = item.dataset.text
    })
  }
})

sidebar.addEventListener('mouseleave', function () {
  if (this.classList.contains('hide')) {
    allDropdown.forEach((item) => {
      const a = item.parentElement.querySelector('a:first-child')
      a.classList.remove('active')
      item.classList.remove('show')
    })
    allSideDivider.forEach((item) => {
      item.textContent = '-'
    })
  }
})

sidebar.addEventListener('mouseenter', function () {
  if (this.classList.contains('hide')) {
    allDropdown.forEach((item) => {
      const a = item.parentElement.querySelector('a:first-child')
      a.classList.remove('active')
      item.classList.remove('show')
    })
    allSideDivider.forEach((item) => {
      item.textContent = item.dataset.text
    })
  }
})

// PROFILE DROPDOWN
const profile = document.querySelector('nav .profile')
const imgProfile = profile.querySelector('img')
const dropdownProfile = profile.querySelector('.profile-link')
imgProfile.addEventListener('click', function () {
  dropdownProfile.classList.toggle('show')
})

// MENU
const allMenu = document.querySelectorAll('main .content-data .head .menu')
allMenu.forEach((item) => {
  const icon = item.querySelector('.icon')
  const menuLink = item.querySelector('.menu-link')

  icon.addEventListener('click', function () {
    menuLink.classList.toggle('show')
  })
})

window.addEventListener('click', function (e) {
  if (e.target !== imgProfile) {
    if (e.target !== dropdownProfile) {
      if (dropdownProfile.classList.contains('show')) {
        dropdownProfile.classList.remove('show')
      }
    }
  }

  allMenu.forEach((item) => {
    const icon = item.querySelector('.icon')
    const menuLink = item.querySelector('.menu-link')

    if (e.target !== icon) {
      if (e.target !== menuLink) {
        if (menuLink.classList.contains('show')) {
          menuLink.classList.remove('show')
        }
      }
    }
  })
})
// PROGRESSBAR
const allProgress = document.querySelectorAll('main .card .progress')
allProgress.forEach((item) => {
  item.style.setProperty('--value', item.dataset.value)
})
