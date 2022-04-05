/*
  - Copyright (c) 2022 Cloudware S.A. All rights reserved.
  -
  - This file is part of casper-wizard.
  -
  - casper-wizard is free software: you can redistribute it and/or modify
  - it under the terms of the GNU Affero General Public License as published by
  - the Free Software Foundation, either version 3 of the License, or
  - (at your option) any later version.
  -
  - casper-wizard  is distributed in the hope that it will be useful,
  - but WITHOUT ANY WARRANTY; without even the implied warranty of
  - MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  - GNU General Public License for more details.
  -
  - You should have received a copy of the GNU Affero General Public License
  - along with casper-wizard.  If not, see <http://www.gnu.org/licenses/>.
  -
 */


import { CasperWizard } from '@cloudware-casper/casper-wizard/casper-wizard.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
  
export class CasperPaWizard extends CasperWizard {
  
  // ... we need to return an empty template to avoid a duplication of the skeletom dom
  static get template () {
    return html``;
  }
  
  async appendPagesAndActivate (index) {
  
    if ( this.options.title ) {
      this.setTitle(this.options.title);
    }
  
    for (const p of this.options.pages ) {
      await import(`/src/${app.digest}${p}.js`);
      const page = document.createElement(p);
        
      page.classList.add('page-lit', 'slide-in');
      page.id = p;
      page.wizard = this;
      this._pages.push(page);
    }
      
    super.appendPagesAndActivate(index);
  
    // ... build tabs if they are not surpressed ...
    if (this.notabs === undefined || this.notabs === false) {
      this._createTabs();
    }
  }

  /**
   * Override base class to provide custom and corrected handling of subscriptions
   * 
   * @param {Object} response the job status either retrieved from redis or pushed with a redis notification
   * 
   * @note There's a ton a legacy here, but I am going the safe way and avoided touching the case class 
   */
  _subscribeJobResponse (response) {
    if ( typeof response.status === 'object' ) {
      // ... the status of a non-transient job was retrieved from redis that's why status is an object ...
      const status = response.status;

      if ( status.status === 'queued' ) {
        // TODO a timer to protect this???
        console.log('The job is late for the date');

      } else if ( status.status === 'completed' ) {
        // ... the job already finished just return the response ...
        this._jobPromise.resolve(status.response);
        super.close();
      } else {
        // ... it's in intermediate state, let's go down the progress road ...
        if ( Array.isArray(status.progress) ) {
          // ... array of multiple progresses as sent by the SP-JOB
          let idx = 0;
          status.progress.forEach(element => {
            this._updateUI( {
              progress: status.progress[idx].value,
              message:  status.progress[idx].message,
              status:   status.status,
              index:    idx 
            });
            idx++;
          });
        } else {
          this._updateUI(status);
        }  
      }
      return;
    }

    // ... otherwise it's a good old notification published via redis channel ...
    this._updateUI(response);
  }

}