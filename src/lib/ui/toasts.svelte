<script lang="ts" context="module">
	import { createToaster, melt } from '@melt-ui/svelte';

	type ToastData = {
		text: string;
		type: 'success' | 'warning' | 'error' | 'loading';
	};

	const {
		elements: { content, description },
		helpers,
		states: { toasts },
		actions: { portal }
	} = createToaster<ToastData>({
		closeDelay: 5000
	});

	export const addToast = helpers.addToast;
	export const removeToast = helpers.removeToast;
	export const updateToast = helpers.updateToast;
</script>

<script lang="ts">
	import { AlertCircle, CheckCircle, Loader, XCircle } from 'lucide-svelte';
	import { flip } from 'svelte/animate';
	import { fly } from 'svelte/transition';

	const iconMap: Record<ToastData['type'], any> = {
		success: CheckCircle,
		warning: AlertCircle,
		error: XCircle,
		loading: Loader
	};
</script>

<div
	class="fixed right-0 top-0 z-50 m-4 flex flex-col items-end gap-2 md:bottom-0 md:top-auto"
	use:portal
>
	{#each $toasts as { id, data } (id)}
		<div
			use:melt={$content(id)}
			animate:flip={{ duration: 500 }}
			in:fly={{ duration: 150, x: '100%' }}
			out:fly={{ duration: 150, x: '100%' }}
			class="rounded-xl bg-stone-100 border border-stone-300 text-stone-700 shadow
			flex w-[24rem] max-w-[calc(100vw-2rem)] items-center gap-2 p-4"
		>
			<svelte:component this={iconMap[data.type]} class="square-6" />
			<p class="leading-relaxed" use:melt={$description(id)}>
				{data.text}
			</p>
		</div>
	{/each}
</div>
