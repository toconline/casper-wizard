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

import '@polymer/paper-button/paper-button.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { CasperWizardPage } from './casper-wizard-page.js';

class CasperWizardIframePage extends CasperWizardPage {
  static get template() {
    return html`
      <style>

        :host {
          width: 100%;
          display: flex;
          flex-direction: column;
        }

        .content {
          display: flex;
          flex-direction: column;
          flex-grow: 2.0;
          padding: 24px 24px 0 24px;
        }

        .pagetitle {
          background-color: #ccc;
          color: #444;
          line-height: 42px;
          height: 42px;
          font-size: 16px;
          padding: 0px 48px 0px 12px;
          margin: 0px;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }

        .iframe {
          width: 100%;
          border: none;
          overflow: auto;
        }

        .iframe-menu {
          width: 100%;
          height: 36px;
          position: absolute;
          bottom: 0;
          text-align: center;
        }

        .iframe-container {
          flex-grow: 1;
          display: flex;
          overflow: auto;
          -webkit-overflow-scrolling: touch;
        }

        .print-button {
          position: absolute;
          top: 5px;
          right: 0;
          background-color: var(--primary-color);
          border: 2px var(--primary-color) solid;
          font-weight: normal;
          font-size: 14px;
          -webkit-font-smoothing: antialiased;
          color: white;
          margin: 0 12px 12px 12px;
          height: 30px;
          box-shadow: none;
          display: none;
        }

        .print-button:hover {
          background-color: white;
          color: var(--primary-color);
          transition: background 1s;
          transition: color 0.5s;
        }

        .shadow {
          display: none;
          position: absolute;
          width: 94%;
          bottom: 0;
          left: 0;
          margin: 0 25px;
          height: 6px;

          background: -moz-linear-gradient(top, rgba(255,255,255,0) 0%, rgba(239, 239, 239) 100%);
          background: -webkit-linear-gradient(top, rgba(255,255,255,0) 0%,rgba(239, 239, 239) 100%);
          background: linear-gradient(to bottom, rgba(255,255,255,0) 0%,rgba(239, 239, 239) 100%);
          filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#00ffffff', endColorstr='#e0e0e0',GradientType=0 );
        }

      </style>

      <h1 class="pagetitle">[[pageTitle]]</h1>
      <div class="content">
        <slot name="header">
          <paper-button id="button" class="print-button" on-tap="_printDocument" raised>Imprimir</paper-button>
        </slot>

        <div class="shadow"></div>
        <div class="iframe-container">
          <iframe class="iframe" id="iframe" srcdoc$="[[srcdoc]]"></iframe>
        </div>

        <slot name="footer">
        </slot>
      </div>
    `;
  }

  static get is () {
    return 'casper-wizard-iframe-page';
  }

  static get properties () {
    return {
      shadow: {
        type: Boolean,
        value: false
      },
      srcdoc: {
        type: Object,
        value: undefined
      },
      pageTitle: {
        type: String
      },
      printable: {
        type: Boolean,
        value: false,
        observer: '_printableChanged'
      }
    };
  }

  ready () {
    super.ready();
    if (this.shadow) {
      this.shadowRoot.querySelector(".shadow").style.display = "block";
    }
  }

  _printableChanged (newValue) {
    if ( newValue == true ) {
      this.$.button.style.display = 'flex';
    }
  }

  _printDocument () {
    const frm = this.shadowRoot.querySelector('iframe');
    if ( CasperBrowser.isIos ) {
      window.open(frm.src, "_blank");
    } else {
      frm.contentWindow.focus();
      frm.contentWindow.print();
    }
    return false;
  }
}

window.customElements.define(CasperWizardIframePage.is, CasperWizardIframePage);
