import { css, html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import '../../../tw.css';

type ToastConfig = {
	message: string;
	duration: number;
	type: 'info' | 'success' | 'error' | 'warning';
};

type ToastInstance = {
	id: number;
	config: ToastConfig;
	destructor: () => void;
};

@customElement('rgs-toast-man')
export class ToastManager extends LitElement {
	static styles = [
		css`
			:host {
				display: flex;
				flex-direction: column-reverse;
				align-items: flex-end;
				position: absolute;
				gap: 1rem;
				padding: 1rem;
				border: 0;
				inset: 0;
				z-index: 1000;
				pointer-events: none;
			}

			.toast {
				pointer-events: all;
				width: min(20rem, 100%);
				background: var(--color-on-base);
				color: var(--color-on-base);
			}

			.toast-content {
				display: flex;
				align-items: flex-end;
				justify-content: space-between;
				padding: 1rem;
			}

			.progress {
				height: 0.25rem;
				background: var(--color-on-base);
				animation-name: progress;
				animation-duration: var(--duration);
				animation-timing-function: linear;
				animation-fill-mode: forwards;
			}

			@keyframes progress {
				0% {
					width: 100%;
				}
				100% {
					width: 0;
				}
			}

			button {
				cursor: pointer;
				user-select: none;
				color: var(--color-base);
				background: var(--color-on-base);
				width: 2rem;
				height: 2rem;

				// Reset
				border: 0;
				border-width: 0;
				padding-inline: 0;
				padding-block: 0;
				font: inherit;

				// Custom
			}

			span {
				width: fit-content;
			}

			.toast-info {
				background: var(--color-info);
				color: var(--color-on-info);
			}

			.toast-success {
				background: var(--color-success);
				color: var(--color-on-success);
			}

			.toast-error {
				background: var(--color-error);
				color: var(--color-on-error);
			}

			.toast-warning {
				background: var(--color-warning);
				color: var(--color-on-warning);
			}
		`
	];

	@state() toasts: ToastInstance[] = [];

	pushToast(toast: ToastConfig) {
		const id = Math.random();
		const destructor = () => {
			this.toasts = this.toasts.filter((t) => t.id !== id);
		};
		const toastInstance: ToastInstance = {
			id: id,
			config: toast,
			destructor
		};

		this.toasts.push(toastInstance);
		setTimeout(() => {
			destructor();
		}, toast.duration);
	}

	constructor() {
		super();
		// Add some toasts for testing
		this.pushToast({ message: 'Info', duration: 5000, type: 'info' });
		this.pushToast({ message: 'Success', duration: 1000, type: 'success' });
		this.pushToast({ message: 'Error', duration: 2000, type: 'error' });
	}

	render() {
		return html`
			${this.toasts.map(
				(toast) => html`
					<div class="toast toast-${toast.config.type}">
						<div class="toast-content">
							<span> ${toast.config.message} </span>
							<button @click=${toast.destructor}>✕</button>
						</div>
						<div class="progress" style="--duration: ${toast.config.duration}ms"></div>
					</div>
				`
			)}
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'rgs-toast-man': ToastManager;
	}
}
