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


import './casper-wizard-iframe-page.js';
import './casper-wizard-progress-page.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@cloudware-casper/casper-icons/casper-icon.js';
import '@cloudware-casper/casper-icons/casper-icon-button.js';
import '@cloudware-casper/casper-toast/casper-toast.js';
import { CasperWizardPage } from './casper-wizard-page.js';
import { CasperPaWizardPage } from './casper-pa-wizard-page.js';
import { CasperWizardUploadPage } from './casper-wizard-upload-page.js';
import { CasperWizardStatusPage } from './casper-wizard-status-page.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { Casper } from '@cloudware-casper/casper-common-ui/casper-i18n-behavior.js';
import { CasperOverlayBehavior } from '@cloudware-casper/casper-overlay-behavior/casper-overlay-behavior.js';

export class CasperWizard extends mixinBehaviors(CasperOverlayBehavior, Casper.I18n(PolymerElement)) {
  static get template () {
    return html`
      <style>
        :host {
          --accept-color: #EF5350;
          --accept-normal-color: var(--primary-color);
          --reject-color: #EF5350;
        }

        .button-animation {
          -moz-transition: width 0.5s;
          -webkit-transition: width 0.5s;
          -o-transition: width 0.5s;
          -ms-transition: width 0.5s;
          transition: width 0.5s;
        }

        .wizard-button {
          background-color: var(--primary-color);
          transition: background 0.5s;
          transition: color 0.5s;
        }

        .wizard-button:hover{
          transition: background 1s;
          transition: color 0.5s;
        }

        .wizard-button[disabled] {
          border: none;
          color: white;
          background-color: #e0e0e0;
        }

        .wizard-container {
          display: grid;
          overflow: hidden;
          background-color: white;
          grid-template-rows: 42px 1fr 60px;
          border-radius: var(--roundie, 10px);
        }

        .wizard-container .header {
          margin: 0;
          color: white;
          height: 42px;
          display: flex;
          padding: 0 12px;
          font-size: 18px;
          overflow: hidden;
          font-weight: bold;
          flex-direction: row;
          align-items: center;
          white-space: nowrap;
          text-overflow: ellipsis;
          justify-content: space-between;
          background-color: var(--primary-color);
        }

        .wizard-container .header .title {
          width: 97%;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .wizard-container .header .wizard-close-button {
          padding: 0;
          z-index: 4;
          color: #FFF;
          width: 25px;
          height: 25px;
        }

        .wizard-close-button {
          background: transparent;
          border: none;
          color: #FFF;
        }

        .wizard-close-button:hover {
          background-color: #00000040;
        }

        .wizard-container .page-container {
          width: 100%;
          flex: auto;
          display: flex;
          overflow-y: auto;
          overflow-x: hidden;
          position: relative;
        }

        .wizard-container .footer-container {
          height: 60px;
          display: flex;
          padding: 10px 10px 10px 20px;
          box-sizing: border-box;
          justify-content: space-between;
        }

        .wizard-container .footer-container > div {
          height: 100%;
          display: flex;
          flex-direction: row;
          align-items: center;
        }

        .wizard-container .wizard-tabs {
          top: 0px;
          left: 0px;
          width: 100%;
          height: 100%;
          position: absolute;
          background-color: #858585;
          opacity: 0.8;
          z-index: -1;
          border-radius: var(--roundie, 10px);
        }

        .wizard-container .wizard-tabs .wizard-tab {
          top: 0px;
          position: absolute;
          width: var(--tab-width);
          height: 100%;
          background-color: black;
          font-size: 20px;
          font-weight: bold;
          z-index: -1;
        }

        .wizard-container .wizard-tabs .wizard-tab-label {
          position: absolute;
          bottom: 20px;
          color: #cbcbcb;
          font-weight: bold;
          font-size: 18px;
          z-index: 1;
        }

        .wizard-next-button {
          height: 40px;
          min-width: 40px;
          padding: 0;
          border-radius: 20px;
          font-size: 14px;
          font-weight: bold;
          -webkit-font-smoothing: antialiased;
          background-color: var(--button-primary-color);
          border: 2px solid var(--button-primary-color);
          color: white;
        }


        .wizard-next-button:hover {
          background-color: var(--light-primary-color);
          border: 2px solid var(--button-primary-color);
          color: var(--button-primary-color);
        }

        .wizard-next-button:hover .wizard-icon-next-button {
          color: var(--button-primary-color);
        }

        .wizard-button:focus {
          outline: #46a9ff4d solid 4px;
        }

        .wizard-icon-next-button {
          width: 25px;
          height: 25px;
          color: #fff;
        }

        .wizard-text {
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .wizard-previous-button {
          z-index: 4;
          min-width: 40px;
          min-height: 40px;
          padding: 0;
          border-radius: 20px;
          font-size: 14px;
          font-weight: bold;
          -webkit-font-smoothing: antialiased;
          background-color: white;
          color: var(--primary-color);
          border: 2px solid var(--primary-color);
        }

        .wizard-previous-button:hover {
          border-color: var(--button-primary-color);
          background-color: var(--light-primary-color, var(--button-primary-color));
          color: var(--button-primary-color);
          transition: all 0.5s;
        }


        .wizard-previous-button:hover .wizard-icon-next-button {
          color: var(--button-primary-color);
        }

        .wizard-icon-previous-button {
          width: 25px;
          height: 25px;
          border-radius: 20px;
          box-sizing: border-box;
        }

        .page  {
          top: 0;
          opacity: 1;
          height: 100%;
          display: grid;
          grid-template-rows: 42px 1fr;
          position: absolute;
          background-color: var(--surface-color, #FFF);
          border-radius: 0px 0px var(--roundie, 10px) var(--roundie, 10px);
        }

        .page-lit {
          top: 0;
          opacity: 1;
          position: absolute;
          background-color: var(--surface-color, #FFF);
          border-radius: 0px 0px var(--roundie, 10px) var(--roundie, 10px);
        }

        @supports (-ms-ime-align: auto) {
          .page {
            border-radius: 0px 0px 8px 8px;
          }
        }

        .fade-out {
          opacity: 0 !important;
        }

        .fade-in {
          opacity: 1 !important;
        }

        .fade-animation {
          -moz-transition: opacity .75s ease-in-out;
          -webkit-transition: opacity .75s ease-in-out;
          -o-transition: opacity .75s ease-in-out;
          -ms-transition: opacity .75s ease-in-out;
          transition: opacity .75s ease-in-out;
        }

        #footer-slot-container {
          opacity: 0;
          -moz-transition: opacity .75s ease-in-out;
          -webkit-transition: opacity .75s ease-in-out;
          -o-transition: opacity .75s ease-in-out;
          -ms-transition: opacity .75s ease-in-out;
          transition: opacity .75s ease-in-out;
        }

        .slide-in {
          visibility: visible;
          -moz-transition: transform var(--slide-anim) ease-in-out, opacity .75s ease-in-out;
          -webkit-transition: transform var(--slide-time) ease-in-out, opacity .75s ease-in-out;
          -o-transition: transform var(--slide-time) ease-in-out, opacity .75s ease-in-out;
          -ms-transition: transform var(--slide-time) ease-in-out, opacity .75s ease-in-out;
          transition: transform var(--slide-time) ease-in-out, opacity .75s ease-in-out;
        }

        .tabslide {
          -moz-transform: translateZ(0);
          -webkit-transform: translateZ(0);
          -o-transform: translateZ(0);
          -ms-transform: translateZ(0);
          transform: translateZ(0);
          -moz-transition: left 0.3s ease-in-out;
          -webkit-transition: left 0.3s ease-in-out;
          -o-transition: left 0.3s ease-in-out;
          -ms-transition: left 0.3s ease-in-out;
          transition: left 0.3s ease-in-out;
        }

        .left {
          visibility: hidden;
          transform: translate3d(-100%, 0, 0);
          -moz-transform: translate3d(-100%, 0, 0);
          -webkit-transform: translate3d(-100%, 0, 0);
          -o-transform: translate3d(-100%, 0, 0);
          -ms-transform: translate3d(-100%, 0, 0);
        }

        .right {
          visibility: hidden;
          -moz-transform: translate3d(100%, 0, 0);
          -webkit-transform: translate3d(100%, 0, 0);
          -o-transform: translate3d(100%, 0, 0);
          -ms-transform: translate3d(100%, 0, 0);
          transform: translate3d(100%, 0, 0);
        }

        .hide-button {
          margin-left: 50%;
          z-index: -1;
        }

        .page.page--no-title {
          grid-template-rows: 1fr;
        }

      </style>

      <div class="wizard-container">
        <div class="wizard-tabs tabslide"></div>
        <div class="header">
          <div class="title"></div>
          <casper-icon-button tooltip="Fechar" class="wizard-close-button" icon="fa-light:times-circle"></casper-icon-button>
        </div>
        <div class="page-container"></div>
        <div class="footer-container">
          <div id="footer-slot-container"></div>
          <div>
            <paper-button id="wizardPrevButton" class="wizard-button wizard-previous-button button-animation">
              <casper-icon id="wizardPreviousIcon" class="wizard-icon-previous-button" icon="fa-light:arrow-left"></casper-icon>
              <span class="wizard-text"></span>
            </paper-button>

            <paper-button id="wizardNextButton" class="wizard-button wizard-next-button button-animation">
              <casper-icon id="wizardNextIcon" class="wizard-icon-next-button" icon="fa-light:arrow-right"></casper-icon>
              <span class="wizard-text"></span>
            </paper-button>
          </div>
        </div>
      </div>
      <casper-toast duration="5000"></casper-toast>
    `;
  }

  static get is () {
    return 'casper-wizard';
  }

  static get tabOpacity () {
    return 0.3;
  }

  static get fadeInTimeout () {
    return 300;
  }

  static get defaultMaximumHeight () {
    return '90vh';
  }

  static get defaultMaximumWidth () {
    return '90vw';
  }

  static get defaultDimensions () {
    return {
      width: '800px',
      height: '520px'
    };
  }

  get channel () {
    return this._jobChannel;
  }

  get statusPageTag () {
    return 'casper-wizard-status-page';
  }

  get statusPageDisplay () {
    return 'block';
  }

  get progressPageTag () {
    return 'casper-wizard-progress-page';
  }

  get progressPageDisplay () {
    return 'block';
  }

  /**
   * Constructor, grabs the pages that will be displayed and moves them in the DOM
   */
  ready () {
    super.ready();

    // ... inject the base class template into the component ...
    this.shadowRoot.appendChild(CasperWizard.template.content.cloneNode(true));

    this.style.setProperty('--tab-width', '30px');
    this.style.setProperty('--slide-time', '0.5s');
    this.style.setProperty('--roundie', 'var(--radius-primary, 10px)');

    // ... make sure all existing pages get the 'page' class
    for (let page of this.shadowRoot.children) {
      if (page instanceof CasperWizardPage || page instanceof CasperPaWizardPage) {
        if ( page instanceof CasperPaWizardPage ) {
          page.classList.add('page-lit', 'slide-in');
        } else {
          page.classList.add('page', 'slide-in');
        }

        if (page.hasAttribute('hide-title')) {
          page.classList.add("page--no-title");
        }
      }
    }

    // ... collect the active wizard pages ...
    this._pages = [];
    let pageIdList = null;
    if (typeof this.activePagesIds === 'function') {
      pageIdList = this.activePagesIds();
    }
    if (pageIdList) {
      // If the page is not in the list hide it
      for (let page of this.shadowRoot.children) {
        if (page instanceof CasperWizardPage || page instanceof CasperPaWizardPage) {
          if (!pageIdList.includes(page.id)) {
            page.style.display = 'none';
          }
        }
      }
      // ... use the explict page list ...
      for (let id of pageIdList) {
        let page = this.$[id];
        this._pages.push(page);
        page.wizard = this;
      }
    } else {
      // ... grab all children that extend casper-wizard-page ...
      for (let page of this.shadowRoot.children) {
        if (page instanceof CasperWizardPage || page instanceof CasperPaWizardPage) {
          this._pages.push(page);
          page.wizard = this;
        }
      }
    }

    // ... keep handy pointers to the template elements ...
    this._title = this.shadowRoot.querySelector('.title');
    this._wizardTabs = this.shadowRoot.querySelector('.wizard-tabs');
    this._wizardContainer = this.shadowRoot.querySelector('.wizard-container');
    this._prevButton = this.shadowRoot.querySelector('#wizardPrevButton');
    this._nextButton = this.shadowRoot.querySelector('#wizardNextButton');
    this._nextButtonIcon = this.shadowRoot.querySelector('#wizardNextIcon');
    this._closeButton = this.shadowRoot.querySelector('.wizard-close-button');
    this._pageContainer = this.shadowRoot.querySelector('.wizard-container .page-container');
    this._footerSlotContainer = this.shadowRoot.querySelector('.wizard-container #footer-slot-container');
    this._state = 'normal';
    this._nextClosesWizard = false;

    if (typeof (ConfirmModal) === "undefined" || !(this instanceof ConfirmModal)) {
      this.appendPagesAndActivate(0);
    }

    // ... install event handlers ...
    this._prevButton.addEventListener('tap', () => this._gotoPreviousPage());
    this._nextButton.addEventListener('tap', () => this._gotoNextPage());
    this._closeButton.addEventListener('tap', () => this._closePage());
    window.addEventListener('resize', () => this._applyDimensions());

    if (this?.options?.dimensions) {
      this.overrideWizardDimensions(this.options.dimensions);
    } else {
      this._setWizardDefaultDimensions();
    }

    // ... needed to hide jumps caused by changes in the wizard's dimensions ...
    if (this?.options?.hasOwnProperty('initial_opacity')) {
      this.style.opacity = this.options.initial_opacity;
    }

    // ... grab constants from CSS ...
    let style = window.getComputedStyle(this);
    this._slideTime = parseFloat(style.getPropertyValue('--slide-time')) * 1000;
    this._tabWidth = parseFloat(style.getPropertyValue('--tab-width'));
    this._roundie = parseFloat(style.getPropertyValue('--roundie'));

    // ... build tabs if they are not surpressed ...
    if (this.notabs === undefined || this.notabs === false) {
      this._createTabs();
    }


    // ... some options ...
    this.toast = this.shadowRoot.querySelector('casper-toast');
    this.toast.onclick = () => this.toast.close();
    this.noCancelOnEscKey = false;
    this.noCancelOnOutsideClick = true;
    this.errorsAreFatal = true;
    this._jobId = this._jobChannel = undefined;

    this._setControlledSubmission();

    this.addEventListener('opened-changed', e => this.__onOpenedChanged(e));
  }

  appendPagesAndActivate (index) {
    // ... move the wizard pages from the wizard into the page container ...
    this._pages.forEach(page => this._pageContainer.appendChild(page));
    if ( this._pages.length ) {
      this._gotoPage(index);
    }
  }

  connectedCallback () {
    super.connectedCallback();

    if (this.options && this.options.job_id) {
      this.subscribeJob(this.options.job_id, 86400);
      if (this.options.progress_count) {
        this._progressPage.setProgressCount(this.options.progress_count, true);
      }
      this._progressPage.updateProgress(0, "Em progresso", NaN);
    }
  }

  //***************************************************************************************//
  //                                                                                       //
  //                      ~~~ API to be used by the Wizards of Oz ~~~                      //
  //                                                                                       //
  //***************************************************************************************//

  setOptions (options) {
    this.options = options;
  }

  setTitle (title) {
    this._title.textContent = title;
  }

  setPageTitle (pageId, title) {
    let pageIndex = this._getIndexOf(pageId);
    if (pageIndex !== undefined) {
      this._pages[pageIndex].pageTitle = title;
    }
  }

  hidePrevious () {
    this._prevButton.hidden = true;
  }

  showPrevious () {
    this._prevButton.hidden = false
  }

  enablePrevious () {
    if (this._prevButton.disabled === true) {
      this._prevButton.querySelector('casper-icon').icon = 'fa-light:arrow-left';
      this._prevButton.disabled = false;
    }
  }

  disablePrevious () {
    if (this._prevButton.disabled === false) {
      this._prevButton.querySelector('casper-icon').icon = 'fa-light:arrow-left';
      this._prevButton.disabled = true;
    }
  }

  enableNext () {
    this._nextButton.disabled = false;
  }

  disableNext () {
    this._nextButton.disabled = true;
  }

  nextPage () {
    if (this._pageIndex < this._pages.length - 1) {
      this._activatePage(this._pageIndex + 1);
    }
  }

  previousPage () {
    if (this._pageIndex >= 1) {
      this._activatePage(this._pageIndex - 1);
    }
  }

  gotoPage (pageId) {
    let pageIndex = this._getIndexOf(pageId);
    if (pageIndex !== undefined) {
      this._gotoPage(pageIndex);
      let page = this._pages[pageIndex];
      if (page.hasAttribute('next')) {
        this._changeNextButtonToText(page.getAttribute('next'));
      } else {
        this._changeNextButtonToIcon();
      }
    }
  }

  hideStatusAndProgress () {
    clearTimeout(this._fadeInTimer);
    if (this._progressPage !== undefined) {
      this._progressPage.style.display = 'none';
      this._progressPage.style.opacity = 0;
      this._progressPage.setProgressCount(1, true);
    }
    if (this._statusPage !== undefined) {
      this._statusPage.style.display = 'none';
      this._statusPage.style.opacity = 0;
      if ( this._statusPage instanceof CasperWizardStatusPage ) {
        this._statusPage.icon = CasperWizardStatusPage.properties.icon.value;
        this._statusPage.message = CasperWizardStatusPage.properties.message.value;
      }
    }
    this._state = 'normal';
    this._nextButton.disabled = false;

    this._footerSlotContainer.classList.add('fade-in');
    this._getCurrentPage().classList.remove('fade-out');
  }

  submitJob (job, timeout, ttr) {
    this.showProgressPage();
    job.validity = timeout;
    this._setControlledSubmission();
    this.socket.submitJob(job, this._submitJobResponse.bind(this), { validity: timeout, ttr: ttr === undefined ? timeout : ttr, timeout: timeout });
  }

  /**
   *
   * @param {Object}  job
   * @param {Integer} timeout
   * @param {Integer} ttr
   *
   * @return the progress page
   */
  submitJobWithStrictValidity (job, timeout, ttr, hideTimeout) {
    const ltimeout = parseInt(timeout);
    const lttr     = parseInt(ttr);

    if ( isNaN(ltimeout) || isNaN(lttr) ) {
      throw 'Strict timing requires valid ttr and timeout!!!';
    }
    job.validity = ltimeout - lttr - 2; // 2 seconds safety margin
    if ( job.validity < 1 ) {
      throw 'Strict timing requires a timeout greater than ttr + 3!!!")';
    }
    this.showProgressPage();
    this._setControlledSubmission();
    this.socket.submitJob(job, this._submitJobResponse.bind(this), { validity: job.validity, ttr: lttr, timeout: ltimeout, hideTimeout: !!hideTimeout });
    return this._progressPage;
  }

  submitControlledJob (job, timeout, ttr) {
    this.showProgressPage();
    job.destination_tube = job.tube;
    job.tube = 'job-controller';
    job.notification_title = job.notification_title || 'Tarefa em segundo plano';
    job.validity = timeout;
    job.ttr = (ttr || timeout);

    this._setControlledSubmission(true, job.ttr);

    this.socket.submitJob(job, this._submitJobResponse.bind(this), { validity: timeout, ttr: ttr === undefined ? timeout : ttr, timeout: timeout });
  }

  subscribeJob (jobId, timeout) {
    this.showProgressPage();
    this.socket.subscribeJob(jobId, this._subscribeJobResponse.bind(this), timeout);
  }

  showProgressPage () {
    if (this._state === 'show-progress') {
      return;
    }

    clearTimeout(this._fadeInTimer);

    if (this._statusPage !== undefined) {
      this._statusPage.style.display = 'none';
      this._statusPage.style.opacity = 0;
    }

    // ... create page if needed ...
    if (this._progressPage === undefined) {
      this._progressPage = document.createElement(this.progressPageTag);
      this._progressPage.title = 'Progresso em curso';
      this._progressPage.style.zIndex = 3;
      this._progressPage.style.opacity = 0;
      this._progressPage.style.position = 'absolute';
      this._progressPage.classList.add('fade-animation');
      this._progressPage.sideBySide = !!this.options?.progressOptions?.sideBySide;
      this._pageContainer.appendChild(this._progressPage);
    }

    // ... show progress page
    this._state = 'show-progress';
    this.disableNext();

    this._fadeInTimer = setTimeout(() => {
      this._progressPage.style.display = this.progressPageDisplay;
      this._progressPage.classList.add('fade-in');

      this._footerSlotContainer.classList.remove('fade-in');
      this._getCurrentPage().classList.add('fade-out');
      if (this._footerSlotContainer.children.length === 1) {
        this._getCurrentPage().appendChild(this._footerSlotContainer.firstChild);
      }
    }, CasperWizard.fadeInTimeout);
  }

  showStatusPage (notification) {
    if (this._state === 'show-status') {
      return;
    }

    clearTimeout(this._fadeInTimer);

    // ... hide current pages ...
    if (this._progressPage !== undefined) {
      this._progressPage.style.display = 'none';
      this._progressPage.style.opacity = 0;
    }
    // ... create page if needed ...
    if (this._statusPage === undefined) {
      this._statusPage = document.createElement(this.statusPageTag);
      this._statusPage.style.zIndex = 2;
      this._statusPage.style.opacity = 0;
      this._statusPage.style.position = 'absolute';
      this._statusPage.classList.add('fade-animation');
      this._pageContainer.appendChild(this._statusPage);
    }

    if (notification.custom === true) {
      // ... set custom html message ...
      this._statusPage.setCustom(notification.message[0]);
    } else {
      // ... set standard message and or icons ...
      this._statusPage.clearCustom();
      if (notification && notification.title) {
        this._statusPage.title = this.i18n.apply(this, notification.title);
      }
      this._statusPage.message = this.i18n.apply(this, notification.message || [notification?.response?.body?.message]);
      if (notification.response !== undefined && notification.response.title !== undefined) {
        this._statusPage.title = notification.response.title;
      }
      if (notification.response !== undefined && notification.response.message_icon !== undefined) {
        this._statusPage.icon = notification.response.message_icon;
        this._statusPage.$.statusIcon.style.color = notification.response.color_icon;
      }
    }

    // show status page
    this._state = 'show-status';
    this.enablePrevious();
    this.disableNext();

    this._fadeInTimer = setTimeout(() => {
      this._statusPage.style.display = this.statusPageDisplay;
      this._statusPage.classList.add('fade-in');

      this._footerSlotContainer.classList.remove('fade-in');
      this._getCurrentPage().classList.add('fade-out');
      if (this._footerSlotContainer.children.length === 1) {
        this._getCurrentPage().appendChild(this._footerSlotContainer.firstChild);
      }
    }, CasperWizard.fadeInTimeout);
  }

  /**
   * Shows an error that is considered fatal, i.e. the next button will close the wizard
   *
   * @param {Object} notification an error notification returned by the server
   */
  showFatalError (notification) {
    this._nextClosesWizard = true;
    this.hidePrevious();
    this.changeNextButtonToText('Fechar');
    this.showStatusPage(notification);
    this.enableNext();
  }

  /**
   * Show toast at the bottow of the wizard
   *
   * @param {String} message the text to display.
   * @param {Boolean} success controls the style, false for errors, true for positive messages.
   */
  openToast (message, success) {
    this.toast.backgroundColor = success ? 'var(--primary-color)' : 'var(--error-color)';
    this.toast.fitInto = this;
    this.toast.text = message;
    this.toast.open();
  }

  /**
   * Sets the wizard to the specified fixed dimensions.
   *
   * @param {Object} Object that contains the new dimensions that can be specified in px, vh and vw.
   */
  overrideWizardDimensions (dimensions) {
    this.wizardDimensions = {
      width: dimensions.width,
      height: dimensions.height,
    };

    this._applyDimensions();
    this._setWizardTabsDimensions();
  }

  
  /* Needed to hide jumps caused by changes in the wizard's dimensions */
  fixWizardOpacity () {
    if (this.options.hasOwnProperty('initial_opacity') && window.getComputedStyle(this).opacity === '0') {
      this.style.removeProperty('opacity');
    }
  }

  overrideWizardButtons (cssProps) {
    for (const [button, buttonProps] of Object.entries(cssProps)) {
      const element = this.shadowRoot.querySelector(`.wizard-${button}-button`);

      if (buttonProps?.className) {
        element.classList.remove('.confirm-accept-normal-button');
        element.classList.remove('.confirm-accept-button');
        element.classList.remove(buttonProps.className);
        element.classList.add(buttonProps.className);
      }

      const styleToApply = buttonProps?.style || buttonProps;

      for (const [key, value] of Object.entries(styleToApply)) {
        element.style[key] = value;
      }


    }
  }

  overrideWizardHeader (cssProps) {
    const element = this.shadowRoot.querySelector('.header');
    for (const [key, value] of Object.entries(cssProps)) {
      element.style[key] = value;
    }
  }

  /**
   * Remove a page by its identifier and re-draw the tabs.
   *
   * @param {String} The identifier for the page that needs to be removed.
   */
  removePageById (pageIdentifier) {
    const pageIndex = this._pages.findIndex(page => page.id === pageIdentifier);

    // Disallow the removal of the current page.
    if (this._pageIndex === pageIndex) return;

    this._pages.splice(pageIndex, 1);
    this._createTabs();
    this._setWizardTabsDimensions();

    // Activate the current page to trigger the tabs re-draw.
    this._pageIndex = pageIndex > this._pageIndex
      ? this._pageIndex
      : this._pageIndex - 1;

    this._activatePage(this._pageIndex);
  }

  showCustomNotification (notification) {
    this.showStatusPage(notification);
    this.disablePrevious();
    this._changeNextButtonToText('Fechar');
    this.enableNext();
    this._nextClosesWizard = true;
  }

  close () {
    if (this.options && this.options.closeAllWizards === true) {
      this.app.closeOtherWizards(this);
    }
    super.close();
  }

  //***************************************************************************************//
  //                                                                                       //
  //                    ~~~ Internals of the underworld implementaion ~~~                  //
  //                                                                                       //
  //***************************************************************************************//

  _gotoPreviousPage () {

    if (this._slideTimeout !== undefined) {
      return;
    }

    let page = this._pageIndex;
    if (page >= 1) {
      page -= 1;
      if (typeof this._getCurrentPage().previous === 'function') {
        this._getCurrentPage().previous();
      } else if (typeof this['previousOn' + this._getCurrentPage().id] === 'function') {
        this['previousOn' + this._getCurrentPage().id].apply(this);
      } else {
        this._activatePage(page);
      }
    } else {
      if (typeof this._getCurrentPage().previous === 'function') {
        this._getCurrentPage().previous();
      } else if (typeof this['previousOn' + this._getCurrentPage().id] === 'function') {
        this['previousOn' + this._getCurrentPage().id].apply(this);
      }
    }
  }

  _gotoNextPage () {

    if (this._slideTimeout !== undefined) {
      return;
    }

    if (this._nextClosesWizard === true) {
      this.close();
      return;
    }

    if (this._pageIndex < this._pages.length - 1) {
      if (typeof this._getCurrentPage().next === 'function') {
        this._getCurrentPage().next();
      } else if (typeof this['nextOn' + this._getCurrentPage().id] === 'function') {
        this['nextOn' + this._getCurrentPage().id].apply(this);
      } else {
        this._activatePage(this._pageIndex + 1);
      }
    } else {
      if (typeof this._getCurrentPage().next === 'function') {
        this._getCurrentPage().next();
      } else if (typeof this['nextOn' + this._pages[this._pages.length - 1].id] === 'function') {
        this['nextOn' + this._pages[this._pages.length - 1].id].apply(this);
      } else {
        this.close();
      }
    }
  }

  _gotoNextPageNoHandlers () {

    if (this._slideTimeout !== undefined) {
      return;
    }

    if (this._pageIndex < this._pages.length - 1) {
      this._activatePage(this._pageIndex + 1);
    } else {
      this.close();
    }
  }

  _changeButtonToText (selector, text) {
    const buttonSelector = this.shadowRoot.querySelector(selector);
    const wizardIcon = buttonSelector.querySelector('casper-icon');
    const buttonText = buttonSelector.querySelector('.wizard-text');

    buttonText.textContent = text;
    buttonText.style.display = 'flex';
    wizardIcon.style.display = 'none';

    // Apply padding of 20px on both sides.
    const buttonTextWidth = this._calculateTextWidth(buttonSelector, text.toUpperCase());
    buttonSelector.style.width = `${buttonTextWidth + 40}px`;
  }

  _changeButtonToIcon (selector) {
    const buttonSelector = this.shadowRoot.querySelector(selector);
    const wizardIcon = buttonSelector.querySelector('casper-icon');
    const buttonText = buttonSelector.querySelector('.wizard-text');

    buttonText.textContent = '';
    buttonText.style.display = 'none';
    buttonSelector.style.width = '40px';
    wizardIcon.style.display = 'block';
  }

  changePreviousButtonToText (text) {
    this._changeButtonToText('#wizardPrevButton', text);
  }

  changePreviousButtonToIcon () {
    this._changeButtonToIcon('#wizardPrevButton');
  }

  changeNextButtonToText (text) {
    this._changeButtonToText('#wizardNextButton', text);
  }

  changeNextButtonToIcon () {
    this._changeButtonToIcon('#wizardNextButton');
  }

  _changeNextButtonToText (text) {
    this._changeButtonToText('#wizardNextButton', text);
  }

  _changeNextButtonToIcon () {
    this._changeButtonToIcon('#wizardNextButton');
  }

  _gotoPage (pageIndex) {
    this._activatePage(pageIndex);
    this._wizardTabs.style.left = - this._tabWidth * this._pageIndex + 'px';
    this._updateWizardButtons();
    this.hideStatusAndProgress();
  }

  _getIndexOf (pageId) {
    let page = this._pageContainer.querySelector('#' + pageId);
    if (!page) {
      return undefined;
    }
    return Array.prototype.indexOf.call(this._pageContainer.children, page);
  }

  _activatePage (pageIndex) {
    const previousPageIndex = this._pageIndex;
    let closingWizard = (pageIndex == 0 && previousPageIndex !== undefined);

    this._pageIndex = pageIndex;
    this.hideStatusAndProgress();

    pageIndex === 0 ? this.disablePrevious() : this.enablePrevious();

    // Prevent enterOn execution on close of wizard
    if (!closingWizard) {
      if (typeof this._getCurrentPage().enter === 'function') {
        this._getCurrentPage().enter();
      } else if (typeof this['enterOn' + this._getCurrentPage().id] === 'function') {
        this['enterOn' + this._getCurrentPage().id].apply(this);
      }
    }

    this._pages.forEach((page, pageIndex) => {
      page.style.overflow = 'auto';
      if (pageIndex !== this._pageIndex) {
        // Begin the fading transition and reset the z-index.
        page.style.zIndex = 1;
        page.classList.add('fade-out');
      } else {
        const page = this._getCurrentPage();
        page.style.zIndex = 2;
        page.classList.remove('left', 'right', 'fade-out');
        this._wizardTabs.style.left = - this._tabWidth * this._pageIndex + 'px';
        this._slideTimeout = setTimeout(() => this._pageSlideTimer(), this._slideTime);

        if (page.hasAttribute('previous')) {
          this._changeButtonToText('#wizardPrevButton', page.getAttribute('previous'));
        } else {
          this._changeButtonToIcon('#wizardPrevButton');
        }

        if (page.hasAttribute('next')) {
          this._changeButtonToText('#wizardNextButton', page.getAttribute('next'));
        } else {
          this._changeButtonToIcon('#wizardNextButton');
        }
      }
    });

    if (this._footerSlotContainer.children.length === 1) {
      // If there is already a footer slot element, fade it away and then append the new one.
      this._footerSlotContainer.classList.remove('fade-in');
      setTimeout(() => {
        this._pages[previousPageIndex].appendChild(this._footerSlotContainer.firstChild);
        this._appendFooterSlotElement();
      }, Casper.fadeInTimeout);
    } else {
      // If there are no footer slot at the moment, append right away the new one.
      this._appendFooterSlotElement();
    }

  }

  _appendFooterSlotElement () {
    // See if the current page has an element to append to the footer.
    const footerSlot = this._getCurrentPage().querySelector('[slot=footer]');
    if (footerSlot) {
      this._footerSlotContainer.appendChild(footerSlot);
      this._footerSlotContainer.classList.add('fade-in');
    }
  }

  _pageSlideTimer () {
    this._slideTimeout = undefined;
    this._adjustPageClasses();
    this._updateWizardButtons();
  }

  _adjustPageClasses () {
    this._pages.forEach((page, pageIndex) => {
      if (pageIndex !== this._pageIndex) {
        const pageClass = pageIndex < this._pageIndex ? 'left' : 'right';
        page.classList.add(pageClass);
      }
    });
  }

  _createTabs () {
    let off = 0;
    let w = parseFloat(window.getComputedStyle(this._wizardContainer).getPropertyValue('width')) - 2;
    let opa = CasperWizard.tabOpacity;

    // ... right side tabs ...
    this._wizardTabs.innerHTML = '';
    this._wizardTabs.style.width = w + this._tabWidth * (this._pages.length - 1) + 'px';
    for (let idx = this._pages.length; idx > 1; idx--) {
      let tab = document.createElement('div');
      let lbl = document.createElement('span');

      lbl.textContent = idx;
      lbl.style.right = off + 10 + 'px';
      lbl.classList.add('wizard-tab-label');
      this._wizardTabs.appendChild(lbl);
      tab.style.right = off + 'px';
      tab.classList.add('wizard-tab');
      tab.style.width = this._tabWidth / 2 + (idx * this._tabWidth) + 'px';
      tab.style.opacity = opa;
      tab.style.borderRadius = '0px var(--roundie) var(--roundie) 0px';
      this._wizardTabs.appendChild(tab);
      off += this._tabWidth;
    }

    // ... left side tabs ...
    off = 0;
    for (let idx = this._pages.length; idx > 1; idx--) {
      let tab = document.createElement('div');
      let lbl = document.createElement('span');

      lbl.textContent = (this._pages.length + 1) - idx;
      lbl.style.left = off + 10 + 'px';
      lbl.classList.add('wizard-tab-label');
      this._wizardTabs.appendChild(lbl);
      tab.style.left = off + 'px';
      tab.classList.add('wizard-tab');
      tab.style.width = this._tabWidth / 2 + (idx * this._tabWidth) + 'px';
      tab.style.opacity = opa;
      tab.style.borderRadius = 'var(--roundie) 0px 0px var(--roundie)';
      this._wizardTabs.appendChild(tab);
      off += this._tabWidth;
    }
  }

  _updateWizardButtons () {
    this._nextButtonIcon.icon = this._pageIndex === this._pages.length - 1 && !this._getCurrentPage().hasAttribute('next')
      ? 'fa-light:check'
      : 'fa-light:arrow-right';
  }

  _closePage () {
    this.close();
  }

  _subscribeJobResponse (response) {
    CasperWizard._normalizeServerResponse(response);
    this._updateUI(response);
  }

  static _normalizeServerResponse (response) {
    let status;

    if (response.success === undefined) {
      response.success = true;
    }

    if (typeof response.status === 'object') {
      status = response.status;
    } else {
      status = response;
    }

    if (status.status_code === undefined) {
      response.status_code = response.success ? 200 : 500;
    }

    if (!response.status_code && response.success && status.response && status.status_code && status.action !== 'redirect') {
      if (status.custom) response.custom = status.custom;
      response.message = status.message;
      response.status = status.status;
      response.response = status.response;
      response.status_code = status.status_code;
    }

    if (response.status_code !== 200 && !status.message) {
      if (status.response) {
        try {

          // Catch the error from job if exists
          let detailed_error = status.response.map(element => {
            return element.errors.map(error => {
              return error.detail;
            }).join(";")
          }).join(";");

          if (detailed_error == "" || detailed_error == undefined) {
            throw "No error detail";
          }

          response.detailed_error = true;
          response.message = detailed_error;
        } catch (error) {
          response.detailed_error = false;
          response.message = ['Erro serviço, detalhe técnico: ' + JSON.stringify(status.response)];
        }
        response.status = 'error';
      } else {
        response.message = ['Erro desconhecido status por favor tente mais tarde'];
        response.status = 'error';
      }
    } else {
      if (response.success && status.status === 'error') {
        if (status.custom) response.custom = status.custom;
        response.message = status.message;
        response.status = status.status;
        response.status_code = status.status_code;
      }
    }

    if (status.action === 'redirect' && status.status === 'completed' && response.response === undefined) {
      response.response = {
        public_link: status.public_link,
        redirect: status.redirect
      };
      response.message = ['Redirect'];
      response.status = 'completed';
      response.status_code = 200;
    }
  }

  _submitJobResponse (notification) {
    if (notification.success === true && this._jobId === undefined && notification.id !== undefined) {
      this._jobId = notification.id;
      this._jobChannel = notification.channel;
      this.noCancelOnEscKey = true;
    }
    CasperWizard._normalizeServerResponse(notification);
    this._updateUI(notification);
  }

  _updateUI (notification) {
    switch (notification.status) {
      case 'in-progress':
        this.showProgressPage();
        if (notification.index + 1 > this._progressPage.progressCount) {
          this._progressPage.setProgressCount(notification.index + 1);
        }
        this._progressPage.updateProgress(notification.index, this.i18n.apply(this, notification.message), notification.progress);
        if (typeof this['jobProgressOn' + this._getCurrentPage().id] === 'function') {
          this['jobProgressOn' + this._getCurrentPage().id].apply(this, [notification.status_code, notification, notification.response]);
        }
        break;
      case 'completed':
        if (this._controlledSubmission === true) {
          this.subscribeJob(notification.response.channel, this._controlledSubmissionTTR);
          this._setControlledSubmission();
        } else {
          this._updateWizardButtons();
          if (typeof  this._getCurrentPage().jobCompleted === 'function') {
            this._getCurrentPage().jobCompleted(notification);
          } else if (typeof this['jobCompletedOn' + this._getCurrentPage().id] === 'function') {
            if (notification.custom === true) {
              // ... Pass the full notification to allow more flexible custom handling ...
              this['jobCompletedOn' + this._getCurrentPage().id].apply(this, [notification.status_code, notification, notification.response]);
            } else {
              // ... passes only the notification message, it's an array that can be i18n'ed ...
              this['jobCompletedOn' + this._getCurrentPage().id].apply(this, [notification.status_code, notification.message, notification.response]);
            }
          } else {
            if (notification.custom === true) {
              this.showCustomNotification(notification);
            } else {
              if (this._pageIndex === this._pages.length - 1) {
                this.close();
              } else {
                this._gotoNextPageNoHandlers();
              }
            }
          }
          this._clearJob();
        }
        break;
      case 'failed':
      case 'error':
        this._setControlledSubmission();
        if (typeof this._getCurrentPage().error === 'function') {
          this._getCurrentPage().error(notification);
        } else if (typeof this['errorOn' + this._getCurrentPage().id] === 'function') {
          this['errorOn' + this._getCurrentPage().id].apply(this, [notification]);
        } else {
          if ( this.errorsAreFatal === true ) {
            this.showFatalError(notification);
          } else {
            this.showStatusPage(notification);
          }
        }
        this._clearJob();
        break;
      case 'reset':
        break;
      default:
        this._setControlledSubmission();
        break;
    }
  }

  _hideToast () {
    this.toast.close();
  }

  _clearJob () {
    this._jobId = undefined;
    this._jobChannel = undefined;
    this.noCancelOnEscKey = false;
  }

  _getCurrentPage () {
    return this._pages[this._pageIndex];
  }

  __onOpenedChanged (event) {
    this.onOpenedChanged(event);
  }

  onOpenedChanged (event) {
    if (event.detail.value === false) {
      if (this.app) this.app.tooltip.hide();
      for (let page of this._pages) {
        if (page instanceof CasperWizardUploadPage) {
          page.clear();
        }
      }
      this.hideStatusAndProgress();
      this._gotoPage(0);
      if (this._jobId !== undefined) {
        this.socket.cancelJob(this._jobChannel);
      }
      this._clearJob();
      if (typeof this['onWizardClose'] === 'function') {
        this['onWizardClose'].apply(this);
      }
    } else {
      if (this.app) {
        this.app.tooltip.hide();
        this.addEventListener('mousemove', (event) => this.app.tooltip.mouseMoveToolip(event));
      }
    }
  }

  _calculateTextWidth (element, text) {
    if (!this._canvasContext) this._canvasContext = document.createElement('canvas').getContext('2d');

    const elementStyle = window.getComputedStyle(element);

    this._canvasContext.font = `${elementStyle.fontSize} ${elementStyle.fontFamily}`;

    return this._canvasContext.measureText(text).width;
  }

  _setWizardDefaultDimensions () {
    this.wizardDimensions = {
      width: CasperWizard.defaultDimensions.width,
      height: CasperWizard.defaultDimensions.height
    };

    this._applyDimensions();
    this._setWizardTabsDimensions();
  }

  _setWizardTabsDimensions () {
    const containerWidth = parseFloat(window.getComputedStyle(this._wizardContainer).getPropertyValue('width')) - 2;
    this._wizardTabs.style.width = containerWidth + this._tabWidth * (this._pages.length - 1) + 'px';
  }

  _applyDimensions () {
    // Convert the wizard dimensions to numeric values.
    const parsedWidth = this._parseDimension(this.wizardDimensions.width);
    const parsedHeight = this._parseDimension(this.wizardDimensions.height);

    // Check if we can apply the desired dimensions.
    const calculatedWidth = window.innerWidth >= parsedWidth ? `${parsedWidth}px` : CasperWizard.defaultMaximumWidth;
    const calculatedHeight = window.innerHeight >= parsedHeight ? `${parsedHeight}px` : CasperWizard.defaultMaximumHeight;

    this._wizardContainer.style.width = calculatedWidth;
    this._wizardContainer.style.height = calculatedHeight;
    this._pageContainer.style.height = `calc(${calculatedHeight} - 42px - 60px)`;
  }

  _parseDimension (dimension) {
    const dimensionUnit = dimension.trim().slice(-2);

    switch (dimensionUnit) {
      case 'px': return parseFloat(dimension.slice(0, -2));
      case 'vh': return this._convertViewportHeightToPixels(dimension);
      case 'vw': return this._convertViewportWidthToPixels(dimension);
    }
  }

  _convertViewportHeightToPixels (vh) {
    const percentageViewportHeight = parseFloat(vh.replace('vh', '')) / 100;

    return window.innerHeight * percentageViewportHeight;
  }

  _convertViewportWidthToPixels (vw) {
    const percentageViewportWidth = parseFloat(vw.replace('vw', '')) / 100;

    return window.innerWidth * percentageViewportWidth;
  }

  _setControlledSubmission (isControlled = false, ttr = undefined) {
    this._controlledSubmission = isControlled;
    this._controlledSubmissionTTR = ttr;
  }
}

window.customElements.define(CasperWizard.is, CasperWizard);
