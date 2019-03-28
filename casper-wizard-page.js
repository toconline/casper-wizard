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

import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

class CasperWizardPage extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: flex;
          flex-direction: column;
          width: 100%;
        }

        .content {
          flex-grow: 1;
          display: flex;
          position: relative;
          flex-direction: column;
          padding: 24px 24px 0 24px;
        }

        .pagetitle {
          background-color: var(--secondary-color, #ccc);
          color: var(--on-secondary-color, #444);
          line-height: 42px;
          font-size: 16px;
          padding: 0px 48px 0px 12px;
          margin: 0px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

      </style>
      <template is="dom-if" if="[[!hideTitle]]">
        <h1 class="pagetitle">[[pageTitle]]</h1>
      </template>
      <div class="content">
        <slot></slot>
      </div>
    `;
  }

  static get is () {
    return 'casper-wizard-page';
  }

  static get properties() {
    return {
      pageTitle: {
        type: String
      },
      hideTitle: {
        type: Boolean,
        value: false
      }
    };
  }
}

window.customElements.define(CasperWizardPage.is, CasperWizardPage);
