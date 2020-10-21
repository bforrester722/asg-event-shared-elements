
import {AppElement, html} from '@smyd/app-shared/app-element.js';
import {
  listen, 
  schedule
}                 from '@smyd/app-functions/utils.js'
import htmlString from './event-details.html';
import '@smyd/app-overlays/app-header-overlay.js';
import '@smyd/app-shared/app-icons.js';
import '@polymer/iron-image/iron-image.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/paper-fab/paper-fab.js';
import '@smyd/asg-icons/asg-icons.js';
import './event-info.js';


class AsgEventDetails extends AppElement {
  static get is() { return 'asg-event-details'; }

  static get template() {
    return html([htmlString]);
  }

  static get properties() {
    return {

      _eventItem: Object

    };
  }


  connectedCallback() {
    super.connectedCallback();

    listen(this.$.overlay, 'overlay-exiting', this.__resetFab.bind(this));
  }


  __computeHideLink(link) {
    return link === '';
  }


  __computeFabHidden(eventItem) {
    if (!eventItem) { return true; }
    const {preRegister, seats} = eventItem;
    return !preRegister || Number(seats) < 1;
  }

  
  __resetFab() {
    this.$.fab.classList.remove('fab-entry');
  }


  async __openRegistration() {
    try {
      await this.clicked();
      this.fire('open-overlay', {
        eventItem: this._eventItem, 
        id:       'registrationModal'
      });
     }
    catch (error) { 
      if (error === 'click debounced') { return; }
      console.error('__openRegister error: ', error); 
    } 
  } 


  async open(detail) {
    this._eventItem = detail.eventItem;
    await schedule();
    await this.$.overlay.open();
    this.$.fab.classList.add('fab-entry');
  }

}

window.customElements.define(AsgEventDetails.is, AsgEventDetails);
