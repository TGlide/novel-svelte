<script lang="ts">
	import { LoadingCircle } from '$lib/ui/icons/index.js';
	import type { CommandItemProps } from './slash-command.js';

	export let items: CommandItemProps[] = [];
	export let command: any;
	export let editor: any;
	export let range: any;
</script>

<p>SVELTE</p>
<LoadingCircle />
{JSON.stringify({ items, command, range })}
