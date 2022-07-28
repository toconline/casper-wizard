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
  static get template() {
    return html``;
  }

  async appendPagesAndActivate(index) {
    if (this.options.title) {
      this.setTitle(this.options.title);
    }
    for (const p of this.options.pages) {
        const pagePath = p.split('/');
        let tempPath = p.split('/')
        tempPath.splice(-1);
        const componentDir = tempPath.length > 0 ? tempPath.join("/") : undefined;
        const componentName = pagePath[pagePath.length - 1];
        const componentNameDigested = [
            componentDir,
            app.digest ? app.digest + '.' + componentName : componentName
        ].filter(e => e).join('/');
        const importUrl = `/src/${componentNameDigested}.js`;
        await import(importUrl);
        const page = document.createElement(componentName);
        page.classList.add('page-lit', 'slide-in');
        page.id = componentName;
        page.wizard = this;
        this._pages.push(page);
    }
    super.appendPagesAndActivate(index);
    // ... build tabs if they are not surpressed ...
    if (this.notabs === undefined || this.notabs === false) {
      this._createTabs();
    }
  }

  hideStatusAndProgress() {
    const ndis = this._nextButton.disabled;
    super.hideStatusAndProgress();
    this._nextButton.disabled = ndis;
  }

  /**
   * Override base class to provide custom and corrected handling of subscriptions
   *
   * @param {Object} response the job status either retrieved from redis or pushed with a redis notification
   *
   * @note There's a ton a legacy here, but I am going the safe way and avoided touching the case class
   */
  _subscribeJobResponse(response) {
    if (typeof response.status === 'object') {
      // ... the status of a non-transient job was retrieved from redis that's why status is an object ...
      const status = response.status;

      if (status.status === 'queued') {
        // TODO a timer to protect this???
        console.log('The job is late for the date');
      } else if (status.status === 'completed') {
        // ... the job already finished just return the response ...
        this._jobPromise.resolve(status.response.response || status.response);
        super.close();
      } else {
        // ... it's in intermediate state, let's go down the progress road ...
        if (Array.isArray(status.progress)) {
          // ... array of multiple progresses as sent by the SP-JOB
          let idx = 0;
          status.progress.forEach((element) => {
            this._updateUI({
              progress: status.progress[idx].value,
              message: status.progress[idx].message,
              status: status.status,
              index: idx,
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
