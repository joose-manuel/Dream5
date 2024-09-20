import { hotelApi } from "../api";
import { getReservationsCheckIn } from "./getReservas";

let registerId;

// Función para abrir el modal y llenar los campos con los datos de la reserva
function openReservationModal(reservationId) {
  const getReservationById = async (reservationId) => {
    const mensajeRegistro = (document.getElementById(
      "mensajeRegistro"
    ).style.display = "none");
    const mensajeHuesped = (document.getElementById(
      "mensajeHuesped"
    ).style.display = "none");
    const divAcompañante = (document.getElementById(
      "divAcompañante"
    ).style.display = "none");
    const mensajeActualizarAcompañante = (document.getElementById(
      "mensajeActualizarAcompañante"
    ).style.display = "none");
    const mensajeGuardadoAcompañante = (document.getElementById(
      "mensajeGuardadoAcompañante"
    ).style.display = "none");
    const acompañante = (document.getElementById("btnAcompañante")
    .style.display = "none")
    try {
      const response = await hotelApi.get(`reservations/${reservationId}`);
      const reservation = response.data.data.reservation || null;

      if (reservation) {
        // Llenar los campos del modal con los datos de la reserva
        document.getElementById("hostDocument").value =
          reservation.host.document || "";
        document.getElementById("hostDocumentType").value =
          reservation.host.document_type || "";
        document.getElementById("hostName").value = reservation.host.name || "";
        document.getElementById("hostBirthdate").value = reservation.host
          .birthdayDate
          ? reservation.host.birthdayDate.substring(0, 10)
          : "";
        document.getElementById("hostPhone").value =
          reservation.host.numberPhone || "";
        document.getElementById("hostEmail").value =
          reservation.host.email || "";
        document.getElementById("hostAddress").value =
          reservation.host.addres || "";
        document.getElementById("hostCity").value = reservation.host.city || "";
        document.getElementById("hostCountry").value =
          reservation.host.country || "";
        document.getElementById("hostOccupation").value =
          reservation.host.occupation || "";
        document.getElementById("hostCompany").value =
          reservation.host.company || "";
        document.getElementById("numReserva").value = reservationId || "";

        document.getElementById("entryDate").value = reservation.dateEntry
          ? reservation.dateEntry.substring(0, 10)
          : "";
        document.getElementById("departureDate").value = reservation.dateOutput
          ? reservation.dateOutput.substring(0, 10)
          : "";

        // Calcular la diferencia en días entre las fechas de entrada y salida
        const entryDate = new Date(reservation.dateEntry);
        const departureDate = new Date(reservation.dateOutput);
        const timeDifference = departureDate.getTime() - entryDate.getTime();
        const nights = Math.ceil(timeDifference / (1000 * 3600 * 24));

        // Establecer el valor del campo "Permanencia" con el número de noches
        document.getElementById("permanence").value = nights.toString();
        document.getElementById("note").value =
          reservation.note || "";
      } else {
        console.log("Reserva no encontrada");
      }
    } catch (error) {
      console.error("Error al buscar la reserva por ID:", error);
    }
  };

  // Llama a la función para obtener y llenar los datos de la reserva
  getReservationById(reservationId);
}

// Agrega un evento de clic a los botones "Opciones" dentro de la tabla
document.addEventListener("click", function (event) {
  if (event.target && event.target.dataset.reservationId) {
    const reservationId = event.target.dataset.reservationId;
    openReservationModal(reservationId);
  }
});

//Boton Modificar
document
  .getElementById("btnHabilitarEdicion")
  .addEventListener("click", function () {
    document.getElementById("hostDocumentType").disabled = false;
    document.getElementById("hostName").disabled = false;
    document.getElementById("hostBirthdate").disabled = false;
    document.getElementById("hostPhone").disabled = false;
    document.getElementById("hostEmail").disabled = false;
    document.getElementById("hostAddress").disabled = false;
    document.getElementById("hostCity").disabled = false;
    document.getElementById("hostCountry").disabled = false;
    document.getElementById("hostOccupation").disabled = false;
    document.getElementById("hostCompany").disabled = false;
    document.getElementById("btnActualizarHuesped").disabled = false;

    //Mensaje de edicion habilitada
    this.innerText = "Edición Habilitada";
  });

//boton Actualizar
document
  .getElementById("btnActualizarHuesped")
  .addEventListener("click", async () => {

    //obtener valores
    const hostDocument = document.getElementById("hostDocument").value;
    const hostDocumentType = document.getElementById("hostDocumentType").value;
    const hostName = document.getElementById("hostName").value;
    const hostBirthdate = document.getElementById("hostBirthdate").value;
    const hostPhone = document.getElementById("hostPhone").value;
    const hostEmail = document.getElementById("hostEmail").value;
    const hostAddress = document.getElementById("hostAddress").value;
    const hostCity = document.getElementById("hostCity").value;
    const hostCountry = document.getElementById("hostCountry").value;
    const hostOccupation = document.getElementById("hostOccupation").value;
    const hostCompany = document.getElementById("hostCompany").value;

    //formatear campos a blanco
    document.getElementById("hostDocumentType").style.backgroundColor = 'white';
    document.getElementById("hostName").style.backgroundColor = 'white';
    document.getElementById("hostBirthdate").style.backgroundColor = 'white';
    document.getElementById("hostPhone").style.backgroundColor = 'white';
    document.getElementById("hostEmail").style.backgroundColor = 'white';
    document.getElementById("hostAddress").style.backgroundColor = 'white';
    document.getElementById("hostCity").style.backgroundColor = 'white';
    document.getElementById("hostCountry").style.backgroundColor = 'white';
    document.getElementById("hostOccupation").style.backgroundColor = 'white';
    document.getElementById("hostCompany").style.backgroundColor = 'white';
    //validar si alguno esta vacio
    if (
      hostDocumentType.trim() === "" ||
      hostName.trim() === "" ||
      hostBirthdate.trim() === "" ||
      hostPhone.trim() === "" ||
      hostEmail.trim() === "" ||
      hostAddress.trim() === "" ||
      hostCity.trim() === "" ||
      hostCountry.trim() === "" ||
      hostOccupation.trim() === "" ||
      hostCompany.trim() === ""
    ) {
      alert("Todos los campos son obligatorios. Por favor, complete los campos faltantes.");
      //pintar los vacios
      if (hostDocumentType.trim() === "") {
        document.getElementById("hostDocumentType").style.backgroundColor = 'lightpink';
      }
      if (hostName.trim() === "") {
        document.getElementById("hostName").style.backgroundColor = 'lightpink';
      }
      if (hostBirthdate.trim() === "") {
        document.getElementById("hostBirthdate").style.backgroundColor = 'lightpink';
      }
      if (hostPhone.trim() === "") {
        document.getElementById("hostPhone").style.backgroundColor = 'lightpink';
      }
      if (hostEmail.trim() === "") {
        document.getElementById("hostEmail").style.backgroundColor = 'lightpink';
      }
      if (hostAddress.trim() === "") {
        document.getElementById("hostAddress").style.backgroundColor = 'lightpink';
      }
      if (hostCity.trim() === "") {
        document.getElementById("hostCity").style.backgroundColor = 'lightpink';
      }
      if (hostCountry.trim() === "") {
        document.getElementById("hostCountry").style.backgroundColor = 'lightpink';
      }
      if (hostOccupation.trim() === "") {
        document.getElementById("hostOccupation").style.backgroundColor = 'lightpink';
      }
      if (hostCompany.trim() === "") {
        document.getElementById("hostCompany").style.backgroundColor = 'lightpink';
      }
    } else {
      const updatedHostData = {
        document_type: hostDocumentType,
        name: hostName,
        birthdayDate: hostBirthdate,
        numberPhone: hostPhone,
        email: hostEmail,
        addres: hostAddress,
        city: hostCity,
        country: hostCountry,
        occupation: hostOccupation,
        company: hostCompany,
      };
      try {
        const response = await hotelApi.put(
          `host/${hostDocument}`,
          updatedHostData
        );
        if (response.status === 200) {
          console.log("Actualizacion exitosa");
          //mensaje
          document.getElementById("mensajeHuesped").style.display = "block";
          //deshabilitar campos
          document.getElementById("hostDocumentType").disabled = true;
          document.getElementById("hostName").disabled = true;
          document.getElementById("hostBirthdate").disabled = true;
          document.getElementById("hostPhone").disabled = true;
          document.getElementById("hostEmail").disabled = true;
          document.getElementById("hostAddress").disabled = true;
          document.getElementById("hostCity").disabled = true;
          document.getElementById("hostCountry").disabled = true;
          document.getElementById("hostOccupation").disabled = true;
          document.getElementById("hostCompany").disabled = true;
          document.getElementById("btnActualizarHuesped").disabled = true;
          //boton modificar
          document.getElementById("btnHabilitarEdicion").innerText = "Modificar";
        } else {
          console.log("Error al actualizar");
        }
      } catch (error) {
        console.error("Error al realizar solicitud PUT:", error);
      }
    };
  });

// Agrega un manejador de eventos al botón "Ingresar"
document.getElementById("btnCheckIn").addEventListener("click", async () => {
  const reservationIdString = document.getElementById("numReserva").value;
  const reservationId = parseInt(reservationIdString, 10);
  const userId = 1; // userID temporal 
  const travel_reason = document.getElementById("motive").value;
  if (travel_reason.trim() === "") {
    alert("elmotivo de viaje es obligatorio");
    document.getElementById("motive").style.backgroundColor = 'lightpink';
  } else {
    try {
      // Realiza una solicitud POST a la base de datos
      const response = await hotelApi.post("registers", {
        userId,
        reservationId,
        travel_reason,
      });

      // Verifica la respuesta y maneja cualquier resultado necesario
      if (response.status === 200) {
        console.log("Solicitud POST exitosa");
        const register = response.data.data.register;
        registerId = register.id;
        //mensaje de post
        const mensajeRegistro = (document.getElementById(
          "mensajeRegistro"
        ).style.display = "block");
        //acompañante
            const acompañante = (document.getElementById("btnAcompañante")
            .style.display = "block")
        getReservationsCheckIn();
      } else {
        console.log("Error en la solicitud POST");
      }
    } catch (error) {
      console.error("Error al realizar la solicitud POST:", error);
    }
  }
});

document.getElementById("btnAcompañante").addEventListener("click", function () {
  document.getElementById("divAcompañante").style.display = "block";
});

document.getElementById("companionDocument").addEventListener("change", getCompanion);

async function getCompanion() {
  try {
    const doc = document.getElementById("companionDocument").value;
    const response = await hotelApi.get(`host/${doc}`);
    const host = response.data.data.host || null;
    if (host) {
      // llenar campos
      const nacimientoAcompañante = new Date(host.birthdayDate).toISOString().split('T')[0];

      document.getElementById("companionName").value = host.name || "";
      document.getElementById("companionBirthdate").value = nacimientoAcompañante || "";
      document.getElementById("companionEmail").value = host.email || "";
      document.getElementById("companionAddress").value = host.addres || "";
      document.getElementById("companionCity").value = host.city || "";
      document.getElementById("companionCountry").value = host.country || "";
      document.getElementById("companionPhone").value = host.numberPhone || "";
      document.getElementById("companionOccupation").value = host.occupation || "";
      document.getElementById("companionCompany").value = host.company || "";
      document.getElementById("companionDocumentType").value = host.document_type || "";
    } else {
      alert("Acompañante desconocido, por favor registrelo");
    }
  } catch (error) {
    console.error("Error en la solicitud de acompañante ", error);
  }
};


document
  .getElementById("btnHabilitarAcompanante")
  .addEventListener("click", function () {
    document.getElementById("companionDocumentType").disabled = false;
    document.getElementById("companionName").disabled = false;
    document.getElementById("companionBirthdate").disabled = false;
    document.getElementById("companionPhone").disabled = false;
    document.getElementById("companionEmail").disabled = false;
    document.getElementById("companionAddress").disabled = false;
    document.getElementById("companionCity").disabled = false;
    document.getElementById("companionCountry").disabled = false;
    document.getElementById("companionOccupation").disabled = false;
    document.getElementById("companionCompany").disabled = false;
    document.getElementById("btnActualizarAcompañante").disabled = false;
    document.getElementById("btnAgregarAcompanante").disabled = false;

    //Mensaje de edicion habilitada
    this.innerText = "Edición Habilitada";
  });

document
  .getElementById("btnAgregarAcompanante")
  .addEventListener("click", async () => {
    //obtener valores
    const doc = document.getElementById("companionDocument").value;
    const document_type = document.getElementById(
      "companionDocumentType"
    ).value;
    const name = document.getElementById("companionName").value;
    const birthdayDate = document.getElementById("companionBirthdate").value;
    const numberPhone = document.getElementById("companionPhone").value;
    const email = document.getElementById("companionEmail").value;
    const addres = document.getElementById("companionAddress").value;
    const city = document.getElementById("companionCity").value;
    const country = document.getElementById("companionCountry").value;
    const occupation = document.getElementById("companionOccupation").value;
    const company = document.getElementById("companionCompany").value;

    //background blanco
    document.getElementById("companionDocument").style.backgroundColor = 'white';
    document.getElementById("companionDocumentType")
      .style.backgroundColor = 'white';
    document.getElementById("companionName").style.backgroundColor = 'white';
    document.getElementById("companionBirthdate").style.backgroundColor = 'white';
    document.getElementById("companionPhone").style.backgroundColor = 'white';
    document.getElementById("companionEmail").style.backgroundColor = 'white';
    document.getElementById("companionAddress").style.backgroundColor = 'white';
    document.getElementById("companionCity").style.backgroundColor = 'white';
    document.getElementById("companionCountry").style.backgroundColor = 'white';
    document.getElementById("companionOccupation").style.backgroundColor = 'white';
    document.getElementById("companionCompany").style.backgroundColor = 'white';

    if (
      doc.trim() === "" ||
      document_type.trim() === "" ||
      name.trim() === "" ||
      birthdayDate.trim() === "" ||
      numberPhone.trim() === "" ||
      email.trim() === "" ||
      addres.trim() === "" ||
      city.trim() === "" ||
      country.trim() === "" ||
      occupation.trim() === "" ||
      company.trim() === ""
    ) {
      alert("Todos los campos son obligatorios");
      if (doc.trim() === "") {
        document.getElementById("companionDocument").style.backgroundColor = 'lightpink';
      }
      if (document_type.trim() === "") {
        document.getElementById("companionDocumentType")
          .style.backgroundColor = 'lightpink';
      }
      if (name.trim() === "") {
        document.getElementById("companionName").style.backgroundColor = 'lightpink';
      }
      if (birthdayDate.trim() === "") {
        document.getElementById("companionBirthdate").style.backgroundColor = 'lightpink';
      }
      if (numberPhone.trim() === "") {
        document.getElementById("companionPhone").style.backgroundColor = 'lightpink';
      }
      if (email.trim() === "") {
        document.getElementById("companionEmail").style.backgroundColor = 'lightpink';
      }
      if (addres.trim() === "") {
        document.getElementById("companionAddress").style.backgroundColor = 'lightpink';
      }
      if (city.trim() === "") {
        document.getElementById("companionCity").style.backgroundColor = 'lightpink';
      }
      if (country.trim() === "") {
        document.getElementById("companionCountry").style.backgroundColor = 'lightpink';
      }
      if (occupation.trim() === "") {
        document.getElementById("companionOccupation").style.backgroundColor = 'lightpink';
      }
      if (company.trim() === "") {
        document.getElementById("companionCompany").style.backgroundColor = 'lightpink';
      }
    } else {
      const saveCompanion = {
        document: doc,
        document_type,
        name,
        birthdayDate,
        numberPhone,
        email,
        addres,
        city,
        country,
        occupation,
        company,
      };

      try {
        const response = await hotelApi.post("host", saveCompanion);
        if (response.status === 200) {
          console.log("Registro guardado con exito");
          const mensajeGuardadoAcompañante = (document.getElementById(
            "mensajeGuardadoAcompañante"
          ).style.display = "block");

          document.getElementById("companionDocumentType").disabled = true;
          document.getElementById("companionName").disabled = true;
          document.getElementById("companionBirthdate").disabled = true;
          document.getElementById("companionPhone").disabled = true;
          document.getElementById("companionEmail").disabled = true;
          document.getElementById("companionAddress").disabled = true;
          document.getElementById("companionCity").disabled = true;
          document.getElementById("companionCountry").disabled = true;
          document.getElementById("companionOccupation").disabled = true;
          document.getElementById("companionCompany").disabled = true;
          document.getElementById("btnActualizarAcompañante").disabled = true;
          document.getElementById("btnAgregarAcompanante").disabled = true;

          document.getElementById("btnHabilitarAcompanante").innerText = "Modificar";
        } else {
          console.error("Error en la solicitud POST");
        }
      } catch (error) {
        console.error("Error al realizar la solicitud POST:", error);
      }
    }
  });

document
  .getElementById("btnActualizarAcompañante")
  .addEventListener("click", async () => {
    //obtener datos
    const doc = document.getElementById("companionDocument").value;
    const document_type = document.getElementById(
      "companionDocumentType"
    ).value;
    const name = document.getElementById("companionName").value;
    const birthdayDate = document.getElementById("companionBirthdate").value;
    const numberPhone = document.getElementById("companionPhone").value;
    const email = document.getElementById("companionEmail").value;
    const addres = document.getElementById("companionAddress").value;
    const city = document.getElementById("companionCity").value;
    const country = document.getElementById("companionCountry").value;
    const occupation = document.getElementById("companionOccupation").value;
    const company = document.getElementById("companionCompany").value;

    //background blanco
    document.getElementById("companionDocument").style.backgroundColor = 'white';
    document.getElementById("companionDocumentType")
      .style.backgroundColor = 'white';
    document.getElementById("companionName").style.backgroundColor = 'white';
    document.getElementById("companionBirthdate").style.backgroundColor = 'white';
    document.getElementById("companionPhone").style.backgroundColor = 'white';
    document.getElementById("companionEmail").style.backgroundColor = 'white';
    document.getElementById("companionAddress").style.backgroundColor = 'white';
    document.getElementById("companionCity").style.backgroundColor = 'white';
    document.getElementById("companionCountry").style.backgroundColor = 'white';
    document.getElementById("companionOccupation").style.backgroundColor = 'white';
    document.getElementById("companionCompany").style.backgroundColor = 'white';

    if (
      doc.trim() === "" ||
      document_type.trim() === "" ||
      name.trim() === "" ||
      birthdayDate.trim() === "" ||
      numberPhone.trim() === "" ||
      email.trim() === "" ||
      addres.trim() === "" ||
      city.trim() === "" ||
      country.trim() === "" ||
      occupation.trim() === "" ||
      company.trim() === ""
    ) {
      alert("Todos los campos son obligatorios");
      if (doc.trim() === "") {
        document.getElementById("companionDocument").style.backgroundColor = 'lightpink';
      }
      if (document_type.trim() === "") {
        document.getElementById("companionDocumentType")
          .style.backgroundColor = 'lightpink';
      }
      if (name.trim() === "") {
        document.getElementById("companionName").style.backgroundColor = 'lightpink';
      }
      if (birthdayDate.trim() === "") {
        document.getElementById("companionBirthdate").style.backgroundColor = 'lightpink';
      }
      if (numberPhone.trim() === "") {
        document.getElementById("companionPhone").style.backgroundColor = 'lightpink';
      }
      if (email.trim() === "") {
        document.getElementById("companionEmail").style.backgroundColor = 'lightpink';
      }
      if (addres.trim() === "") {
        document.getElementById("companionAddress").style.backgroundColor = 'lightpink';
      }
      if (city.trim() === "") {
        document.getElementById("companionCity").style.backgroundColor = 'lightpink';
      }
      if (country.trim() === "") {
        document.getElementById("companionCountry").style.backgroundColor = 'lightpink';
      }
      if (occupation.trim() === "") {
        document.getElementById("companionOccupation").style.backgroundColor = 'lightpink';
      }
      if (company.trim() === "") {
        document.getElementById("companionCompany").style.backgroundColor = 'lightpink';
      }
    } else {
      const saveCompanion = {
        document_type,
        name,
        birthdayDate,
        numberPhone,
        email,
        addres,
        city,
        country,
        occupation,
        company,
      };

      try {
        const response = await hotelApi.put(
          `host/${hostDocument}`,
          saveCompanion
        );
        if (response.status === 200) {
          console.log("Registro guardado con exito");
          const mensajeActualizarAcompañante = (document.getElementById(
            "mensajeActualizarAcompañante"
          ).style.display = "block");

          document.getElementById("companionDocumentType").disabled = true;
          document.getElementById("companionName").disabled = true;
          document.getElementById("companionBirthdate").disabled = true;
          document.getElementById("companionPhone").disabled = true;
          document.getElementById("companionEmail").disabled = true;
          document.getElementById("companionAddress").disabled = true;
          document.getElementById("companionCity").disabled = true;
          document.getElementById("companionCountry").disabled = true;
          document.getElementById("companionOccupation").disabled = true;
          document.getElementById("companionCompany").disabled = true;
          document.getElementById("btnActualizarAcompañante").disabled = true;
          document.getElementById("btnAgregarAcompanante").disabled = true;

          document.getElementById("btnHabilitarAcompanante").innerText = "Modificar";
        } else {
          console.error("Error en la solicitud POST");
        }
      } catch (error) {
        console.error("Error al realizar la solicitud POST:", error);
      }
    }
  });

document.getElementById("btnAsignarAcompañante")
  .addEventListener("click", async () => {
    const companionId = document.getElementById("companionDocument").value;
    try {
      const response = await hotelApi.post("registers/add-companion", {
        registerId,
        companionId
      });
      if (response) {
        console.log("Acompañante asignado con exito");
        const mensajeAsignarAcompañante = (document.getElementById(
          "asignarAcompañante"
        ).style.display = "block");
      } else {
        console.log("Error al asignar el acompañante");
      }
    } catch (error) {
      console.error("Error de solicitud al asignar acompañante ", error);
    }
  });