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

import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { CasperWizardPage } from './casper-wizard-page.js';
import '@cloudware-casper/casper-upload-dropzone/casper-upload-dropzone.js';

export class CasperWizardUploadPage extends CasperWizardPage {
  static get template () {
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

        casper-upload-dropzone  {
          flex-grow: 2.0;
          overflow: visible;
          cursor: pointer;
          --casper-upload-dropzone-header-icon: {
            width: 75px;
            height: 75px;
          }
        }

      </style>

      <h1 class="pagetitle">[[pageTitle]]</h1>
      <div class="content">
        <slot name="before"></slot>
        <casper-upload-dropzone
          minimalist
          id="upload"
          max-files="1"
          method="POST"
          timeout="300000"
          accept="[[accept]]"
          target="[[uploadUrl]]"
          disabled="[[disabled]]">
        </casper-upload-dropzone>
        <slot name="after">
          <div style="height: 48px;"></div>
        </slot>
      </div>
    `;
  }

  static get is () {
    return 'casper-wizard-upload-page';
  }

  static get properties () {
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
      originalFileType: {
        type: String,
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
      disabled: Boolean,
    };
  }

  ready () {
    super.ready();
    this.$.upload.addEventListener('on-upload-success', e => this._uploadSuccess(e));
  }

  showUpload () {
    this.$.upload.style.display = 'block';
  }

  hideUpload () {
    this.$.upload.style.display = 'none';
  }

  clear () {
    this.$.upload.clearUploadedFiles();
  }

  _uploadSuccess (event) {
    try {
      this.uploadedFilePath = event.detail.uploadedFile;
      this.originalFileSize = event.detail.originalFileSize;
      this.originalFileType = event.detail.originalFileType;
      this.originalFilePath = event.detail.originalFileName;

      const uploadOnSuccessCallback = `uploadSuccessOn${this.wizard._pages[this.wizard._pageIndex].id}`;

      if (typeof this.wizard[uploadOnSuccessCallback] === 'function') {
        this.wizard[uploadOnSuccessCallback].apply(this.wizard);
      }
    } catch (exception) {
      // TODO Handle the error.
    }
  }
}

window.customElements.define(CasperWizardUploadPage.is, CasperWizardUploadPage);
