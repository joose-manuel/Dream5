import {hotelApi} from '../api'
import {$} from '../utils/functions'

const $btnEmail = $('.btn-email')
const $inputEmail = $('.user-email')
const emailForgot = !!localStorage.getItem('email-forgot')

if (emailForgot === true) {
  $btnEmail.classList.add('disabled')
  setTimeout(() => {
    $btnEmail.classList.remove('disabled')
    localStorage.removeItem('email-forgot')
  }, 7000)
}

$btnEmail.addEventListener('click', async (e) => {
  const email = $inputEmail.value
  try {
    $btnEmail.classList.add('disabled')
    localStorage.setItem('email-forgot', true)
    localStorage.setItem('email-reset', email)

    const emailReset = localStorage.getItem('email-reset')
      console.log("🚀 ~ file: forgotPassword.js:24 ~ $btnEmail.addEventListener ~ emailReset:", emailReset)
      
    alert('correo enviado')
    await hotelApi.post('/auth/forgot-password', {
      email,
    })

    setTimeout(() => {
      $btnEmail.classList.remove('disabled')
      localStorage.removeItem('email-forgot')
    }, 7000)
  } catch (error) {
    console.log(
      '🚀 ~ file: forgotPassword.js:16 ~ $btnEmail.addEventListener ~ error:',
      error,
    )
    alert('correo no enviado, correo no existe')
  }
})
