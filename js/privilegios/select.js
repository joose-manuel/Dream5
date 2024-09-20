// usuarios.js

document.addEventListener("DOMContentLoaded", function () {
    const selectView = document.getElementById("selectView");
    selectView.addEventListener("change", function () {
        var selectedValue = selectView.value;

        // Mostramos u ocultamos las secciones según la opción seleccionada
        if (selectedValue === "usuarios") {
            document.getElementById("paginaUsuarios").style.display = "table";
            document.getElementById("paginaConsolidado").style.display = "none";
            document.getElementById("paginaHabitaciones").style.display = "none";
        } else if (selectedValue === "consolidado") {
            document.getElementById("paginaUsuarios").style.display = "none";
            document.getElementById("paginaConsolidado").style.display = "block";
            document.getElementById("paginaHabitaciones").style.display = "none";
        } else if (selectedValue === "habitaciones") {
            document.getElementById("paginaUsuarios").style.display = "none";
            document.getElementById("paginaConsolidado").style.display = "none";
            document.getElementById("paginaHabitaciones").style.display = "block";
        } else {
            document.getElementById("paginaUsuarios").style.display = "none";
            document.getElementById("paginaConsolidado").style.display = "none";
            document.getElementById("paginaHabitaciones").style.display = "none";
        }
    });
});
