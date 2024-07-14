import type { TemplateResult } from 'lit-html';
import { render } from 'lit-html';

// Svelte binding to render a lit template
export function lit(node: HTMLElement, template: TemplateResult) {
	render(template, node);
}
