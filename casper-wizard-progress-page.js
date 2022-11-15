/*
- Copyright (c) 2014-2016 Cloudware S.A. All rights reserved.
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

import { CasperWizardPage } from './casper-wizard-page.js';
import '@vaadin/vaadin-progress-bar/vaadin-progress-bar.js';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

class CasperWizardProgressPage extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          width: 100%;
          height: 100%;
          background: var(--surface-color, #fff);
          border-radius: 10px;
        }

        casper-wizard-page {
          height: 100%;
          display: grid;
          grid-template-rows: 42px 1fr;
        }

        vaadin-progress-bar {
          margin-top: 5px;
          margin-bottom:  20px;
          width: 100%;
          height: 20px;
        }

        span {
          color: grey;
        }

        .container-status {
          margin-top: 120px;

        }

        .container-status span {
          text-align: center;
        }

        .title {
          color: --var(primary-color);
          font-size: 24px;
          font-weight: bold;
        }

        .progress-container[side-by-side] {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
          justify-content: space-between;
          flex-direction: column;
        }

        .progress-container[side-by-side] .progress-index-container {
          display: flex;
          align-content: space-around;
          align-items: center;
          height: 30px;
        }

        .progress-container[side-by-side] .progress-index-container > span {
          width: 50%;
        }

        .progress-container[side-by-side] .progress-index-container > vaadin-progress-bar {
          width: 50%;
          margin-bottom: 0px;
        }

      </style>

      <casper-wizard-page page-title="Progresso">
        <div class="progress-container" side-by-side$={{sideBySide}}>
          <template is="dom-repeat" items="{{progressMessages}}">
            <div class="progress-index-container">
              <span inner-h-t-m-l="[[item.message]]">[[item.message]]</span>
              <vaadin-progress-bar indeterminate="" min="0" max="100"></vaadin-progress-bar>
            </div>
          </template>
        </div>
      </casper-wizard-page>
    `;
  }

  static get is () {
    return 'casper-wizard-progress-page';
  }

  static get properties () {
    return {
      progressMessages: {
        type: Object
      },
      progressCount: {
        type: Number,
        value: 1
      },
      title: {
        type: String
      },
      sideBySide: {
        type: Boolean,
        value: false
      }
    };
  }

  ready () {
    super.ready();
  }

  connectedCallback () {
    super.connectedCallback();
    this.setProgressCount(1, true);
  }

  setProgressCount (count, forced) {
    if ( count !== this.progressCount || forced) {
      this.progressCount = count;
      this.progressMessages = null;
      const pdata = Array.apply(null, { length: this.progressCount }).map(function() { return { message: '\xA0' }; });
      pdata[0].message = 'Em fila de espera';
      this.progressMessages = pdata;

      for ( let idx = 1; idx <= this.progressMessages.length; idx++ ) {
        // const pbar = this.shadowRoot.querySelector(`vaadin-progress-bar:nth-of-type(${idx})`);
        const pbar = [...this.shadowRoot.querySelectorAll(`vaadin-progress-bar`)][idx];
        if ( pbar ) {
          pbar.indeterminate = true;
        }
      }
    }
  }

  updateProgress (index, message, progress) {
    const idx = index || 0;

    if ( message ) {
      try {
        this.progressMessages[idx].message = message;
        this.notifyPath(`progressMessages.${idx}.message`);
      } catch (e) {
        // protect the error
      }
    }


    if ( progress !== undefined ) {
      const pvalue = parseFloat(progress);

      if ( isNaN(progress) === false ) {
        try {
          // const pbar = this.shadowRoot.querySelector(`.progress-container .progress-index-container vaadin-progress-bar:nth-of-type(${idx + 1})`);
          const pbar = [...this.shadowRoot.querySelectorAll(`vaadin-progress-bar`)][idx];
          pbar.indeterminate = false;
          pbar.value = pvalue;
        } catch (e) {
            // protect the error
        }
      }
    }
  }
}

window.customElements.define(CasperWizardProgressPage.is, CasperWizardProgressPage);
