
import {AppElement, html} from '@smyd/app-shared/app-element.js';
import {
  isOnScreen
}                 from '@smyd/app-functions/utils.js';
import htmlString from './event-card.html';
import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-fab/paper-fab.js';
import '@polymer/iron-image/iron-image.js';
import '@smyd/asg-icons/asg-icons.js'
import './event-info.js';


class AsgEventCard extends AppElement {
  static get is() { return 'asg-event-card'; }

  static get template() {
    return html([htmlString]);
  }


  static get properties() {
    return {
   
      eventItem: Object,

      _imageUrl: String

    };
  }


  static get observers() {
    return [
      '__eventItemChanged(eventItem)'
    ];
  }


  async __eventItemChanged(eventItem) {
    if (!eventItem || !eventItem.images) { return; }
    await isOnScreen(this);
    const {images} = eventItem;
    const [first]  = Object.values(images).sort((a, b) => 
                       a.index - b.index);
    if (!first) { return; } // undefined after delete in cms
    const {optimized, url} = first;
    this._imageUrl = optimized ? optimized : url; // backwards compat
  }

  // Listener in app-mixin
  async __openDetails(event) {
    try {
      await this.clicked();
      const eventItem = Object.assign(
        {}, 
        this.eventItem, 
        {url: this._imageUrl}
      );
      this.fire('open-overlay', {eventItem, id: 'eventDetails'});
    }
    catch (error) { 
      if (error === 'click debounced') { return; }
      console.error(error); 
    } 
  }

}

window.customElements.define(AsgEventCard.is, AsgEventCard);
