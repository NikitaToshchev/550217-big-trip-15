export const createEventFormDestinationTemplate = (destination) => {
  const createPicturesTemplate = () => (
    `<div class="event__photos-container">
        <div class="event__photos-tape">
          ${destination.pictures.map((picture) => (`
            <img class="event__photo" src="${picture.src}" alt="${picture.name}">
          `)).join('\n')}
        </div>
      </div>`
  );

  const getPicturesElement = destination.pictures !== 0 ? createPicturesTemplate() : '';

  return `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${destination.description}</p>
     ${getPicturesElement}
  </section>`;
};
