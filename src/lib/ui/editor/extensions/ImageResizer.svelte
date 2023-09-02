<script lang="ts">
	import { anyify } from '$lib/utils.js';
	import Moveable from 'svelte-moveable';

	export let editor: any;

	const updateMediaSize = () => {
		const imageInfo = document.querySelector('.ProseMirror-selectednode') as HTMLImageElement;
		if (imageInfo) {
			const selection = editor.state.selection;
			editor.commands.setImage({
				src: imageInfo.src,
				width: Number(imageInfo.style.width.replace('px', '')),
				height: Number(imageInfo.style.height.replace('px', ''))
			});
			editor.commands.setNodeSelection(selection.from);
		}
	};

	// Hacky hack, sorry code police!
	let key = 0;
</script>

{#key key}
	<Moveable
		target={anyify(document.querySelector('.ProseMirror-selectednode'))}
		container={null}
		origin={false}
		edge={false}
		throttleDrag={0}
		keepRatio={true}
		resizable={true}
		throttleResize={0}
		on:resize={({
			detail: {
				target,
				width,
				height,
				// dist,
				delta
			}
		}) => {
			delta[0] && (target.style.width = `${width}px`);
			delta[1] && (target.style.height = `${height}px`);
		}}
		on:resizeEnd={() => {
			updateMediaSize();
			key++;
		}}
		scalable={true}
		throttleScale={0}
		renderDirections={['w', 'e']}
		on:scale={({
			detail: {
				target,
				// scale,
				// dist,
				// delta,
				transform
			}
		}) => {
			target.style.transform = transform;
		}}
	/>
{/key}
