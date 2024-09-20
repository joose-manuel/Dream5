import { hotelApi } from "../api";

const $ = (element) => document.querySelector(element);
const $tasks = document.getElementById("tasks");
async function loadToDos() {
  $tasks.innerHTML = "";
  const response = await hotelApi.get("todos");
  const toDos = response.data.data.todos;
  toDos.forEach((element) => {
    let isChecked = "";
    if (element.check === true) {
      isChecked = "checked";
    } else {
      isChecked = "";
    }
    const $div = document.createElement("div");
    $div.classList.add("row");
    $div.innerHTML = /*html*/ `
      <div class="col-md-5">
        <label id="tasks">${element.content}</label>
      </div>
      <div class="col-md-3">
        <input type="checkbox" class="form-check-input" id="${element.id}" ${isChecked}/>
        <button class="btn btn-danger delete-ToDo" data-ToDo-id="${element.id}"><i class="bx bxs-trash icon"></i></button>
      </div>
        <hr />
          `;
    $tasks.appendChild($div);
  });
}

window.addEventListener("load",loadToDos);

async function updateTodo(idToDo, stateToDo) {
  try {
    const response = await hotelApi.put(`todos/${idToDo}`, stateToDo);
    if (response.status === 200) {
      console.log("Actualizacion exitosa");
    } else {
      console.log("Error al actualizar");
    }
  } catch (error) {
    console.error("fallo al realizar put: ", error);
  }
}

$tasks.addEventListener("change", function (event) {
  if (event.target.type === "checkbox") {
    const idToDo = event.target.id;
    const stateToDo = { check: event.target.checked };

    updateTodo(idToDo, stateToDo);
  }
});

async function deleteToDo(idTodo) {
  try {
    const response = await hotelApi.delete(`todos/${idTodo}`);
    if (response.status === 200) {
      console.log("Tarea eliminada con éxito");
      loadToDos();
    } else {
      console.error("Error al eliminar la tarea");
    }
  } catch (error) {
    console.error("Error al realizar la solicitud DELETE:", error);
  }
}

document.addEventListener('click', function (event) {
  if (event.target && event.target.classList.contains('btn-danger')) {
    const idToDo = parseInt(event.target.dataset.todoId);
    console.log(idToDo);
    if (confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
      deleteToDo(idToDo);
    }
  }
});

async function agregarTarea()  {
  const contenido = document.getElementById("newTask");
  const tarea = contenido.value.trim();
  const stateToDo = false;
  if (tarea !== "") {
    try {
      const data = {
        content: tarea,
        check : stateToDo
      };
      const response = await hotelApi.post("todos",data);
      if (response.status === 200) {
        console.log("solicitud de post exitosa");
        loadToDos();
      } else {
        console.log("fallo en el if");
      }
    } catch (error) {
      console.error(error);
    }
  } else {
    alert("por favor agregue contenido a la tarea");
  }
}

document.getElementById("btnnewTask").addEventListener("click",agregarTarea)