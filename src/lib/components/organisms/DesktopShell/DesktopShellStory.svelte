<script lang="ts">
	import DesktopShell from './DesktopShell.svelte';
	import type { DesktopWindow } from './DesktopShell.svelte';

	let windows = $state<DesktopWindow[]>([
		{ id: 'a', title: 'Files', rect: { x: 32, y: 24, w: 340, h: 260, z: 2 } },
		{ id: 'b', title: 'Mail', rect: { x: 200, y: 80, w: 400, h: 300, z: 3 } },
		{ id: 'c', title: 'Music', rect: { x: 380, y: 40, w: 320, h: 240, z: 1 } }
	]);
	let activeId = $state<string | null>('b');
</script>

<DesktopShell bind:windows bind:activeId>
	{#snippet render(win)}
		<div class="p-4 text-sm text-secondary">
			Content for <strong class="text-primary">{win.title}</strong>
		</div>
	{/snippet}
</DesktopShell>
