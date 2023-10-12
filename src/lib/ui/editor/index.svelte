<script lang="ts">
	// import 'cal-sans';
	import '../../styles/index.css';
	import '../../styles/prosemirror.css';
	import '../../styles/tailwind.css';

	import { getPrevText } from '$lib/editor.js';
	import { createLocalStorageStore } from '$lib/stores/localStorage.js';
	import { createDebouncedCallback, noop } from '$lib/utils.js';
	import { Editor, Extension, type JSONContent } from '@tiptap/core';
	import type { EditorProps } from '@tiptap/pm/view';
	import { useCompletion } from 'ai/svelte';
	import ImageResizer from './extensions/ImageResizer.svelte';
	import { onMount } from 'svelte';
	import { defaultEditorContent } from './default-content.js';
	import { defaultExtensions } from './extensions/index.js';
	import { defaultEditorProps } from './props.js';
	import Toasts, { addToast } from '../toasts.svelte';

	import EditorBubbleMenu from './bubble-menu/index.svelte';

	/**
	 * The API route to use for the OpenAI completion API.
	 * Defaults to "/api/generate".
	 */
	export let completionApi = '/api/generate';
	/**
	 * Additional classes to add to the editor container.
	 * Defaults to "relative min-h-[500px] w-full max-w-screen-lg border-stone-200 bg-white p-12 px-8 sm:mb-[calc(20vh)] sm:rounded-lg sm:border sm:px-12 sm:shadow-lg".
	 */
	let className =
		'relative min-h-[500px] w-full max-w-screen-lg border-stone-200 bg-white p-12 pb-24 sm:pb-12 px-8 sm:mb-[calc(20vh)] sm:rounded-lg sm:border sm:px-12 sm:shadow-lg';
	export { className as class };
	/**
	 * The default value to use for the editor.
	 * Defaults to defaultEditorContent.
	 */
	export let defaultValue: JSONContent | string = defaultEditorContent;
	/**
	 * A list of extensions to use for the editor, in addition to the default Novel extensions.
	 * Defaults to [].
	 */
	export let extensions: Extension[] = [];
	/**
	 * Props to pass to the underlying Tiptap editor, in addition to the default Novel editor props.
	 * Defaults to {}.
	 */
	export let editorProps: EditorProps = {};
	/**
	 * A callback function that is called whenever the editor is updated.
	 * Defaults to () => {}.
	 */
	export let onUpdate: (editor?: Editor) => void | Promise<void> = noop;
	/**
	 * A callback function that is called whenever the editor is updated, but only after the defined debounce duration.
	 * Defaults to () => {}.
	 */
	export let onDebouncedUpdate: (editor?: Editor) => void | Promise<void> = noop;
	/**
	 * The duration (in milliseconds) to debounce the onDebouncedUpdate callback.
	 * Defaults to 750.
	 */
	export let debounceDuration = 750;
	/**
	 * The key to use for storing the editor's value in local storage.
	 * Defaults to "novel__content".
	 */
	export let storageKey = 'novel__content';

	let element: Element;
	let editor: Editor;

	const { complete, completion, isLoading, stop } = useCompletion({
		id: 'novel',
		api: completionApi,
		onFinish: (_prompt, completion) => {
			editor?.commands.setTextSelection({
				from: editor.state.selection.from - completion.length,
				to: editor.state.selection.from
			});
		},
		onError: (err) => {
			addToast({
				data: {
					text: err.message,
					type: 'error'
				}
			});
			// if (err.message === 'You have reached your request limit for the day.') {
			// 	va.track('Rate Limit Reached');
			// }
		}
	});

	const content = createLocalStorageStore(storageKey, defaultValue);
	let hydrated = false;
	$: if (editor && $content && !hydrated) {
		editor.commands.setContent($content);
		hydrated = true;
	}

	let prev = '';

	function insertAiCompletion() {
		const diff = $completion.slice(prev.length);

		prev = $completion;
		editor?.commands.insertContent(diff);
	}

	$: {
		[$completion];
		insertAiCompletion();
	}

	const debouncedUpdates = createDebouncedCallback(async ({ editor }) => {
		const json = editor.getJSON();
		content.set(json);
		onDebouncedUpdate(editor);
	}, debounceDuration);

	onMount(() => {
		editor = new Editor({
			element: element,
			onTransaction: () => {
				// force re-render so `editor.isActive` works as expected
				editor = editor;
			},
			extensions: [...defaultExtensions, ...extensions],
			editorProps: {
				...defaultEditorProps,
				...editorProps
			},
			onUpdate: (e) => {
				const selection = e.editor.state.selection;
				const lastTwo = getPrevText(e.editor, {
					chars: 2
				});

				if (lastTwo === '++' && !$isLoading) {
					e.editor.commands.deleteRange({
						from: selection.from - 2,
						to: selection.from
					});
					complete(
						getPrevText(e.editor, {
							chars: 5000
						})
					);
					// complete(e.editor.storage.markdown.getMarkdown());
				} else {
					onUpdate(e.editor);
					debouncedUpdates(e);
				}
			},
			autofocus: 'end'
		});

		return () => editor.destroy();
	});
</script>

{#if editor && editor.isEditable}
	<EditorBubbleMenu {editor} />
{/if}

<div id="editor" class={className} bind:this={element}>
	<slot />
	{#if editor?.isActive('image')}
		<ImageResizer {editor} />
	{/if}
</div>

<Toasts />
