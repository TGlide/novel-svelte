<script lang="ts">
	import Github from './github.svelte';
	import ThemeSwitch from './theme-switch.svelte';
</script>

<div
	class="flex justify-between px-4 py-4 fixed z-[9999] bottom-0 border-t border-stone-200 
	sm:border-none sm:bottom-[unset] sm:bg-transparent sm:top-0 bg-white w-full"
>
	<a
		href="https://github.com/tglide/novel-svelte"
		target="_blank"
		class="rounded-lg p-2 transition-colors duration-200 hover:bg-stone-100"
	>
		<Github />
	</a>
	<ThemeSwitch />
</div>
