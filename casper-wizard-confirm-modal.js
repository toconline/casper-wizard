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

import { CasperWizard } from './casper-wizard.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { Casper } from '@cloudware-casper/casper-common-ui/casper-i18n-behavior.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';

class ConfirmWizardConfirmModal extends Casper.I18n(CasperWizard) {
	static get template() {
		return html`
			<style>
				.container {
					display: flex;
				}

				.all_width {
					width: 100%;
				}

				casper-wizard-page .pagetitle {
					display: none;
				}

				.content {
					font-size: 18px;
					color: var(--dark-theme-background-color);
				}

				.errors_list {
					padding: 0 30px;
					color: var(--dark-theme-background-color);
				}

				.errors_list > li {
					padding: 10px;
					border-bottom: 1px var(--dark-theme-background-color) solid;
					margin-bottom: 4px;
				}

				.alert-container {
					padding: 10px;
					border-radius: 4px;
					margin-top: 20px;
					font-size: 14px;
					line-height: 1.4;
				}

				.alert-container[info] {
					color: var(--dark-theme-background-color);
					background: var(--light-primary-color, #ebf1f0);
				}

				.alert-container[warning] {
					color: white;
					background: var(--error-color-soft);
				}




				/* ACCEPT BUTTON (DANGER) */

				/* --accept-color ( RED ) */
				/* --accept-normal-color ( PRIMARY ) */

				.confirm-accept-button {
					background-color: var(--accept-color) !important;
					border-color: var(--accept-color) !important;
					color: white !important;
					font-size: 30px;
				}

				.confirm-accept-button:hover {
					background-color: #F4D4D5 !important;
					border-color: var(--accept-color) !important;
					color: var(--accept-color) !important;
				}



				/* ACCEPT BUTTON */

				.confirm-accept-normal-button {
					background-color: var(--accept-normal-color) !important;
					border-color: var(--accept-normal-color) !important;
					color: white !important;
				}

				.confirm-accept-normal-button:hover {
					background-color: white !important;
					border-color: var(--accept-normal-color) !important;
					color: var(--accept-normal-color) !important;
				}


				/* REJECT BUTTON */

				.confirm-reject-button {
					background-color: white !important;
					border: 2px solid var(--accept-color) !important;
					color: var(--accept-color) !important;
				}

				.confirm-reject-button:hover {
					background-color: #F4D4D5 !important;
					border-color: var(--accept-color) !important;
					color: var(--accept-color) !important;
      	}




			</style>

			<casper-wizard-page id="confirm" hide-title next$="[[accept]]" previous$="[[reject]]">
				<div class="content"></div>
				<template is="dom-if" if="[[showAlert]]" restamp>
					<div class="alert-container">[[alert]]</div>
				</template>
				<template is="dom-if" if="[[needsReason]]" restamp>
					<paper-input
						id="reason"
						label={{reasonLabel}}
						value="{{reason}}"
						required
					/>
				</template>
			</casper-wizard-page>
		`;
	}

	static get is() {
		return 'casper-wizard-confirm-modal';
	}

	static get properties() {
		return {
			options: {
				type: Object,
				value: function () {
					return {};
				},
			},
			icon: {
				type: String,
				value: 'exclamation',
			},
			accountantPassword: {
				notify: true,
				type: String,
			},
			needsPassword: {
				type: Boolean,
				value: false,
			},
			needsReason: {
				type: Boolean,
				value: false,
			},
			reason: {
				type: String,
				value: undefined,
			},
			optionalReason: {
				type: Boolean,
				value: false,
			},
			showAlert: {
				type: Boolean,
				value: false,
			},
			alert: {
				type: String,
				value: ""
			},
			alertType: {
				type: String,
				value: "info"
			},
			reasonLabel: {
				type: String,
				value: "Motivo de anulação"
			}
		};
	}

	ready() {
		super.ready();

		this.addEventListener(
			'accept-modal',
			() => this._resolve && this._resolve({ ok: true, reason: this.reason })
		);
		this.addEventListener('reject-modal', () => this._reject && this._reject());
		this.defaultOptions = {
			message: 'Tem a certeza que pretende prosseguir?',
			accept: 'sim',
			reject: 'não',
		};

		this.defaultOverrideWizardDimensions = {
			width: '450px',
			height: '230px',
		};

		this.defaultOverrideWizardButtons = {
			previous: {
				style: { display: 'flex' },
				className: 'confirm-reject-button'
			},
			next: {
				style: { display: 'flex' },
				className: 'confirm-accept-button'
			},
		};

		this.setOptions({});
	}

	setOptions(options) {
		if (options.needsReason) {
			this.defaultOverrideWizardDimensions = {
				width: '450px',
				height: '230px',
			};
		} else {
			this.defaultOverrideWizardDimensions = {
				width: '450px',
				height: '230px',
			};
		}


		if ( options.alert ) {
			this.defaultOverrideWizardDimensions = {
				width: '450px',
				height: '450px',
			};
		}

		const wizardDimensions = {
			...this.defaultOverrideWizardDimensions,
			...options.overrideWizardDimensions,
		};
		// Changed functionality to merge button options, not replace
		const wizardButtons =
			options.overrideWizardButtons != undefined
				? {
						previous: {
							...this.defaultOverrideWizardButtons.previous,
							...options.overrideWizardButtons.previous,
						},
						next: {
							...this.defaultOverrideWizardButtons.next,
							...options.overrideWizardButtons.next,
						},
				  }
				: this.defaultOverrideWizardButtons;

		this._closeButton.style.visibility = 'hidden';

		this.overrideWizardDimensions(wizardDimensions);
		if (
			options &&
			options.hideReject &&
			wizardButtons &&
			wizardButtons.previous
		) {
			wizardButtons.previous.display = 'none';
		}
		this.overrideWizardButtons(wizardButtons);

		super.setOptions({ ...this.defaultOptions, ...options });
		if (options.title) {
			super.setTitle(options.title);
		}
	}

	connectedCallback() {
		super.connectedCallback();
		const content = this.shadowRoot.querySelector('.content');
		content.innerHTML = this.options.message;

		this.alert = this.options.alert;

		if ( this.options?.alertType) {
			this.alertType = this.options.alertType;
		}

		this.showAlert = this.options?.alert ? true : false;
		this.hideReject = this.options?.hideReject ? true : false;

		this._resetReason();

		this.$.confirm.setAttribute('next', this.options.accept);
		this.$.confirm.setAttribute('previous', this.options.reject);
		this.appendPagesAndActivate(0);
		this.enablePrevious();

		afterNextRender(this, () => {

			if ( this.showAlert ) {
				this.shadowRoot.querySelector('.alert-container').setAttribute(this.alertType, true)
			}

			if ( this.options && this.options.hideReject) {
				this.hidePrevious();
			} else {
				this.showPrevious();
			}

			super.setOptions({ ...this.defaultOptions, ...this.options });

			if (this.shadowRoot.querySelector('paper-input')) {
				this.shadowRoot.querySelector('paper-input').focus();
				this.shadowRoot
					.querySelector('paper-input')
					.addEventListener('keydown', (e) => this._onKeyDown(e));
			}
		});
	}

	open() {
		super.open();
	}

	connection() {
		return new Promise(
			function (resolve, reject) {
				this.open();
				this._resolve = resolve;
				this._reject = reject;
			}.bind(this)
		);
	}

	_gotoPreviousPage() {
		this.dispatchEvent(
			new CustomEvent('reject-modal', { bubbles: true, composed: true })
		);
		this.close();
	}

	_gotoNextPage() {
		let _canProceed = true;

		if (this.options?.needsReason && !this.optionalReason) {
			_canProceed = this.shadowRoot.querySelector('paper-input').validate();
		}

		if (_canProceed) {
			this.dispatchEvent(
				new CustomEvent('accept-modal', { bubbles: true, composed: true })
			);
			this.close();
		}
	}

	isValid() {
		return true;
	}

	_resetReason() {
		this.needsReason = this.options?.needsReason ? this.options.needsReason : false;
		this.optionalReason = this.options?.optionalReason ? this.options.optionalReason : false;
		this.reasonLabel = this.options?.reasonLabel ? this.options.reasonLabel : "Motivo de anulação";

		this.reason = undefined;
		if (this.shadowRoot.querySelector('paper-input')) {
			this.shadowRoot.querySelector('paper-input').invalid = false;
		}
	}

	_onKeyDown(event) {
		if (event.keyCode == 13) {
			this._gotoNextPage();
		}
	}
}

window.customElements.define(ConfirmWizardConfirmModal.is, ConfirmWizardConfirmModal);
