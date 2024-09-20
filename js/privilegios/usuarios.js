
import { hotelApi } from "../api";

let endPointUsers = "users?";

const getUsers = async () => {
  try {
    const param = document.getElementById("selectedSearch").value;
    const buscar = document.getElementById("searchItem").value;
    const stateFilter = document.getElementById("stateFilter").value;

    //Filtro para la tabla
    if (param === "Todo") {
      endPointUsers = "users?";
      console.log("Sin filtro por columna");
    } else if (param === "Documento") {
      endPointUsers = "users?&document=" + buscar+"&";
    } else if (param === "Ficha") {
      endPointUsers = "users?&ficha=" + buscar+"&";
    } else {
      console.log("Campo seleccionable de columna falló");
    };
    //filtro estado
    if (stateFilter === "Todo") {
      console.log("Sin filtro por estado");
    } else if (stateFilter === "Activo")
      {
        endPointUsers = endPointUsers+"state=Activo";
      }
    else if (stateFilter === "Inactivo") {
      endPointUsers = endPointUsers + "state=Inactivo";
    } else {
      console.log("Campo seleccionable de columna falló");
    };

    const response = await hotelApi.get(endPointUsers);
    const usersList = response.data.data.users || [];

    const tableBody = document.getElementById("table-body-users");

    tableBody.innerHTML = "";
    for (const users of usersList) {
      const row = document.createElement("tr");
      row.innerHTML = `
            <td>${users.id || ""}</td>
            <td>${users.document || ""}</td>
            <td>${users.name || ""}</td>
            <td>${users.ficha || ""}</td>
            <td>${users.email || ""}</td>
            <td>${users.numberPhone || ""}</td>
            <td>${users.addres || ""}</td>
            <td>${users.role || ""}</td>
            <td>${users.state || ""}</td>
            <td>
            <button class="btn btn-success" data-bs-toggle="modal"
            data-bs-target="#userDetailsModal"
            data-users-id="${users.id}">Modificar</button>
            </td>
            `;
      tableBody.appendChild(row);
    }
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
  }
};

window.addEventListener("load", getUsers);
document.getElementById("btnBuscar").addEventListener("click", getUsers);

function openEditModal(id) {
  const getUserById = async (id) => {
    try {
      const response = await hotelApi.get(`users/${id}`);
      const justUser = response.data.data.user || null;

      if (justUser) {
        document.getElementById("userID").value = justUser.id || "";
        document.getElementById("userDocument").value = justUser.document || "";
        document.getElementById("userName").value = justUser.name || "";
        document.getElementById("userFicha").value = justUser.ficha || "";
        document.getElementById("userEmail").value = justUser.email || "";
        document.getElementById("userPhone").value = justUser.numberPhone || "";
        document.getElementById("userAddress").value = justUser.addres || "";
        document.getElementById("userRole").value = justUser.role || "";
        document.getElementById("userState").value = justUser.state || "";
      } else {
        console.log("Fallo al llenar los campos");
      }
    } catch (error) {
      console.error("Fallo en la solicitud de get: ", error);
    }
  };
  getUserById(id);
}

document.addEventListener("click", function (event) {
  if (event.target && event.target.dataset.usersId) {
    const id = event.target.dataset.usersId;
    openEditModal(id);
    const mensajeActualizacion = (document.getElementById(
      "mensajeActualizacion"
    ).style.display = "none");
  }
});

function camposBlanco() {
  document.getElementById("userID").style.backgroundColor = "white";
  document.getElementById("userDocument").style.backgroundColor = "white";
  document.getElementById("userName").style.backgroundColor = "white";
  document.getElementById("userFicha").style.backgroundColor = "white";
  document.getElementById("userEmail").style.backgroundColor = "white";
  document.getElementById("userPhone").style.backgroundColor = "white";
  document.getElementById("userAddress").style.backgroundColor = "white";
  document.getElementById("userRole").style.backgroundColor = "white";
  document.getElementById("userState").style.backgroundColor = "white";
}

document
  .getElementById("btnActualizarUsuario")
  .addEventListener("click", async () => {
    const id = document.getElementById("userID").value;
    const doc = document.getElementById("userDocument").value;
    const name = document.getElementById("userName").value;
    const ficha = document.getElementById("userFicha").value;
    const email = document.getElementById("userEmail").value;
    const numberPhone = document.getElementById("userPhone").value;
    const addres = document.getElementById("userAddress").value;
    const role = document.getElementById("userRole").value;
    const state = document.getElementById("userState").value;

    camposBlanco();
    if (doc.length < 8) {
      alert("El campo 'Documento' debe tener al menos 8 caracteres.");
      document.getElementById("userDocument").style.backgroundColor =
        "lightpink";
      return;
    }
    if (
      doc.trim() === "" ||
      name.trim() === "" ||
      ficha.trim() === "" ||
      email.trim() === "" ||
      numberPhone.trim() === "" ||
      addres.trim() === "" ||
      role.trim() === "" ||
      state.trim() === ""
    ) {
      alert(
        "Todos los campos son obligatorios. Por favor, complete los campos faltantes."
      );
      if (doc.trim() === "") {
        document.getElementById("userDocument").style.backgroundColor =
          "lightpink";
      }
      if (name.trim() === "") {
        document.getElementById("userName").style.backgroundColor = "lightpink";
      }
      if (ficha.trim() === "") {
        document.getElementById("userFicha").style.backgroundColor =
          "lightpink";
      }
      if (email.trim() === "") {
        document.getElementById("userEmail").style.backgroundColor =
          "lightpink";
      }
      if (numberPhone.trim() === "") {
        document.getElementById("userPhone").style.backgroundColor =
          "lightpink";
      }
      if (addres.trim() === "") {
        document.getElementById("userAddress").style.backgroundColor =
          "lightpink";
      }
      if (role.trim() === "") {
        document.getElementById("userRole").style.backgroundColor = "lightpink";
      }
      if (state.trim() === "") {
        document.getElementById("userState").style.backgroundColor =
          "lightpink";
      }
    } else {
      const userData = {
        document: doc,
        name,
        ficha,
        email,
        numberPhone,
        addres,
        role,
        state,
      };
      try {
        const response = await hotelApi.put(`users/${id}`, userData);
        if (response.status === 200) {
          console.log("Actualizacion exitosa");
          const mensajeActualizacion = (document.getElementById(
            "mensajeActualizacion"
          ).style.display = "block");
          getUsers();
        } else {
          console.log("Error en la respuesta de actualizacion");
        }
      } catch (error) {
        console.error("Error en la solicitud de actualizacion: ", error);
      }
    }
  });
