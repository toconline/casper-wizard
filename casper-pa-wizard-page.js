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
      padding: 20px 20px 0 20px;
    }`;

  jobCompleted (notification) {
    this.wizard._jobPromise.resolve(Object.keys(notification.response).length ? notification.response : notification);
  }

  error (notification) {
    this.wizard._jobPromise.reject(notification);
  }

  /**
   * Submit a job and return a promise to the caller
   * 
   * @param {Object} job     the job payload
   * @param {Number} timeout in seconds, the maximum time the front will wait for the result
   * @param {Number} ttr     time to run in seconds, maximum execution time on the server (counted after the job starts)
   * @returns the promise for the caller to await on
   */
  async execJob (job, timeout, ttr) {
    this.wizard._jobPromise = new CasperSocketPromise();
    this.wizard.submitJobWithStrictValidity(job, timeout, ttr, true)
      .updateProgress(0, 'Em fila de espera. Por favor, aguarde', 1);
    return this.wizard._jobPromise;
  }

  async subscribeJob (job_id) {
    this.wizard._jobPromise = new CasperSocketPromise();
    this.wizard.subscribeJob(job_id, 86400);
    return this.wizard._jobPromise;
  }

  showResponse (response, close) {
    this.wizard.showStatusPage(response);
    this.wizard._statusPage.showResponse(response)
    if ( close ) {
      this._nextClosesWizard = true;
      this.hidePrevious();
      this.changeNextButtonToText('Fechar');
      this.enableNext();  
    }
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

  hidePrevious () {
    this.wizard.hidePrevious();
  }

  showPrevious () {
    this.wizard.showPrevious();
  }
  
  disablePrevious () {
    this.wizard.disablePrevious();
  }

  enablePrevious () {
    this.wizard.enablePrevious();
  }

  disableNext () {
    this.wizard.disableNext();
  }

  enableNext () {
    this.wizard.enableNext();
  }

  close () {
    this.wizard.close();
  }

  changePreviousButtonToText (text) {
    this.wizard.changePreviousButtonToText(text);
  }

  changePreviousButtonToIcon () {
    this.wizard.changePreviousButtonToIcon();
  }

  changeNextButtonToText (text) {
    this.wizard.changeNextButtonToText(text);
  }

  changeNextButtonToIcon () {
    this.wizard.changeNextButtonToIcon();
  }

  /**
   * Show toast at the bottow of the wizard
   *
   * @param {String} message the text to display.
   * @param {Boolean} success controls the style, false for errors, true for positive messages.
   */
  openToast (message, success) {
    this.wizard.openToast(message, success);
  }

}