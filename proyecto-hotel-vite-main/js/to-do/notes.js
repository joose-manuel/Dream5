// Obtener referencias a los textarea
const noteTextAreas = document.querySelectorAll('.noteText');

// Agregar un evento de entrada (input) a cada textarea
noteTextAreas.forEach((textarea, index) => {
  const noteId = `note_${index + 1}`; // Crear un identificador único para la nota
  textarea.id = noteId; // Asignar el identificador único al textarea

  textarea.addEventListener('input', function () {
    // Obtener el contenido actual del textarea
    const content = this.value;

    // Verificar si hay una nota almacenada para este textarea
    const storedNote = localStorage.getItem(noteId);

    // Si no hay una nota almacenada, crea una nueva
    if (!storedNote) {
      const newNote = { content };
      localStorage.setItem(noteId, JSON.stringify(newNote));
    } else {
      // Si ya existe una nota, actualiza su contenido
      const existingNote = JSON.parse(storedNote);
      existingNote.content = content;
      localStorage.setItem(noteId, JSON.stringify(existingNote));
    }
  });
});

// Función para cargar las notas almacenadas al cargar la página
function loadNotes() {
  noteTextAreas.forEach((textarea, index) => {
    const noteId = `note_${index + 1}`;
    const storedNote = localStorage.getItem(noteId);
    if (storedNote) {
      const existingNote = JSON.parse(storedNote);
      textarea.value = existingNote.content;
    }
  });
}

// Cargar las notas al cargar la página
window.addEventListener('load', loadNotes);
