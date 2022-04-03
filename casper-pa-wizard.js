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
  static get template () {
    return html``;
  }
  
  async appendPagesAndActivate (index) {
  
    if ( this.options.title ) {
      this.setTitle(this.options.title);
    }
  
    for (const p of this.options.pages ) {
      await import(`/src/${app.digest}${p.page}.js`);
      const page = document.createElement(p.page);
        
      if ( p.previous ) page.setAttribute('previous', p.previous);
      if ( p.next ) page.setAttribute('next', p.next);
      
      page.classList.add('page-lit', 'slide-in');
      page.id = p.id;
      page.wizard = this;
      this._pages.push(page);
    }
      
    super.appendPagesAndActivate(index);
  
    // ... build tabs if they are not surpressed ...
    if (this.notabs === undefined || this.notabs === false) {
      this._createTabs();
    }
  }
}