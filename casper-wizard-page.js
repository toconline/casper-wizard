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

export class CasperWizardPage extends PolymerElement {
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
          overflow: hidden;
        }


        .print-button {
          background-color: var(--primary-color);
          font-weight: normal;
          font-size: 14px;
          -webkit-font-smoothing: antialiased;
          color: white;
          margin-right: 10px;
          height: 30px;
          box-shadow: none;
          display: none;
        }

        .headery {
          display: flex;
          flex-direction: row;
          position: absolute;
          top: 5px;
          right: 0px;
        }

      </style>
      <template is="dom-if" if="[[!hideTitle]]">
        <h1 class="pagetitle">[[pageTitle]]</h1>
      </template>

      <div class="headery">
        <slot name="header"></slot>
        <paper-button id="button" class="print-button" on-tap="_printWizard" raised>Imprimir</paper-button>
      </div>

      <div class="content">
        <slot name="composed-header"></slot>
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
      },
      printContents: {
        type: Boolean,
        value: false,
        observer: '_printableChanged'
      }
    };
  }


  _printableChanged (newValue) {
    if ( newValue == true ) {
      this.$.button.style.display = 'flex';
    }
  }

  _printWizard () {
    const printContents = this.querySelector('table');
    let htmlToPrint = `
      <style>
        table {
          width: 100%;
        }

        [printable] {
          display: block;
        }

        table th, table td {
          text-align: left;
          border:1px solid #000;
          padding: 0.5em;
        }
      </style>`;
    htmlToPrint += printContents.outerHTML;
    htmlToPrint += `
      <script>
        window.focus();
        window.print();
      </script>
    `;

    let outerHtml = `<body>`;
    outerHtml += `<h1>${this.pageTitle}</h1>`;
    outerHtml += htmlToPrint;
    outerHtml += `</body>`;

    const iframe    = document.createElement("iframe");
    iframe.setAttribute('hidden', true);

    this.shadowRoot.querySelector('.content').append(iframe);

    const frameDoc = iframe.contentWindow.document;
    frameDoc.open();
    frameDoc.writeln(outerHtml);
    frameDoc.close();
  }

}

window.customElements.define(CasperWizardPage.is, CasperWizardPage);
