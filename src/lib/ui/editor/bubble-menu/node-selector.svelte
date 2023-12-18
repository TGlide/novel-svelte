<script lang="ts">
	import { createPopover, melt } from '@melt-ui/svelte';
	import type { Editor } from '@tiptap/core';
	import {
		Check,
		ChevronDown,
		Heading1,
		Heading2,
		Heading3,
		TextQuote,
		ListOrdered,
		TextIcon,
		Code,
		CheckSquare
	} from 'lucide-svelte';

	export let editor: Editor;
	export let isOpen: boolean;

	$: items = [
		{
			name: 'Text',
			icon: TextIcon,
			command: () => editor.chain().focus().toggleNode('paragraph', 'paragraph').run(),
			// I feel like there has to be a more efficient way to do this – feel free to PR if you know how!
			isActive:
				editor.isActive('paragraph') &&
				!editor.isActive('bulletList') &&
				!editor.isActive('orderedList')
		},
		{
			name: 'Heading 1',
			icon: Heading1,
			command: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
			isActive: editor.isActive('heading', { level: 1 })
		},
		{
			name: 'Heading 2',
			icon: Heading2,
			command: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
			isActive: editor.isActive('heading', { level: 2 })
		},
		{
			name: 'Heading 3',
			icon: Heading3,
			command: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
			isActive: editor.isActive('heading', { level: 3 })
		},
		{
			name: 'To-do List',
			icon: CheckSquare,
			command: () => editor.chain().focus().toggleTaskList().run(),
			isActive: editor.isActive('taskItem')
		},
		{
			name: 'Bullet List',
			icon: ListOrdered,
			command: () => editor.chain().focus().toggleBulletList().run(),
			isActive: editor.isActive('bulletList')
		},
		{
			name: 'Numbered List',
			icon: ListOrdered,
			command: () => editor.chain().focus().toggleOrderedList().run(),
			isActive: editor.isActive('orderedList')
		},
		{
			name: 'Quote',
			icon: TextQuote,
			command: () =>
				editor.chain().focus().toggleNode('paragraph', 'paragraph').toggleBlockquote().run(),
			isActive: editor.isActive('blockquote')
		},
		{
			name: 'Code',
			icon: Code,
			command: () => editor.chain().focus().toggleCodeBlock().run(),
			isActive: editor.isActive('codeBlock')
		}
	];

	$: activeItem = items.filter((item) => item.isActive).pop() ?? {
		name: 'Multiple'
	};

	const {
		elements: { trigger, content },
		states: { open: localOpen }
	} = createPopover({
		defaultOpen: isOpen,
		onOpenChange({ next }) {
			isOpen = next;
			return next;
		}
	});

	$: localOpen.set(isOpen);
</script>

<div>
	<div class="relative h-full">
		<button
			use:melt={$trigger}
			class="flex h-full items-center gap-1 whitespace-nowrap p-2 text-sm font-medium text-stone-600 hover:bg-stone-100 active:bg-stone-200"
			type="button"
		>
			<span>{activeItem?.name}</span>
			<ChevronDown class="h-4 w-4" />
		</button>

		<div
			use:melt={$content}
			align="start"
			class="z-[99999] my-1 flex max-h-80 w-48 flex-col overflow-hidden overflow-y-auto rounded border border-stone-200 bg-white p-1 shadow-xl animate-in fade-in slide-in-from-top-1"
		>
			{#each items as item, index (index)}
				<button
					on:click={() => {
						item.command();
						isOpen = false;
					}}
					class="flex items-center justify-between rounded-sm px-2 py-1 text-sm text-stone-600 hover:bg-stone-100"
					type="button"
				>
					<div class="flex items-center space-x-2">
						<div class="rounded-sm border border-stone-200 p-1">
							<svelte:component this={item.icon} class="h-3 w-3" />
						</div>
						<span>{item.name}</span>
					</div>
					{#if activeItem.name === item.name}
						<Check class="h-4 w-4" />
					{/if}
				</button>
			{/each}
		</div>
	</div>
</div>
