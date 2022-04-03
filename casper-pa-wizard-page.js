/*
  - Copyright (c) 2014-2022 Cloudware S.A. All rights reserved.
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

import { LitElement, css } from 'lit';
import { CasperSocketPromise } from  '@cloudware-casper/casper-socket/casper-socket.js';

export class CasperPaWizardPage extends LitElement {

  static styles = css`
    :host {
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      padding: 24px 24px 0 24px;
    }`;

  jobCompleted (notification) {
    this._jobPromise.resolve(notification);
  }

  error (notification) {
    this._jobPromise.reject(notification);
  }

  async execJob (job, timeout, ttr) {
    this._jobPromise = new CasperSocketPromise();
    const ppage = this.wizard.submitJobWithStrictValidity(job, timeout, ttr, true);
    ppage.updateProgress(0, 'Em fila de espera. Por favor, aguarde', 1);
    return this._jobPromise;
  }

  showResponse (response) {
    this.wizard.showStatusPage(response);
    this.wizard._statusPage.showResponse(response)
  }

  showError (error) {
    if ( Array.isArray(error.message) === false ) {
      error.message = [ error.message , {}];
    }
    this.wizard.showFatalError(error);
  }

  hideStatusAndProgress () {
    this.wizard.hideStatusAndProgress();
  }

  previousPage () {
    this.wizard.previousPage();
  }

  nextPage () {
    this.wizard.nextPage();
  }

}