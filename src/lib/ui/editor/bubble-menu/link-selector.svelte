<script lang="ts">
	import { anyify, cn, getUrlFromString } from '$lib/utils.js';
	import type { Editor } from '@tiptap/core';
	import { Check, Trash } from 'lucide-svelte';

	export let editor: Editor;
	export let isOpen: boolean;

	let inputRef: HTMLInputElement | null;
</script>

<div class="relative">
	<button
		type="button"
		class="flex h-full items-center space-x-2 px-3 py-1.5 text-sm font-medium text-stone-600 hover:bg-stone-100 active:bg-stone-200"
		on:click={() => {
			isOpen = !isOpen;
		}}
	>
		<p class="text-base">↗</p>
		<p
			class={cn('underline decoration-stone-400 underline-offset-4', {
				'text-blue-500': editor.isActive('link')
			})}
		>
			Link
		</p>
	</button>
	{#if isOpen}
		<form
			on:submit={(e) => {
				e.preventDefault();
				const input = anyify(e.target)[0];
				const url = getUrlFromString(input.value);
				url && editor.chain().focus().setLink({ href: url }).run();
				isOpen = false;
			}}
			class="fixed top-full z-[99999] mt-1 flex w-60 overflow-hidden rounded border border-stone-200 bg-white p-1 shadow-xl animate-in fade-in slide-in-from-top-1"
		>
			<!-- svelte-ignore a11y-autofocus -->
			<input
				autofocus
				bind:this={inputRef}
				type="text"
				placeholder="Paste a link"
				class="flex-1 bg-white p-1 text-sm outline-none"
				value={editor.getAttributes('link').href || ''}
			/>
			{#if editor.getAttributes('link').href}
				<button
					type="button"
					class="flex items-center rounded-sm p-1 text-red-600 transition-all hover:bg-red-100 dark:hover:bg-red-800"
					on:click={() => {
						editor.chain().focus().unsetLink().run();
						isOpen = false;
					}}
				>
					<Trash class="h-4 w-4" />
				</button>
			{:else}
				<button
					class="flex items-center rounded-sm p-1 text-stone-600 transition-all hover:bg-stone-100"
				>
					<Check class="h-4 w-4" />
				</button>
			{/if}
		</form>
	{/if}
</div>
