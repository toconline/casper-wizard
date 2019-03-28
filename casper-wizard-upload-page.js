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

import '@polymer/paper-ripple/paper-ripple.js';
import '@vaadin/vaadin-upload/vaadin-upload.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';

const casperVaadinUpload = document.createElement('template');
casperVaadinUpload.innerHTML = `
  <dom-module id="casper-vaadin-upload" theme-for="vaadin-upload">
    <template>
      <style>
        :host {
          padding: 24px;
          color: gray;
        }

        :host([dragover]) {
          color: var(--primary-color);
          border: solid 2px var(--primary-color);
        }

        .upload-button {
          color: white;
          background-color: var(--primary-color);
        }

        .upload-button[disabled] {
          color: var(--disabled-text-color);
          background-color: var(--disabled-primary-color);
        }

        [part="drop-label"] {
          align-items: center;
        }

        [part="drop-label-icon"] {
          margin: 6px;
        }

      </style>
    </template>
  </dom-module>
`;
document.head.appendChild(casperVaadinUpload.content);

class CasperWizardUploadPage extends Casper.I18n(CasperWizardPage) {
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
          padding: 24px;
          display: flex;
          flex-direction: column;
        }

        .pagetitle {
          background-color: var(--secondary-color, #ccc);
          color: var(--on-secondary-color, #444);
          line-height: 42px;
          height: 42px;
          font-size: 16px;
          padding: 0px 48px 0px 12px;
          margin: 0px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        casper-button {
          margin: 0;
        }

        vaadin-upload  {
          flex-grow: 2.0;
          overflow: visible;
          cursor: pointer;
        }

      </style>

      <h1 class="pagetitle">[[pageTitle]]</h1>
      <div class="content">
        <slot name="before"></slot>
        <vaadin-upload id="upload" accept="[[accept]]" target="[[uploadUrl]]" max-files="1" method="POST" timeout="300000" form-data-name="my-attachment">
          <paper-ripple id="ripple" style="pointer-events: none;"></paper-ripple>
          <casper-button disabled="[[disabled]]" slot="add-button" class="upload-button">ABRIR</casper-button>
        </vaadin-upload>
        <slot name="after">
          <div style="height: 48px;"></div>
        </slot>
      </div>
    `;
  }

  static get is () {
    return 'casper-wizard-upload-page';
  }

  static get properties() {
    return {
      uploadUrl: String,
      originalFilePath: {
        type: String,
        notify: true
      },
      originalFileSize: {
        type: Number,
        notify: true
      },
      uploadedFilePath: {
        type: String,
        notify: true
      },
      accept: {
        type: String,
        value: "image/jpeg, image/png"
      },
      disabled: {
        type: Boolean,
        observer: '_disabledChange'
      }
    };
  }

  ready () {
    super.ready();
    this.i18nUpdateUpload(this.$.upload);
    this.$.upload.addEventListener('upload-before',  e => this._uploadBefore(e));
    this.$.upload.addEventListener('upload-success', e => this._uploadSuccess(e));
    this.$.upload.addEventListener('upload-request', e => this._uploadRequest(e));
    this.$.upload.addEventListener('dragenter',      e => this._onDragEnter(e));
    this.$.upload.addEventListener('dragleave',      e => this._onDragLeave(e));
  }

  showUpload () {
    this.$.upload.style.display = 'block';
  }

  hideUpload () {
    this.$.upload.style.display = 'none';
  }

  clear () {
    this.$.upload.files = [];
  }

  _uploadBefore (event) {
    if ( this.disabled ) {
      this.clear();
      this.$.ripple.upAction();
      this.wizard.openToast('Para carregar o ficheiro é necessário autorizar a operação', false);
      event.preventDefault();
    }
  }

  _uploadRequest (event) {
    if ( this.disabled ) {
      event.preventDefault();
      this.$.ripple.upAction();
    } else {
      this.originalFilePath = event.detail.file.name;
      this.originalFileSize = event.detail.file.size;
      this.uploadedFilePath = undefined;
      event.preventDefault();
      this.$.ripple.upAction();
      event.detail.xhr.setRequestHeader('Content-Type', 'application/octet-stream');
      event.detail.xhr.setRequestHeader('Content-Disposition', 'form-data; name="'+event.detail.file.formDataName+'"; filename="uploaded_file";');
      event.detail.xhr.send(event.detail.file);
    }
  }

  _uploadSuccess (event) {
    if ( event.detail.xhr.status == 200 ) {
      try {
        let response = JSON.parse(event.detail.xhr.responseText);
        this.uploadedFilePath = response.file;
        if ( typeof this.wizard['uploadSuccessOn' + this.wizard._pages[this.wizard._pageIndex].id] === 'function' ) {
          this.wizard['uploadSuccessOn' + this.wizard._pages[this.wizard._pageIndex].id].apply(this.wizard, [response.file]);
        }
      } catch (exception) {
        // TODO Handle the error.
      }
    } else {
      // TODO report error to Wizard ??
    }
  }

  _onDragEnter (event) {
    this.$.ripple.downAction(event);
    event.preventDefault();
  }

  _onDragLeave (event) {
    this.$.ripple.upAction();
    event.preventDefault();
  }

  _disabledChange (value) {
    if ( value === true ) {
      this.$.upload.shadowRoot.querySelector('vaadin-button').setAttribute('disabled', true);
    } else {
      this.$.upload.shadowRoot.querySelector('vaadin-button').removeAttribute('disabled');
    }
  }
}

window.customElements.define(CasperWizardUploadPage.is, CasperWizardUploadPage);
