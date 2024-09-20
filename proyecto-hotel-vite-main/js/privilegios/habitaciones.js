import { hotelApi } from "../api";
let currentRoomNumber;
let idTarifaEjecutivo;
let idTarifaRegular;

const getRates = async () => {
    try {
        const response = await hotelApi.get("rates");
        const rates = response.data.data.rates || [];
        console.log(rates);
        const tarifaEjecutivo = document.getElementById("tarifaEjecutivo");
        const tarifaRegularInput = document.getElementById("tarifaRegular");

        // Buscar y asignar valores a los campos correspondientes
        rates.forEach(rate => {
            if (rate.type === "ejecutivo" && tarifaEjecutivo) {
                tarifaEjecutivo.value = rate.price || "";
                idTarifaEjecutivo = rate.id;
            } else if (rate.type === "regular" && tarifaRegularInput) {
                tarifaRegularInput.value = rate.price || "";
                idTarifaRegular = rate.id;
            }
        });
    } catch (error) {
        console.error("Error al obtener las tarifas:", error);
    }
};
window.addEventListener("load", getRates);

document.getElementById("btnActualizarTarifas").addEventListener("click", async () => {
    const tarifaEjecutivo = document.getElementById("tarifaEjecutivo").value;
    const tarifaRegular = document.getElementById("tarifaRegular").value;

    try {
        if (idTarifaEjecutivo && idTarifaRegular) {
            const responseEjecutivo = await hotelApi.put(`rates/${idTarifaEjecutivo}`, {
                price: tarifaEjecutivo
            });
            const responseRegular = await hotelApi.put(`rates/${idTarifaRegular}`, {
                price: tarifaRegular
            });
            if (responseEjecutivo.status === 200 && responseRegular.status === 200) {
                console.log("Actualización de tarifas exitosa");
            } else {
                console.log("Error en la respuesta de actualización de tarifas");
            }
        } else {
            console.log("IDs de tarifas no definidos");
        }
    } catch (error) {
        console.error("Error al actualizar tarifas:", error);
    }
});


const getRooms = async () => {
    try {
        const response = await hotelApi.get("rooms");
        const rooms = response.data.data.rooms || [];
        const habitacionesContainer = document.getElementById("habitacionesContainer");

        habitacionesContainer.innerHTML = "";

        rooms.forEach(room => {
            const roomElement = document.createElement("div");
            roomElement.innerHTML = `
            <div class="card mb-4 shadow-sm" style="background-color: lightgray;">
                <div class="row no-gutters">
                    <!-- Sección de la izquierda para la foto -->
                    <div class="col-md-6">
                        <img src="${room.imgUrl}" alt="Habitación ${room.number}" class="img-fluid" style="max-width:350px;">
                    </div>
                    <!-- Sección de la derecha para los otros datos -->
                    <div class="col-md-6">
                        <div class="card-body">
                            <h3>${room.number}</h3>
                            <p>Descripción: ${room.description}</p>
                            <p>Piso: ${room.floor}</p>
                            <button class="btn btn-success" data-bs-toggle="modal"
                                data-bs-target="#modificarHabitacionModal"
                                data-id="${room.number}">
                                Modificar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            `;
            habitacionesContainer.appendChild(roomElement);
        });
    } catch (error) {
        console.error("Error al obtener las habitaciones:", error);
    }
};

window.addEventListener("load", getRooms)

async function openEditRoomModal(number) {
    try {
        const response = await hotelApi.get(`rooms/${number}`);
        const justRoom = response.data.data.room || null;
        document.getElementById("inputUrlImagen").value = "";
        document.getElementById("inputDescripcion").value = "";
        if (justRoom) {
            document.getElementById("inputUrlImagen").value = justRoom.imgUrl || "";
            document.getElementById("inputDescripcion").value = justRoom.description || "";
        } else {
            console.log("Fallo al llenar los campos");
        }
    } catch (error) {
        console.error("Fallo en la solicitud de get: ", error);
    }
}

document.addEventListener("click", function (event) {
    if (event.target.matches('.btn-success[data-id]')) {
        const number = event.target.dataset.id;
        console.log(number);
        openEditRoomModal(number);
    }
});

document.addEventListener("click", function (event) {
    if (event.target.matches('.btn-success[data-id]')) {
        currentRoomNumber = event.target.dataset.id;
        console.log(currentRoomNumber);
        openEditRoomModal(currentRoomNumber);
    }
});

document.getElementById("btnGuardarHabitacion").addEventListener("click", async () => {
    const description = document.getElementById("inputDescripcion").value;
    console.log(description);
    const imgUrl = document.getElementById("inputUrlImagen").value;
    console.log(imgUrl);
    const roomData = {
        description,
        imgUrl
    };
    try {
        const response = await hotelApi.put(`rooms/${currentRoomNumber}`, roomData);
        if (response.status === 200) {
            console.log("Actualización exitosa");
            getRooms();
        } else {
            console.log("Error en la respuesta de actualización");
        }
    } catch (error) {
        console.error("Error en la solicitud de actualización: ", error);
    }
});