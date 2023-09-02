import { Editor, Extension, type Range } from '@tiptap/core';
import Suggestion from '@tiptap/suggestion';

import tippy from 'tippy.js';

import {
	CheckSquare,
	Code,
	Heading1,
	Heading2,
	Heading3,
	List,
	ListOrdered,
	MessageSquarePlus,
	Text,
	TextQuote
} from 'lucide-svelte';
import CommandList from './CommandList.svelte';
// import { toast } from 'sonner';
// import va from '@vercel/analytics';
// import { startImageUpload } from '@/ui/editor/plugins/upload-images';
import { Magic } from '$lib/ui/icons/index.js';
import type { SvelteComponent } from 'svelte';

export interface CommandItemProps {
	title: string;
	description: string;
	icon: SvelteComponent;
}

interface CommandProps {
	editor: Editor;
	range: Range;
}

const Command = Extension.create({
	name: 'slash-command',
	addOptions() {
		return {
			suggestion: {
				char: '/',
				command: ({ editor, range, props }: { editor: Editor; range: Range; props: any }) => {
					props.command({ editor, range });
				}
			}
		};
	},
	addProseMirrorPlugins() {
		return [
			Suggestion({
				editor: this.editor,
				...this.options.suggestion
			})
		];
	}
});

const getSuggestionItems = ({ query }: { query: string }) => {
	return [
		{
			title: 'Continue writing',
			description: 'Use AI to expand your thoughts.',
			searchTerms: ['gpt'],
			icon: Magic
		},
		{
			title: 'Send Feedback',
			description: 'Let us know how we can improve.',
			icon: MessageSquarePlus,
			command: ({ editor, range }: CommandProps) => {
				editor.chain().focus().deleteRange(range).run();
				window.open('/feedback', '_blank');
			}
		},
		{
			title: 'Text',
			description: 'Just start typing with plain text.',
			searchTerms: ['p', 'paragraph'],
			icon: Text,
			command: ({ editor, range }: CommandProps) => {
				editor.chain().focus().deleteRange(range).toggleNode('paragraph', 'paragraph').run();
			}
		},
		{
			title: 'To-do List',
			description: 'Track tasks with a to-do list.',
			searchTerms: ['todo', 'task', 'list', 'check', 'checkbox'],
			icon: CheckSquare,
			command: ({ editor, range }: CommandProps) => {
				editor.chain().focus().deleteRange(range).toggleTaskList().run();
			}
		},
		{
			title: 'Heading 1',
			description: 'Big section heading.',
			searchTerms: ['title', 'big', 'large'],
			icon: Heading1,
			command: ({ editor, range }: CommandProps) => {
				editor.chain().focus().deleteRange(range).setNode('heading', { level: 1 }).run();
			}
		},
		{
			title: 'Heading 2',
			description: 'Medium section heading.',
			searchTerms: ['subtitle', 'medium'],
			icon: Heading2,
			command: ({ editor, range }: CommandProps) => {
				editor.chain().focus().deleteRange(range).setNode('heading', { level: 2 }).run();
			}
		},
		{
			title: 'Heading 3',
			description: 'Small section heading.',
			searchTerms: ['subtitle', 'small'],
			icon: Heading3,
			command: ({ editor, range }: CommandProps) => {
				editor.chain().focus().deleteRange(range).setNode('heading', { level: 3 }).run();
			}
		},
		{
			title: 'Bullet List',
			description: 'Create a simple bullet list.',
			searchTerms: ['unordered', 'point'],
			icon: List,
			command: ({ editor, range }: CommandProps) => {
				editor.chain().focus().deleteRange(range).toggleBulletList().run();
			}
		},
		{
			title: 'Numbered List',
			description: 'Create a list with numbering.',
			searchTerms: ['ordered'],
			icon: ListOrdered,
			command: ({ editor, range }: CommandProps) => {
				editor.chain().focus().deleteRange(range).toggleOrderedList().run();
			}
		},
		{
			title: 'Quote',
			description: 'Capture a quote.',
			searchTerms: ['blockquote'],
			icon: TextQuote,
			command: ({ editor, range }: CommandProps) =>
				editor
					.chain()
					.focus()
					.deleteRange(range)
					.toggleNode('paragraph', 'paragraph')
					.toggleBlockquote()
					.run()
		},
		{
			title: 'Code',
			description: 'Capture a code snippet.',
			searchTerms: ['codeblock'],
			icon: Code,
			command: ({ editor, range }: CommandProps) =>
				editor.chain().focus().deleteRange(range).toggleCodeBlock().run()
		}
		// {
		// 	title: 'Image',
		// 	description: 'Upload an image from your computer.',
		// 	searchTerms: ['photo', 'picture', 'media'],
		// 	// icon: <ImageIcon size={18} />,
		// 	command: ({ editor, range }: CommandProps) => {
		// 		editor.chain().focus().deleteRange(range).run();
		// 		// upload image
		// 		const input = document.createElement('input');
		// 		input.type = 'file';
		// 		input.accept = 'image/*';
		// 		input.onchange = async () => {
		// 			if (input.files?.length) {
		// 				const file = input.files[0];
		// 				const pos = editor.view.state.selection.from;
		// 				// startImageUpload(file, editor.view, pos);
		// 			}
		// 		};
		// 		input.click();
		// 	}
		// }
	].filter((item) => {
		if (typeof query === 'string' && query.length > 0) {
			const search = query.toLowerCase();
			return (
				item.title.toLowerCase().includes(search) ||
				item.description.toLowerCase().includes(search) ||
				(item.searchTerms && item.searchTerms.some((term: string) => term.includes(search)))
			);
		}
		return true;
	});
};

export const updateScrollView = (container: HTMLElement, item: HTMLElement) => {
	const containerHeight = container.offsetHeight;
	const itemHeight = item ? item.offsetHeight : 0;

	const top = item.offsetTop;
	const bottom = top + itemHeight;

	if (top < container.scrollTop) {
		container.scrollTop -= container.scrollTop - top + 5;
	} else if (bottom > containerHeight + container.scrollTop) {
		container.scrollTop += bottom - containerHeight - container.scrollTop + 5;
	}
};

const renderItems = () => {
	let component: CommandList | null = null;
	let popup: any | null = null;

	return {
		onStart: (props: { editor: Editor; clientRect: DOMRect }) => {
			// component = new SvelteRenderer(CommandList, {
			// 	props,
			// 	editor: props.editor
			// });

			// component.dom;
			const el = document.createElement('div');
			component = new CommandList({
				target: el,
				props: props as any
			});

			popup = (tippy as any)('body', {
				getReferenceClientRect: props.clientRect,
				appendTo: () => document.body,
				content: el,
				showOnCreate: true,
				interactive: true,
				trigger: 'manual',
				placement: 'bottom-start'
			});
		},
		onUpdate: (props: { editor: Editor; clientRect: DOMRect }) => {
			component?.$set(props);

			popup &&
				popup[0].setProps({
					getReferenceClientRect: props.clientRect
				});
		},
		onKeyDown: (props: { event: KeyboardEvent }) => {
			if (props.event.key === 'Escape') {
				popup?.[0].hide();

				return true;
			}

			// return component?.ref?.onKeyDown(props);
		},
		onExit: () => {
			popup?.[0].destroy();
			// component?.destroy();
			component?.$destroy();
		}
	};
};

const SlashCommand = Command.configure({
	suggestion: {
		items: getSuggestionItems,
		render: renderItems
	}
});

export default SlashCommand;
