import type { SvelteComponent } from 'svelte';

interface RendererOptions {
	element: HTMLElement;
}

export class SvelteRenderer {
	component: string;
	dom: HTMLElement;

	constructor(component: string, { element }: RendererOptions) {
		this.component = component;
		this.dom = element;

		this.dom.classList.add('svelte-renderer');
	}

	// updateProps(props: any): void {
	// 	this.component.$set(props);
	// }

	// destroy(): void {
	// 	this.component.$destroy();
	// }
}
