<script lang="ts">
	import { getPrevText } from '$lib/editor.js';
	import { LoadingCircle } from '$lib/ui/icons/index.js';
	import { useCompletion } from 'ai/svelte';
	import type { CommandItemProps } from './slash-command.js';
	import { anyify } from '$lib/utils.js';
	import { addToast } from '$lib/ui/toasts.svelte';

	export let items: CommandItemProps[] = [];
	export let command: any;
	export let editor: any;
	export let range: any;

	let selectedIndex = 0;

	const { complete, isLoading } = useCompletion({
		id: 'novel',
		api: '/api/generate',
		onResponse: (response) => {
			if (response.status === 429) {
				addToast({
					data: {
						text: 'You have reached your request limit for the day.',
						type: 'error'
					}
				});
				// va.track('Rate Limit Reached');
				return;
			}
			editor.chain().focus().deleteRange(range).run();
		},
		onFinish: (_prompt, completion) => {
			// highlight the generated text
			editor.commands.setTextSelection({
				from: range.from,
				to: range.from + completion.length
			});
		},
		onError: (e) => {
			addToast({
				data: {
					text: e.message,
					type: 'error'
				}
			});
		}
	});

	const selectItem = (index: number) => {
		const item = items[index];
		// va.track('Slash Command Used', {
		// 	command: item.title
		// });
		if (item) {
			if (item.title === 'Continue writing') {
				if ($isLoading) return;
				complete(
					getPrevText(editor, {
						chars: 5000,
						offset: 1
					})
				);
			} else {
				command(item);
			}
		}
	};

	const navigationKeys = ['ArrowUp', 'ArrowDown', 'Enter'];
	const onKeyDown = (e: KeyboardEvent) => {
		if (!navigationKeys.includes(e.key)) return;
		e.preventDefault();
		if (e.key === 'ArrowUp') {
			selectedIndex = (selectedIndex + items.length - 1) % items.length;
		} else if (e.key === 'ArrowDown') {
			selectedIndex = (selectedIndex + 1) % items.length;
		} else if (e.key === 'Enter') {
			selectItem(selectedIndex);
		}

		const item = container.querySelector(`[data-index="${selectedIndex}"]`) as HTMLElement;
		if (item)
			item.scrollIntoView({
				block: 'nearest'
			});
	};

	let container: HTMLElement;
</script>

<svelte:window on:keydown={onKeyDown} />

{#if items.length > 0}
	<div
		id="slash-command"
		class="z-50 h-auto max-h-[330px] w-72 overflow-y-auto rounded-md border border-stone-200 bg-white px-1 py-2 shadow-md transition-all"
		bind:this={container}
	>
		{#each items as item, index (index)}
			<button
				class="flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm text-stone-900 hover:bg-stone-100 scroll-my-2
				{index === selectedIndex ? 'bg-stone-100 text-stone-900' : ''}"
				on:click={() => selectItem(index)}
				data-index={index}
			>
				<div
					class="flex h-10 w-10 items-center justify-center rounded-md border border-stone-200 bg-white"
				>
					{#if item.title === 'Continue writing' && $isLoading}
						<LoadingCircle />
					{:else}
						<svelte:component this={anyify(item.icon)} size="18" />
					{/if}
				</div>
				<div>
					<p class="font-medium">{item.title}</p>
					<p class="text-xs text-stone-500">{item.description}</p>
				</div>
			</button>
		{/each}
	</div>
{/if}
