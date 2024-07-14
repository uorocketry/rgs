// import { outlineWarnBlink } from "$lib/common/styles";
import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
// import "../../../tw.css";

@customElement("rgs-app-shell")
export class AppShell extends LitElement {
    static styles = [
        // outlineWarnBlink,
        css`
            a {
                position: relative;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                background: var(--color-base);
                fill: var(--color-on-base);
                color: var(--color-on-base);
                padding: 0.5rem;
                outline: var(--color-on-base) solid 1px;
                outline-offset: -1px;
                // elipsize text
                white-space: nowrap;
            }

            a:hover {
                outline: 4px solid var(--color-warning);
                outline-offset: -4px;
                animation: outline-blink 0.3s infinite;
            }

            a:hover::before,
            a:focus::before {
                opacity: 1;
            }

            a:before {
                content: attr(data-tooltip);
                outline: var(--color-on-base) solid 1px;
                outline-offset: -1px;
                position: absolute;
                background: var(--color-base);
                color: var(--color-on-base);
                inset-inline-start: 100%;
                left: 100%;
                height: 100%;
                place-content: center;
                padding: 0rem 0.5rem;
                pointer-events: none;
                opacity: 0;
            }

            a:focus {
                outline: 4px solid var(--color-warning);
                outline-offset: -4px;
                animation: outline-blink 0.3s infinite;
            }
        `,
    ];

    @property({ type: String }) href = "";

    @property({ type: String }) icon = "";

    @property({ type: String }) name = "";

    render() {
        // <img src="${this.icon}" alt="${this.name}" class="p-2" />
        return html`
            <a part="base" href="${this.href}" data-tooltip="${this.name}">
                <slot></slot>
            </a>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "rgs-app-shell": AppShell;
    }
}
