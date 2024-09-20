import { hotelApi } from "../api";

/**
 * @param {string} selector - Selector CSS para el elemento a seleccionar.
 * @returns {HTMLElement | null} - El elemento seleccionado o null si no se encontró ningún elemento.
 */

const $ = (element) => document.querySelector(element);

const $alertError = $("#register-alert-error");
const $alertOk = $("#register-alert-ok");

const $passInput = $(".form-password");
const $documentInput = $(".documento-form");
const $emailInput = $(".email-input");
const $fichaInput = $(".ficha-input");

$("#btn-registrar").addEventListener("click", async (e = event) => {
  e.preventDefault();
  let regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if ($passInput.value.length < 10) {
    alert("la contraseña debe tener minimo 10 caracteres");
    $passInput.focus()
    return;
  }

  if ($documentInput.value.length < 8) {
    alert("la documento debe tener minimo 8 caracteres");
    $documentInput.focus()
    return;
  }

  if ($fichaInput.value.length < 7) {
    alert("la ficha debe tener minimo 7 caracteres");
    $fichaInput.focus()
    return;
  }

  // Comprobar si el correo coincide con la expresión regular
  if (regexEmail.test($emailInput.textContent)) {
    alert("correo incorrecto");
    $emailInput.focus()
    return ;  
  } 
  const form = Object.fromEntries(new FormData(e.target.form));
  try {
    const user = await hotelApi.post("users", { ...form, role: "aprendiz" });
    console.log("🚀 ~ file: auth.js:17 ~ $ ~ user:", user);
    $alertError.classList.add("ocultar");
    $alertOk.classList.remove("ocultar");
  } catch (error) {
    console.log(error);
    $alertOk.classList.add("ocultar");
    return $alertError.classList.remove("ocultar");
  }
});
