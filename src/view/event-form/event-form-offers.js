export const createEventFormOffersTemplate = (id, offers, offersByType) => {

  const isCheckedOffer = (title) => offers
    .map((item) => item.title)
    .includes(title) ? 'checked' : '';

  return `<section class="event__section  event__section--offers">
     <h3 class="event__section-title  event__section-title--offers">Offers</h3>

     <div class="event__available-offers">
     ${offersByType.map(({ title, price }) => (`<div class="event__offer-selector">
         <input class="event__offer-checkbox  visually-hidden" data-title="${title}" data-price="${price}" id="event-offer-${title}-${id}" type="checkbox" name="event-offer-${title}" ${isCheckedOffer(title)}>
         <label class="event__offer-label" for="event-offer-${title}-${id}">
           <span class="event__offer-title">${title}</span>
           &plus;&euro;&nbsp;
           <span class="event__offer-price">${price}</span>
         </label>
       </div>`)).join('\n')}
     </div>
   </section>`;
};
