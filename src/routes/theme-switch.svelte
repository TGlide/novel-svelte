<script lang="ts">
	import { browser } from '$app/environment';
	import { createLocalStorageStore } from '$lib/stores/localStorage.js';
	import { createDropdownMenu, melt } from '@melt-ui/svelte';
	import { Monitor, Moon, Sun } from 'lucide-svelte';

	const theme = createLocalStorageStore('theme', 'system');

	const {
		elements: { trigger, menu, item },
		states: { open }
	} = createDropdownMenu({
		forceVisible: true,
		preventScroll: false
	});

	const handleThemeSwitch = (themePref: string) => {
		theme.set(themePref);
		const darkThemeMq = window.matchMedia('(prefers-color-scheme: dark)');

		if (themePref === 'dark') {
			document.documentElement.classList.add('dark-theme');
			document.documentElement.style.colorScheme = 'dark';
		} else if (themePref === 'light') {
			document.documentElement.classList.remove('dark-theme');
			document.documentElement.style.colorScheme = 'light';
		} else if (darkThemeMq.matches) {
			document.documentElement.classList.add('dark-theme');
			document.documentElement.style.colorScheme = 'dark';
		}
	};
</script>

{#if browser}
	<button
		type="button"
		class="rounded-lg p-2 transition-colors duration-200 hover:bg-stone-100"
		use:melt={$trigger}
		aria-label="Update dimensions"
	>
		{#if $theme === 'system'}
			<Monitor class="square-5" />
		{:else if $theme === 'dark'}
			<Moon class="square-5" />
		{:else if $theme === 'light'}
			<Sun class="square-5" />
		{/if}
		<span class="sr-only">Open Dropdown menu</span>
	</button>
{/if}

{#if $open}
	<div class="border-stone-200 border rounded-md p-2 flex flex-col" use:melt={$menu}>
		<button
			class="flex items-center gap-2 data-[highlighted]:bg-stone-100 p-2 rounded-[5px]"
			use:melt={$item}
			on:click={() => handleThemeSwitch('system')}
		>
			<Monitor class="square-4" />
			System
		</button>
		<button
			class="flex items-center gap-2 data-[highlighted]:bg-stone-100 p-2 rounded-[5px]"
			use:melt={$item}
			on:click={() => handleThemeSwitch('dark')}
		>
			<Moon class="square-4" />
			Dark
		</button>
		<button
			class="flex items-center gap-2 data-[highlighted]:bg-stone-100 p-2 rounded-[5px]"
			use:melt={$item}
			on:click={() => handleThemeSwitch('light')}
		>
			<Sun class="square-4" />
			Light
		</button>
	</div>
{/if}
