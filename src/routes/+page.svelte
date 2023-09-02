<script lang="ts">
	import { Editor } from '$lib/index.js';
	import Nav from './nav.svelte';
	

	let saveStatus = 'Saved';
</script>

<Nav />

<main class="flex justify-center sm:pt-[15vh] sm:px-4">
	<Editor
		onUpdate={() => {
			saveStatus = 'Unsaved';
		}}
		onDebouncedUpdate={() => {
			saveStatus = 'Saving...';
			// Simulate a delay in saving.
			setTimeout(() => {
				saveStatus = 'Saved';
			}, 500);
		}}
	>
		<div
			class="absolute right-5 top-5 z-10 mb-5 rounded-lg bg-stone-100 px-2 py-1 text-sm text-stone-400"
		>
			{saveStatus}
		</div>
	</Editor>
</main>
