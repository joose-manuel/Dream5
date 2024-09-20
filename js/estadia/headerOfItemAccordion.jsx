export const headerOfItemAccordion = ({
  imgUrl,
  number,
  reservations = [],
}) => {
  return /*html*/ `
      <h2 class="accordion-header" id="panelsStayOpen-heading${number}">
        <button
          class="accordion-button"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#panelsStayOpen-${number}"
          aria-expanded="true"
          aria-controls="panelsStayOpen-${number}"
        >
          <img
            src="${imgUrl}"
            alt="room-img"
            width="60px"
            class="border bordere rounded "
            style="margin-right: 20px;"
          />
          <h5>habitacion ${number}</h5>
  
          <small style="padding-left: 20px; font-size:25px;">
            🌟
          </small>
          <b> reservada: ${reservations.length === 0 ? "no" : "si"} </b>
        </button>
      </h2>
    `;
};
