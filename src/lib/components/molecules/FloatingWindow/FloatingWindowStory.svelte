<script lang="ts">
	import FloatingWindow from './FloatingWindow.svelte';
	import type { WindowRect } from './FloatingWindow.svelte';

	let rect = $state<WindowRect>({ x: 40, y: 40, w: 420, h: 280, z: 2 });
</script>

<div class="relative h-[28rem] overflow-hidden rounded-xl border border-border bg-surface">
	<FloatingWindow bind:rect title="Notes" active>
		<div class="space-y-2 p-4 text-sm text-secondary">
			<p>Drag the title bar to move. Resize from edges or corners.</p>
			<p class="text-muted">Double-click the title bar to maximize.</p>
			<pre class="rounded-lg bg-surface-overlay p-2 text-xs text-muted">{JSON.stringify(rect, null, 2)}</pre>
		</div>
	</FloatingWindow>
</div>
