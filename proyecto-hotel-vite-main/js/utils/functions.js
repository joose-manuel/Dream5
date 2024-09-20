/**
 * Encuentra y devuelve el primer elemento que coincida con el selector CSS especificado.
 *
 * @param {string} element - El selector CSS para buscar el elemento.
 * @returns {Element|null} El primer elemento que coincide con el selector
 */
export const $ = (element) => document.querySelector(element);

/**
 * Encuentra y devuelve todos los elementos que coinciden con el selector CSS especificado.
 *
 * @param {string} element - El selector CSS para buscar los elementos.
 * @returns {NodeList} Una lista de nodos que coinciden con el selector.
 */
export const $$ = (element) => document.querySelectorAll(element);
