<script lang="ts">
	import PhoneFrame from './PhoneFrame.svelte';
	import AppBar from '$lib/components/molecules/AppBar/AppBar.svelte';
</script>

<PhoneFrame>
	<AppBar title="Phone frame" sticky={false} safeTop={false} showBack />
	<div class="space-y-2 p-4">
		<p class="text-sm text-secondary">
			Use PhoneFrame to preview mobile layouts with notch and home indicator.
		</p>
		{#each [1, 2, 3] as n}
			<div class="rounded-xl border border-border bg-surface-elevated px-3 py-3 text-sm text-primary">
				Card {n}
			</div>
		{/each}
	</div>
</PhoneFrame>
